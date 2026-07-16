import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Procedural fountain library.
//
// Every fountain is built by REVOLVING an ornate 2D profile (a "lathe"), the
// same way a real stone-turner shapes a baluster or a bowl. Profiles are lists
// of [radius, height] points. We then optionally add vertical "flutes" (the
// carved grooves you see on classical columns and scalloped bowl lips) by
// rippling each vertex's radius with a cosine of its angle. Stacking a plinth,
// bowls, turned stems and a finial gives genuinely intricate, Roman-looking
// fountains — not blocky primitives.
// ---------------------------------------------------------------------------

export interface WaterRing {
  y: number;
  r: number;
  square?: boolean;
}

export interface FountainSpec {
  // Number of independently width-adjustable layers (0 = only overall size).
  tierCount: number;
  layerLabels: string[];
  build: (stoneColor: string, scales?: number[]) => THREE.Group;
  measure: (scales?: number[]) => { waters: WaterRing[]; selR: number; height: number };
}

function labelsFor(n: number): string[] {
  if (n <= 1) return ['Width'];
  if (n === 2) return ['Bottom', 'Top'];
  if (n === 3) return ['Bottom', 'Middle', 'Top'];
  return Array.from({ length: n }, (_, i) =>
    i === 0 ? 'Base' : i === n - 1 ? 'Top' : `Tier ${i + 1}`
  );
}

// Wrap a fixed (non-tiered) fountain into the FountainSpec shape.
function staticSpec(
  build: (c: string) => THREE.Group,
  waters: WaterRing[],
  selR: number,
  height: number
): FountainSpec {
  return {
    tierCount: 0,
    layerLabels: [],
    build: (c) => build(c),
    measure: () => ({ waters, selR, height }),
  };
}

type Pt = [number, number];

function marble(color: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.45,
    metalness: 0.02,
    envMapIntensity: 1.1,
    flatShading: false,
  });
}

// Revolve a profile; optionally carve vertical flutes/scallops into it.
function lathe(
  profile: Pt[],
  mat: THREE.Material,
  opts: { segments?: number; flutes?: number; fluteDepth?: number; y?: number } = {}
): THREE.Mesh {
  const pts = profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 0), y));
  const seg = opts.segments ?? 80;
  const geo = new THREE.LatheGeometry(pts, seg);

  if (opts.flutes) {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const depth = opts.fluteDepth ?? 0.03;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const r = Math.hypot(v.x, v.z);
      if (r < 0.02) continue;
      const theta = Math.atan2(v.z, v.x);
      const nr = r + Math.cos(theta * opts.flutes) * depth;
      v.x = Math.cos(theta) * nr;
      v.z = Math.sin(theta) * nr;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true;
  }

  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = opts.y ?? 0;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// A hollow basin bowl profile that actually holds water (over the lip and back
// down to an inner floor).
function bowlProfile(rTop: number, lipH: number, wall = 0.16, floorH = 0.3, rFoot = 0.55): Pt[] {
  const rInner = Math.max(rTop - wall, 0.2);
  return [
    [rFoot, 0],
    [rFoot * 1.2, 0.05],
    [rTop * 0.55, lipH * 0.45],
    [rTop * 0.9, lipH * 0.8],
    [rTop, lipH - 0.07],
    [rTop, lipH], // outer lip
    [rInner, lipH], // over the lip
    [rInner, floorH + 0.14],
    [rInner * 0.55, floorH],
    [0.1, floorH], // inner floor to centre
  ];
}

function waterFor(rTop: number, lipH: number, wall = 0.16, floorH = 0.3): WaterRing {
  return { y: floorH + 0.05, r: Math.max(rTop - wall - 0.05, 0.15) };
}

// A shaped, turned baluster stem between two tiers.
function stemProfile(h: number, rBase = 0.5): Pt[] {
  return [
    [rBase, 0],
    [rBase * 0.78, 0.06],
    [rBase * 0.5, 0.18],
    [rBase * 0.82, 0.32],
    [rBase * 0.44, 0.52],
    [rBase * 0.36, h - 0.2],
    [rBase * 0.6, h - 0.06],
    [rBase * 0.5, h],
  ];
}

// A stepped, moulded plinth the whole fountain stands on.
function plinthProfile(r: number, h = 0.55): Pt[] {
  return [
    [r, 0],
    [r, h * 0.34],
    [r - 0.16, h * 0.4],
    [r - 0.16, h * 0.68],
    [r - 0.34, h * 0.74],
    [r - 0.34, h],
    [r - 0.34, h],
    [0, h],
  ];
}

