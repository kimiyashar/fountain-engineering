import * as THREE from 'three';
import { CATALOG, CatalogItem } from './catalog';
import { getFountainSpec } from './fountainModels';
import { buildDecoration, buildJetPreview, buildLightPreview } from './previews';

// Renders a real picture of every catalog part once, so the parts bin is a
// proper catalog of fountains, jets, lights and decorations — not emoji.

let cache: Record<string, string> | null = null;

function buildSubject(item: CatalogItem): THREE.Object3D {
  if (item.category === 'base') {
    const spec = getFountainSpec(item.variant);
    const g = spec.build(item.color || '#ece5d6');
    spec.measure().waters.forEach((w) => {
      const geo = w.square ? new THREE.PlaneGeometry(w.r * 2, w.r * 2) : new THREE.CircleGeometry(w.r, 48);
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x2f88bd, roughness: 0.12, metalness: 0.25 }));
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = w.y;
      g.add(mesh);
    });
    return g;
  }
  if (item.category === 'decoration') return buildDecoration(item.variant, item.color);
  if (item.category === 'jet') return buildJetPreview(item.variant, item.color);
  return buildLightPreview(item.variant, item.color);
}

export function renderAllThumbnails(): Record<string, string> {
  if (cache) return cache;
  const out: Record<string, string> = {};

  try {
    const size = 224;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const hemi = new THREE.HemisphereLight(0xffffff, 0x8296ab, 1.1);
    const key = new THREE.DirectionalLight(0xfff3e0, 1.5);
    key.position.set(5, 9, 6);
    const fill = new THREE.DirectionalLight(0xbcd6ff, 0.55);
    fill.position.set(-5, 3, -4);
    scene.add(hemi, key, fill);

    const cam = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const box = new THREE.Box3();
    const sphere = new THREE.Sphere();

    for (const item of CATALOG) {
      const dark = item.category === 'light';
      renderer.setClearColor(dark ? 0x0f131b : 0x000000, dark ? 1 : 0);
      hemi.intensity = dark ? 0.35 : 1.1;
      key.intensity = dark ? 0.4 : 1.5;
      fill.intensity = dark ? 0.2 : 0.55;

      const subject = buildSubject(item);
      scene.add(subject);

      box.setFromObject(subject);
      box.getBoundingSphere(sphere);
      const r = sphere.radius || 2;
      const dist = (r / Math.sin((34 * Math.PI) / 360)) * 0.6;
      cam.position.set(sphere.center.x + dist * 0.72, sphere.center.y + dist * 0.5, sphere.center.z + dist * 0.72);
      cam.lookAt(sphere.center);
      cam.updateProjectionMatrix();

      renderer.render(scene, cam);
      out[item.id] = renderer.domElement.toDataURL('image/png');

      scene.remove(subject);
      subject.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh || (o as any).isPoints) {
          m.geometry?.dispose();
          const mat = m.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat?.dispose();
        }
      });
    }

    renderer.dispose();
  } catch (e) {
    console.warn('thumbnail render failed', e);
  }

  cache = out;
  return out;
}
