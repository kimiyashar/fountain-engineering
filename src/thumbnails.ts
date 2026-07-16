import * as THREE from 'three';
import { FOUNTAINS, getFountainSpec } from './fountainModels';

// Renders every fountain model to a small PNG once, so the parts bin can show
// real pictures of the intricate fountains instead of a generic icon.

let cache: Record<string, string> | null = null;

export function renderFountainThumbnails(): Record<string, string> {
  if (cache) return cache;
  const out: Record<string, string> = {};

  try {
    const size = 256;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8296ab, 1.15));
    const key = new THREE.DirectionalLight(0xfff3e0, 1.5);
    key.position.set(5, 9, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xbcd6ff, 0.55);
    fill.position.set(-5, 3, -4);
    scene.add(fill);

    const cam = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const box = new THREE.Box3();
    const sphere = new THREE.Sphere();

    for (const variant of Object.keys(FOUNTAINS)) {
      const spec = getFountainSpec(variant);
      const g = spec.build('#ece5d6');

      // add pretty blue water discs
      spec.waters.forEach((w) => {
        const geo = w.square
          ? new THREE.PlaneGeometry(w.r * 2, w.r * 2)
          : new THREE.CircleGeometry(w.r, 48);
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({ color: 0x2f88bd, roughness: 0.12, metalness: 0.25 })
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = w.y;
        g.add(mesh);
      });

      scene.add(g);

      box.setFromObject(g);
      box.getBoundingSphere(sphere);
      const r = sphere.radius || 2;
      const dist = (r / Math.sin((34 * Math.PI) / 360)) * 0.62;
      cam.position.set(sphere.center.x + dist * 0.75, sphere.center.y + dist * 0.5, sphere.center.z + dist * 0.75);
      cam.lookAt(sphere.center);
      cam.updateProjectionMatrix();

      renderer.render(scene, cam);
      out[variant] = renderer.domElement.toDataURL('image/png');

      scene.remove(g);
      g.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry?.dispose();
          const mat = m.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat?.dispose();
        }
      });
    }

    renderer.dispose();
  } catch (e) {
    // If WebGL isn't available, callers fall back to the emoji tiles.
    console.warn('thumbnail render failed', e);
  }

  cache = out;
  return out;
}