function finial(mat: THREE.Material, y: number, scale = 1): THREE.Group {
  const g = new THREE.Group();
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.18 * scale, 20, 16), mat);
  ball.position.y = y + 0.2 * scale;
  ball.castShadow = true;
  const spike = new THREE.Mesh(new THREE.ConeGeometry(0.07 * scale, 0.3 * scale, 16), mat);
  spike.position.y = y + 0.45 * scale;
  spike.castShadow = true;
  g.add(ball, spike);
  return g;
}

// Small lion-head / mascaron spouts jutting from a basin wall.
function spouts(mat: THREE.Material, r: number, y: number, count = 4): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 12), mat);
    head.scale.set(1, 1.1, 0.8);
    head.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    head.castShadow = true;
    const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.16, 10), mat);
    lip.rotation.z = Math.PI / 2;
    lip.rotation.y = -a;
    lip.position.set(Math.cos(a) * (r + 0.08), y - 0.05, Math.sin(a) * (r + 0.08));
    g.add(head, lip);
  }
  return g;
}

// Ornamental ring of small orbs around a base (bead moulding).
function beadRing(mat: THREE.Material, r: number, y: number, count = 24): THREE.Group {
  const g = new THREE.Group();
  const geo = new THREE.SphereGeometry(0.06, 8, 6);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const b = new THREE.Mesh(geo, mat);
    b.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    g.add(b);
  }
  return g;
}

// A simple classical figure (statue) for centrepieces.
function figure(mat: THREE.Material, y: number, s = 1): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28 * s, 0.34 * s, 0.2 * s, 20), mat);
  base.position.y = y + 0.1 * s;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * s, 0.24 * s, 0.7 * s, 16), mat);
  body.position.y = y + 0.55 * s;
  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.2 * s, 16, 14), mat);
  torso.scale.set(1, 1.3, 0.8);
  torso.position.y = y + 0.95 * s;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12 * s, 16, 14), mat);
  head.position.y = y + 1.25 * s;
  [base, body, torso, head].forEach((m) => (m.castShadow = true));
  g.add(base, body, torso, head);
  return g;
}

// -----------------------------------------------------------------------
// Template: a classic stacked-tier fountain from an array of bowl radii.
// -----------------------------------------------------------------------
function tiered(
  radii: number[],
  opts: {
    segments?: number;
    flutes?: number;
    fluteDepth?: number;
    plinth?: boolean;
    statue?: boolean;
    lions?: boolean;
  } = {}
): FountainSpec {
  const seg = opts.segments ?? 80;
  const flutes = opts.flutes ?? 0;
  const fluteDepth = opts.fluteDepth ?? 0.035;
  const hasPlinth = opts.plinth !== false;

  type Tier = { r: number; y: number; lipH: number; floorH: number };

  // Pure layout from EFFECTIVE (per-tier scaled) radii.
  const layout = (scales?: number[]) => {
    const eff = radii.map((r, i) => r * (scales?.[i] ?? 1));
    const tiers: Tier[] = [];
    let y = hasPlinth ? 0.55 : 0;
    eff.forEach((r, i) => {
      const lipH = 0.55 + r * 0.28;
      const floorH = 0.26 + r * 0.06;
      tiers.push({ r, y, lipH, floorH });
      const topOfBowl = y + lipH;
      if (i < eff.length - 1) {
        const nextR = eff[i + 1];
        const stemH = 0.55 + nextR * 0.5;
        y = topOfBowl - 0.02 + stemH;
      } else {
        y = topOfBowl;
      }
    });
    const top = tiers[tiers.length - 1];
    const height = top.y + top.lipH + (opts.statue ? 1.4 : 0.6);
    const waters: WaterRing[] = tiers.map((t) => {
      const w = waterFor(t.r, t.lipH, 0.16, t.floorH);
      return { y: t.y + w.y, r: w.r };
    });
    return { eff, tiers, height, waters, selR: eff[0] + 0.4 };
  };

  const build = (stoneColor: string, scales?: number[]) => {
    const { eff, tiers } = layout(scales);
    const mat = marble(stoneColor);
    const rim = marble(new THREE.Color(stoneColor).multiplyScalar(0.92).getStyle());
    const g = new THREE.Group();

    if (hasPlinth) {
      g.add(lathe(plinthProfile(eff[0] + 0.25), rim, { segments: seg, y: 0 }));
      g.add(beadRing(mat, eff[0] + 0.02, 0.5, Math.max(16, Math.round(eff[0] * 10))));
    }

    tiers.forEach((t, i) => {
      g.add(
        lathe(bowlProfile(t.r, t.lipH, 0.16, t.floorH, Math.min(0.6, t.r * 0.35)), mat, {
          segments: seg,
          flutes,
          fluteDepth,
          y: t.y,
        })
      );
      if (opts.lions && i === 0) g.add(spouts(rim, t.r + 0.02, t.y + t.lipH * 0.6, 4));

      const topOfBowl = t.y + t.lipH;
      if (i < tiers.length - 1) {
        const nextR = eff[i + 1];
        const stemH = 0.55 + nextR * 0.5;
        g.add(lathe(stemProfile(stemH, Math.max(0.32, nextR * 0.7)), mat, { segments: seg, flutes, fluteDepth: 0.028, y: topOfBowl - 0.02 }));
      } else if (opts.statue) {
        g.add(figure(rim, topOfBowl - 0.05, 0.9));
      } else {
        g.add(finial(mat, topOfBowl - 0.05, 1 + t.r * 0.2));
      }
    });

    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return g;
  };

  return {
    tierCount: radii.length,
    layerLabels: labelsFor(radii.length),
    build,
    measure: (scales) => {
      const L = layout(scales);
      return { waters: L.waters, selR: L.selR, height: L.height };
    },
  };
}

