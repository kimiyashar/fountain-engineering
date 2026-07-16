import * as THREE from 'three';

// Imperative builders used BOTH in the live scene (decorations) and to render
// catalog thumbnails (jets, lights, decorations). Keeping them imperative means
// the little pictures in the parts bin are the real thing.

const std = (color: string | THREE.Color, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color: new THREE.Color(color as any), roughness: 0.7, metalness: 0.05, ...opts });

const emissive = (color: string, intensity = 2) =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    toneMapped: false,
  });

function shadowize(g: THREE.Object3D) {
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      m.castShadow = true;
      m.receiveShadow = true;
    }
  });
}

// ------------------------------- DECORATIONS -------------------------------
export function buildDecoration(variant: string, color = '#9a9488'): THREE.Group {
  const g = new THREE.Group();
  const c = color;
  switch (variant) {
    case 'plant': {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.3, 16), std('#7a5230'));
      pot.position.y = 0.15;
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.95, 16), std(c));
      leaf.position.y = 0.6;
      g.add(pot, leaf);
      break;
    }
    case 'statue': {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.7, 20), std(c, { roughness: 0.55 }));
      base.position.y = 0.35;
      const torso = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 16), std(c, { roughness: 0.55 }));
      torso.scale.set(1, 1.3, 0.8);
      torso.position.y = 0.95;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 14), std(c, { roughness: 0.55 }));
      head.position.y = 1.28;
      g.add(base, torso, head);
      break;
    }
    case 'lantern': {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.6, 12), std('#4a4a4a'));
      post.position.y = 0.3;
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.4), emissive(c, 1.2));
      box.position.y = 0.85;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.22, 4), std('#4a4a4a'));
      cap.position.y = 1.2;
      cap.rotation.y = Math.PI / 4;
      g.add(post, box, cap);
      break;
    }
    case 'koi': {
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 18, 16), std(c));
      body.scale.set(1, 0.4, 0.6);
      body.position.y = 0.12;
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.4, 12), std(c));
      tail.rotation.z = Math.PI / 2;
      tail.position.set(-0.5, 0.12, 0);
      g.add(body, tail);
      break;
    }
    case 'lilypad': {
      const pad = new THREE.Mesh(new THREE.CircleGeometry(0.5, 24), std(c, { side: THREE.DoubleSide }));
      pad.rotation.x = -Math.PI / 2;
      pad.position.y = 0.05;
      const flower = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), std('#ff8fc0'));
      flower.position.set(0.15, 0.12, 0.1);
      g.add(pad, flower);
      break;
    }
    case 'hedge': {
      const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), std(c, { roughness: 0.95 }));
      box.position.y = 0.5;
      g.add(box);
      break;
    }
    case 'topiary': {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.5, 12), std('#6b4a2a'));
      trunk.position.y = 0.25;
      const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 18), std(c, { roughness: 0.95 }));
      b1.position.y = 0.7;
      const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 18), std(c, { roughness: 0.95 }));
      b2.position.y = 1.15;
      g.add(trunk, b1, b2);
      break;
    }
    case 'urn': {
      const pts = [
        [0.28, 0], [0.34, 0.1], [0.24, 0.3], [0.4, 0.55], [0.36, 0.75], [0.42, 0.85], [0.36, 0.9], [0.1, 0.88],
      ].map(([r, y]) => new THREE.Vector2(r, y));
      const urn = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), std(c, { roughness: 0.5 }));
      g.add(urn);
      break;
    }
    case 'bench': {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 0.4), std(c));
      seat.position.y = 0.45;
      const back = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.4, 0.08), std(c));
      back.position.set(0, 0.68, -0.16);
      [-0.45, 0.45].forEach((x) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 0.36), std(c));
        leg.position.set(x, 0.22, 0);
        g.add(leg);
      });
      g.add(seat, back);
      break;
    }
    case 'arch': {
      [-0.7, 0.7].forEach((x) => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 2, 20), std(c, { roughness: 0.5 }));
        col.position.set(x, 1, 0);
        g.add(col);
      });
      const top = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.16, 16, 24, Math.PI), std(c, { roughness: 0.5 }));
      top.position.y = 2;
      g.add(top);
      break;
    }
    case 'dolphin': {
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.7, 8, 16), std(c, { roughness: 0.4 }));
      body.rotation.z = Math.PI / 3;
      body.position.y = 0.7;
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 12), std(c, { roughness: 0.4 }));
      tail.position.set(-0.35, 0.15, 0);
      tail.rotation.z = -Math.PI / 5;
      g.add(body, tail);
      break;
    }
    case 'torch': {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.2, 12), std('#5a4030'));
      post.position.y = 0.6;
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.1, 0.16, 14), std('#3a3a3a'));
      bowl.position.y = 1.25;
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.4, 12), emissive('#ff8a2c', 2.4));
      flame.position.y = 1.5;
      g.add(post, bowl, flame);
      break;
    }
    case 'grass': {
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        const blade = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.6, 6), std(c));
        blade.position.set(Math.cos(a) * 0.12, 0.3, Math.sin(a) * 0.12);
        blade.rotation.z = (Math.random() - 0.5) * 0.4;
        g.add(blade);
      }
      break;
    }
    case 'column': {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.6), std(c, { roughness: 0.6 }));
      base.position.y = 0.1;
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.8, 24), std(c, { roughness: 0.6 }));
      shaft.position.y = 1.1;
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.6), std(c, { roughness: 0.6 }));
      cap.position.y = 2.1;
      g.add(base, shaft, cap);
      break;
    }
    default: {
      // stone / rock cluster
      const n = variant === 'rock' ? 3 : 1;
      for (let i = 0; i < n; i++) {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.16, 0), std(c, { roughness: 0.95, flatShading: true }));
        rock.position.set((Math.random() - 0.5) * 0.5, 0.22, (Math.random() - 0.5) * 0.5);
        g.add(rock);
      }
    }
  }
  shadowize(g);
  return g;
}

