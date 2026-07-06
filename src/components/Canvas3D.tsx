'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Grid, Environment } from '@react-three/drei';
import { useFountainStore } from '@/store';
import FountainScene from './FountainScene';
import { Suspense } from 'react';

const backgroundMap = {
  day: 'warehouse',
  night: 'night',
  rain: 'forest',
  autumn: 'park',
  forest: 'forest',
  whitehouse: 'city',
} as const;

export default function Canvas3D() {
  const background = useFountainStore((state) => state.design.background);

  return (
    <Canvas className="w-full h-full">
      <PerspectiveCamera makeDefault position={[10, 10, 10]} />
      <OrbitControls makeDefault />

      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      <Environment preset={backgroundMap[background] as any} />

      <Grid args={[100, 100]} cellSize={1} cellColor="#6f6f6f" sectionSize={5} sectionColor="#ff0000" fadeDistance={50} fadeStrength={1} infiniteGrid />

      <Suspense fallback={null}>
        <FountainScene />
      </Suspense>
    </Canvas>
  );
}