// A rectangular / squared basin (with corner finials) rather than round.
function squareBasin(size: number): FountainSpec {
  const half = size / 2;
  const build = (stoneColor: string) => {
    const mat = marble(stoneColor);
    const rim = marble(new THREE.Color(stoneColor).multiplyScalar(0.9).getStyle());
    const g = new THREE.Group();
    // outer block
    const outer = new THREE.Mesh(new THREE.BoxGeometry(size, 0.7, size), mat);
    outer.position.y = 0.35;
    outer.castShadow = outer.receiveShadow = true;
    g.add(outer);
    // inner rim (a thinner raised lip)
    const lip = new THREE.Mesh(new THREE.BoxGeometry(size + 0.14, 0.16, size + 0.14), rim);
    lip.position.y = 0.72;
    g.add(lip);
    // corner finials
    [-1, 1].forEach((sx) =>
      [-1, 1].forEach((sz) => {
        const f = finial(rim, 0.72, 0.9);
        f.position.set(sx * (half - 0.05), 0, sz * (half - 0.05));
        g.add(f);
      })
    );
    // small central bubbler
    g.add(lathe(stemProfile(0.5, 0.3), mat, { y: 0.72 }));
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
    });
    return g;
  };
  return staticSpec(build, [{ y: 0.74, r: half - 0.12, square: true }], half + 0.4, 1.4);
}

// A grand low octagonal pool with a central tiered fountain.
function grandPool(): FountainSpec {
  const inner = tiered([1.5, 0.85], { segments: 80, flutes: 20 });
  const build = (stoneColor: string) => {
    const mat = marble(stoneColor);
    const rim = marble(new THREE.Color(stoneColor).multiplyScalar(0.9).getStyle());
    const g = new THREE.Group();
    const pool = lathe(
      [
        [3.4, 0], [3.4, 0.42], [3.2, 0.5], [3.2, 0.62], [3.05, 0.62], [3.05, 0.2], [0.4, 0.18], [0.4, 0],
      ],
      mat,
      { segments: 8, y: 0 }
    );
    g.add(pool);
    g.add(beadRing(rim, 3.25, 0.66, 40));
    const center = inner.build(stoneColor);
    center.position.y = 0.18;
    g.add(center);
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
    });
    return g;
  };
  const waters: WaterRing[] = [
    { y: 0.28, r: 3.0 },
    ...inner.measure().waters.map((w) => ({ ...w, y: w.y + 0.18 })),
  ];
  return staticSpec(build, waters, 3.6, 3.2);
}

// A wall fountain: a back wall with a lion spout falling into a half basin.
function wallFountain(): FountainSpec {
  const build = (stoneColor: string) => {
    const mat = marble(stoneColor);
    const rim = marble(new THREE.Color(stoneColor).multiplyScalar(0.9).getStyle());
    const g = new THREE.Group();
    const wall = new THREE.Mesh(new THREE.BoxGeometry(4, 3.2, 0.5), mat);
    wall.position.set(0, 1.6, -1.4);
    wall.castShadow = wall.receiveShadow = true;
    g.add(wall);
    // arch niche
    const niche = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.3, 24, 1, false, 0, Math.PI), rim);
    niche.rotation.x = Math.PI / 2;
    niche.position.set(0, 2.1, -1.15);
    g.add(niche);
    // pilasters + finials
    [-1.6, 1.6].forEach((x) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.2, 0.6), rim);
      p.position.set(x, 1.6, -1.35);
      g.add(p);
      const f = finial(rim, 3.2, 1);
      f.position.set(x, 0, -1.35);
      g.add(f);
    });
    // cornice
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.35, 0.8), rim);
    cornice.position.set(0, 3.3, -1.3);
    g.add(cornice);
    // lion spout
    const lion = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), rim);
    lion.scale.set(1, 1.1, 0.8);
    lion.position.set(0, 1.5, -1.0);
    g.add(lion);
    // half basin
    const basin = lathe(bowlProfile(1.9, 0.8, 0.18, 0.34, 0.5), mat, { segments: 40, y: 0, flutes: 18, fluteDepth: 0.03 });
    g.add(basin);
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
    });
    return g;
  };
  return staticSpec(build, [waterFor(1.9, 0.8, 0.18, 0.34)], 2.2, 3.6);
}

