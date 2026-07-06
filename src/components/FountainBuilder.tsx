'use client';

import { Suspense } from 'react';
import Canvas3D from './Canvas3D';
import PartsPalette from './PartsPalette';
import ControlPanel from './ControlPanel';

export default function FountainBuilder() {
  return (
    <div className="flex h-screen w-screen bg-gray-950 overflow-hidden">
      <PartsPalette />
      <div className="flex-1 relative">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading fountain builder...</div>}>
          <Canvas3D />
        </Suspense>
        <ControlPanel />
      </div>
    </div>
  );
}