// ------------------------------- JET PREVIEWS -------------------------------
// A static point cloud shaped like each spray, for the thumbnails.
export function buildJetPreview(variant: string, color = '#5cc0ef'): THREE.Object3D {
  const g = new THREE.Group();
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.2, 14), std('#9aa4ad', { metalness: 0.8, roughness: 0.3 }));
  nozzle.position.y = 0.1;
  g.add(nozzle);

  const pts: number[] = [];
  const push = (x: number, y: number, z: number) => pts.push(x, y, z);
  const R = () => Math.random();

  const shape = (t: number): [number, number, number] => {
    switch (variant) {
      case 'arc': {
        const x = t * 2.2;
        const y = 3.4 * t * (1 - t) * 2 + 0.2;
        return [x, y, (R() - 0.5) * 0.15];
      }
      case 'spray': {
        const a = R() * Math.PI * 2;
        const rad = t * 1.9;
        return [Math.cos(a) * rad, 1.8 * t * (1 - t) * 2 + 0.2, Math.sin(a) * rad];
      }
      case 'bell': {
        const a = R() * Math.PI * 2;
        const rad = Math.sin(t * Math.PI) * 1.2;
        return [Math.cos(a) * rad, t * 2 + 0.2, Math.sin(a) * rad];
      }
      case 'foam': {
        const a = R() * Math.PI * 2;
        const rad = R() * 0.5;
        return [Math.cos(a) * rad, R() * 0.7 + 0.15, Math.sin(a) * rad];
      }
      case 'mist': {
        const a = R() * Math.PI * 2;
        const rad = R() * 1.6;
        return [Math.cos(a) * rad, R() * 0.9 + 0.15, Math.sin(a) * rad];
      }
      case 'column':
        return [(R() - 0.5) * 0.35, t * 2.6 + 0.15, (R() - 0.5) * 0.35];
      case 'geyser':
        return [(R() - 0.5) * 0.28, t * 4.2 + 0.15, (R() - 0.5) * 0.28];
      case 'spiral': {
        const ang = t * Math.PI * 5;
        const rad = t * 0.7;
        return [Math.cos(ang) * rad, t * 3 + 0.15, Math.sin(ang) * rad];
      }
      default: // vertical
        return [(R() - 0.5) * 0.18, t * 3.2 + 0.15, (R() - 0.5) * 0.18];
    }
  };

  const COUNT = 500;
  for (let i = 0; i < COUNT; i++) push(...shape(R()));

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const mat = new THREE.PointsMaterial({ color: new THREE.Color(color), size: 0.12, transparent: true, opacity: 0.95, depthWrite: false });
  g.add(new THREE.Points(geo, mat));

  // ring / fan-wall / crown = several of the above around a layout
  if (variant === 'ring' || variant === 'crown' || variant === 'fanwall') {
    return arrangement(variant, color);
  }
  return g;
}

