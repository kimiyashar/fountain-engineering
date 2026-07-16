'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Grid, ContactShadows } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFountainStore, Background } from '@/store';
import { dropBridge } from '@/dropBridge';
import FountainScene from './FountainScene';

interface Env {
  bg: string;
  plane: string;
  grid: string;
  ground: string;
  ambient: number;
  sun: number;
  sunColor: string;
  sunPos: [number, number, number];
}

const ENVIRONMENTS: Record<Background, Env> = {
  day: { bg: '#eaf1f6', plane: '#cfe4f2', grid: '#8fbde0', ground: '#dfe8ee', ambient: 0.95, sun: 1.15, sunColor: '#fff6e6', sunPos: [8, 13, 6] },
  sunset: { bg: '#f7d7b0', plane: '#f0c79a', grid: '#d99a63', ground: '#e9c39a', ambient: 0.85, sun: 1.1, sunColor: '#ffb15a', sunPos: [-6, 6, 4] },
  night: { bg: '#101833', plane: '#1c274a', grid: '#3a4d80', ground: '#161f3d', ambient: 0.32, sun: 0.5, sunColor: '#9fb4ff', sunPos: [6, 11, -4] },
  rain: { bg: '#6b757e', plane: '#5c6770', grid: '#828d96', ground: '#565f67', ambient: 0.6, sun: 0.55, sunColor: '#cdd6de', sunPos: [4, 11, 4] },
  autumn: { bg: '#f0c07a', plane: '#e0a860', grid: '#bd7f42', ground: '#d69a54', ambient: 0.85, sun: 1.05, sunColor: '#ffcf87', sunPos: [7, 10, 5] },
  forest: { bg: '#274c34', plane: '#2f5a3d', grid: '#4b7d57', ground: '#264730', ambient: 0.6, sun: 0.9, sunColor: '#e6f4cf', sunPos: [5, 13, 5] },
  whitehouse: { bg: '#dbe7f1', plane: '#cdd8c6', grid: '#a7b79c', ground: '#d3cdbd', ambient: 1.0, sun: 1.2, sunColor: '#fffaf0', sunPos: [9, 14, 7] },
};

// Bridges plain HTML drops into the 3D scene by raycasting to the ground plane.
function DropController() {
  const { camera, gl } = useThree();
  const addPart = useFountainStore((s) => s.addPart);

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    dropBridge.place = (clientX, clientY, catalogId) => {
      const rect = gl.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      const pt = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, pt)) {
        addPart(catalogId, [pt.x, pt.z]);
      } else {
        addPart(catalogId);
      }
    };
    return () => {
      dropBridge.place = null;
    };
  }, [camera, gl, addPart]);

  return null;
}

// Simple falling rain for the rainy scene.
function Rain() {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 700;
  const positions = useMemo(() => {
    const a = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      a[i * 3] = (Math.random() - 0.5) * 40;
      a[i * 3 + 1] = Math.random() * 20;
      a[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return a;
  }, []);

  useFrame((_, delta) => {
    const geom = ref.current?.geometry;
    if (!geom) return;
    const pos = geom.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      let y = pos.array[i * 3 + 1] as number;
      y -= delta * 22;
      if (y < 0) y = 20;
      (pos.array as any)[i * 3 + 1] = y;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#cfd8de" size={0.06} transparent opacity={0.5} />
    </points>
  );
}

export default function Canvas3D() {
  const background = useFountainStore((s) => s.design.background);
  const selectPart = useFountainStore((s) => s.selectPart);
  const env = ENVIRONMENTS[background];

  return (
    <Canvas shadows dpr={[1, 2]}>
      <color attach="background" args={[env.bg]} />
      <fog attach="fog" args={[env.bg, 26, 70]} />

      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={45} />
      <OrbitControls
        makeDefault
        enablePan
        minDistance={4}
        maxDistance={34}
        maxPolarAngle={Math.PI / 2.03}
        target={[0, 0.7, 0]}
      />

      <ambientLight intensity={env.ambient} />
      <hemisphereLight args={[env.bg, env.ground, env.ambient * 0.6]} />
      <directionalLight
        position={env.sunPos}
        intensity={env.sun}
        color={env.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
      />

      {/* Tinkercad-style workplane: a soft colored pad you build on. */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onClick={() => selectPart(null)}
        onPointerMissed={() => selectPart(null)}
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={env.plane} roughness={0.95} />
      </mesh>

      <Grid
        args={[30, 30]}
        cellSize={1}
        cellThickness={0.7}
        cellColor={env.grid}
        sectionSize={5}
        sectionThickness={1.3}
        sectionColor={env.grid}
        fadeDistance={45}
        fadeStrength={1}
        position={[0, 0.011, 0]}
      />

      <ContactShadows position={[0, 0.02, 0]} opacity={0.35} scale={30} blur={2.2} far={8} />

      {background === 'rain' && <Rain />}

      <Suspense fallback={null}>
        <FountainScene />
      </Suspense>

      <DropController />
    </Canvas>
  );
}
