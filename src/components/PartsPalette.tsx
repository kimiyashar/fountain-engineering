'use client';

import { useFountainStore } from '@/store';
import { useState } from 'react';

const AVAILABLE_PARTS = [
  // Bases
  { id: 'round-base', name: 'Round Pedestal', type: 'base' as const, scale: [1, 1, 1] },
  { id: 'square-base', name: 'Square Base', type: 'base' as const, scale: [1.2, 0.8, 1.2] },
  { id: 'tiered-base', name: 'Tiered Base', type: 'base' as const, scale: [1.5, 1.2, 1.5] },

  // Jets
  { id: 'vertical-jet', name: 'Vertical Jet', type: 'jet' as const, scale: [0.2, 2, 0.2] },
  { id: 'arc-jet', name: 'Arc Jet', type: 'jet' as const, scale: [0.15, 1.5, 0.15] },
  { id: 'spray-jet', name: 'Spray Jet', type: 'jet' as const, scale: [0.3, 1, 0.3] },

  // Lights
  { id: 'rgb-light', name: 'RGB LED', type: 'light' as const, scale: [0.4, 0.4, 0.4] },
  { id: 'warm-light', name: 'Warm Light', type: 'light' as const, scale: [0.5, 0.5, 0.5] },
  { id: 'spotlight', name: 'Spotlight', type: 'light' as const, scale: [0.6, 0.6, 0.6] },

  // Decorations
  { id: 'stone', name: 'Stone', type: 'decoration' as const, scale: [0.8, 0.8, 0.8] },
  { id: 'plant', name: 'Plant', type: 'decoration' as const, scale: [0.6, 1.2, 0.6] },
];

export default function PartsPalette() {
  const addPart = useFountainStore((state) => state.addPart);
  const setBackground = useFountainStore((state) => state.setBackground);
  const background = useFountainStore((state) => state.design.background);
  const [draggedPart, setDraggedPart] = useState<any>(null);

  const handleDragStart = (part: any) => {
    setDraggedPart(part);
  };

  const handleAddPart = (part: any) => {
    const newPart = {
      id: `${part.id}-${Date.now()}`,
      type: part.type,
      name: part.name,
      position: [Math.random() * 4 - 2, 1, Math.random() * 4 - 2] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: part.scale as [number, number, number],
    };
    addPart(newPart);
  };

  return (
    <div className="w-80 bg-gray-900 text-white p-6 flex flex-col gap-6 shadow-lg border-r border-gray-700 overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold mb-4">FountainCraft</h2>
        <p className="text-sm text-gray-400">Drag parts or click to add them to your fountain</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-300">BASES</h3>
        <div className="space-y-2">
          {AVAILABLE_PARTS.filter((p) => p.type === 'base').map((part) => (
            <button
              key={part.id}
              draggable
              onDragStart={() => handleDragStart(part)}
              onClick={() => handleAddPart(part)}
              className="w-full p-2 bg-gray-800 hover:bg-gray-700 rounded text-sm text-left transition cursor-move"
            >
              {part.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-300">JETS</h3>
        <div className="space-y-2">
          {AVAILABLE_PARTS.filter((p) => p.type === 'jet').map((part) => (
            <button
              key={part.id}
              draggable
              onDragStart={() => handleDragStart(part)}
              onClick={() => handleAddPart(part)}
              className="w-full p-2 bg-blue-900 hover:bg-blue-800 rounded text-sm text-left transition cursor-move"
            >
              {part.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-300">LIGHTS</h3>
        <div className="space-y-2">
          {AVAILABLE_PARTS.filter((p) => p.type === 'light').map((part) => (
            <button
              key={part.id}
              draggable
              onDragStart={() => handleDragStart(part)}
              onClick={() => handleAddPart(part)}
              className="w-full p-2 bg-yellow-900 hover:bg-yellow-800 rounded text-sm text-left transition cursor-move"
            >
              {part.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-300">DECORATIONS</h3>
        <div className="space-y-2">
          {AVAILABLE_PARTS.filter((p) => p.type === 'decoration').map((part) => (
            <button
              key={part.id}
              draggable
              onDragStart={() => handleDragStart(part)}
              onClick={() => handleAddPart(part)}
              className="w-full p-2 bg-purple-900 hover:bg-purple-800 rounded text-sm text-left transition cursor-move"
            >
              {part.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-300">BACKGROUND</h3>
        <div className="space-y-2">
          {(['day', 'night', 'rain', 'autumn', 'forest', 'whitehouse'] as const).map((bg) => (
            <button
              key={bg}
              onClick={() => setBackground(bg)}
              className={`w-full p-2 rounded text-sm transition ${
                background === bg ? 'bg-cyan-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {bg.charAt(0).toUpperCase() + bg.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