function arrangement(variant: string, color: string): THREE.Object3D {
  const g = new THREE.Group();
  const base = variant === 'fanwall' ? 'arc' : variant === 'crown' ? 'vertical' : 'arc';
  const N = variant === 'fanwall' ? 5 : 8;
  for (let i = 0; i < N; i++) {
    const sub = buildJetPreview(base, color);
    if (variant === 'fanwall') {
      sub.position.set((i - (N - 1) / 2) * 0.7, 0, 0);
    } else {
      const a = (i / N) * Math.PI * 2;
      sub.position.set(Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9);
      sub.rotation.y = -a;
    }
    g.add(sub);
  }
  return g;
}

// ------------------------------- LIGHT PREVIEWS -----------------------------
// Emissive glows for the thumbnails (rendered on a dark card so they pop).
export function buildLightPreview(variant: string, color = '#ffd36b'): THREE.Object3D {
  const g = new THREE.Group();
  const glow = (c: string, r = 0.3, y = 0.3, intensity = 3) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 18), emissive(c, intensity));
    m.position.y = y;
    return m;
  };
  // a subtle lit disc so the colour spills onto something
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1.4, 40), std('#20242c', { roughness: 1 }));
  disc.rotation.x = -Math.PI / 2;
  g.add(disc);

  switch (variant) {
    case 'ledring': {
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const col = new THREE.Color().setHSL(i / 10, 1, 0.6);
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), emissive('#fff', 3));
        (m.material as THREE.MeshStandardMaterial).color = col;
        (m.material as THREE.MeshStandardMaterial).emissive = col;
        m.position.set(Math.cos(a) * 0.9, 0.2, Math.sin(a) * 0.9);
        g.add(m);
      }
      break;
    }
    case 'washbar': {
      for (let i = 0; i < 6; i++) {
        const m = glow(color, 0.13, 0.18, 3);
        m.position.x = (i - 2.5) * 0.34;
        g.add(m);
      }
      break;
    }
    case 'beam':
    case 'gobo': {
      g.add(glow(color, 0.14, 0.2, 3));
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.85, 2.6, 28, 1, true),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      cone.position.y = 1.5;
      g.add(cone);
      break;
    }
    case 'laser': {
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3, 10), emissive(color, 4));
      beam.position.y = 1.5;
      g.add(beam, glow(color, 0.12, 0.1, 4));
      break;
    }
    case 'fiber': {
      for (let i = 0; i < 40; i++) {
        const a = Math.random() * Math.PI * 2;
        const rad = Math.random() * 1.1;
        const col = new THREE.Color().setHSL(Math.random(), 0.6, 0.7);
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), emissive('#fff', 3));
        (m.material as THREE.MeshStandardMaterial).color = col;
        (m.material as THREE.MeshStandardMaterial).emissive = col;
        m.position.set(Math.cos(a) * rad, Math.random() * 0.4 + 0.05, Math.sin(a) * rad);
        g.add(m);
      }
      break;
    }
    case 'flame':
      g.add(glow('#ff7a2c', 0.24, 0.35, 3));
      g.add(glow('#ffd24a', 0.14, 0.5, 3));
      break;
    case 'wash': {
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      g.add(dome, glow(color, 0.16, 0.05, 2.4));
      break;
    }
    default: // bulb / cycle
      g.add(glow(color, 0.32, 0.32, 3));
  }
  return g;
}