// An obelisk rising from a square basin.
function obelisk(): FountainSpec {
  const build = (stoneColor: string) => {
    const mat = marble(stoneColor);
    const rim = marble(new THREE.Color(stoneColor).multiplyScalar(0.9).getStyle());
    const g = new THREE.Group();
    const basin = squareBasin(3.2).build(stoneColor);
    g.add(basin);
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 1.1), rim);
    plinth.position.y = 0.95;
    g.add(plinth);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.42, 3.2, 4), mat);
    shaft.rotation.y = Math.PI / 4;
    shaft.position.y = 2.8;
    shaft.castShadow = true;
    g.add(shaft);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.5, 4), rim);
    cap.rotation.y = Math.PI / 4;
    cap.position.y = 4.6;
    g.add(cap);
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
    });
    return g;
  };
  return staticSpec(build, [{ y: 0.74, r: 1.45, square: true }], 2.0, 4.9);
}

// Rectangular cascade of stepped basins (modern reflecting-pool style).
function cascade(): FountainSpec {
  const steps = 3;
  const waters: WaterRing[] = Array.from({ length: steps }, (_, i) => ({
    y: i * 0.55 + 0.54,
    r: (1.5 - i * 0.2) / 2,
    square: true,
  }));
  const build = (stoneColor: string) => {
    const mat = marble(stoneColor);
    const g = new THREE.Group();
    for (let i = 0; i < steps; i++) {
      const w = 3.2 - i * 0.6;
      const y = i * 0.55;
      const box = new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, 1.6 - i * 0.2), mat);
      box.position.set(0, y + 0.25, -i * 0.9);
      box.castShadow = box.receiveShadow = true;
      g.add(box);
      const lip = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, 0.12, 1.7 - i * 0.2), mat);
      lip.position.set(0, y + 0.52, -i * 0.9);
      g.add(lip);
    }
    return g;
  };
  return staticSpec(build, waters, 2.4, 1.8);
}

// ---------------------------------------------------------------------------
// The catalog of 16 fountains, keyed by variant.
// ---------------------------------------------------------------------------
export const FOUNTAINS: Record<string, () => FountainSpec> = {
  'round-basin': () => tiered([2.3], { flutes: 28 }),
  'two-tier': () => tiered([2.3, 1.2], { flutes: 26 }),
  'three-tier': () => tiered([2.4, 1.4, 0.78], { flutes: 26 }),
  'grand-roman': () => tiered([2.5, 1.5, 0.85], { flutes: 30, lions: true, statue: true }),
  'tall-tier': () => tiered([1.6, 1.05, 0.66, 0.36], { flutes: 22 }),
  'octagon-basin': () => tiered([2.2], { segments: 8 }),
  'octagon-two-tier': () => tiered([2.2, 1.15], { segments: 8 }),
  'scalloped-bowl': () => tiered([2.2, 1.1], { flutes: 40, fluteDepth: 0.06 }),
  'lion-basin': () => tiered([2.2], { flutes: 24, lions: true }),
  'statue-fountain': () => tiered([2.0], { flutes: 22, statue: true }),
  'urn-fountain': () => tiered([1.2, 0.7], { flutes: 30 }),
  'square-basin': () => squareBasin(3.2),
  'grand-pool': () => grandPool(),
  'wall-fountain': () => wallFountain(),
  'obelisk': () => obelisk(),
  'cascade': () => cascade(),
};

const specCache: Record<string, FountainSpec> = {};
export function getFountainSpec(variant: string): FountainSpec {
  if (!specCache[variant]) {
    const f = FOUNTAINS[variant] ?? FOUNTAINS['round-basin'];
    specCache[variant] = f();
  }
  return specCache[variant];
}

export function disposeGroup(group: THREE.Group) {
  group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[];
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    }
  });
}
