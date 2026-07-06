'use client';

import { useFountainStore } from '@/store';

export default function ControlPanel() {
  const togglePlay = useFountainStore((state) => state.togglePlay);
  const reset = useFountainStore((state) => state.reset);
  const isPlaying = useFountainStore((state) => state.design.isPlaying);
  const partsCount = useFountainStore((state) => state.design.parts.length);

  return (
    <div className="absolute top-0 right-0 bg-gray-900 text-white p-4 m-4 rounded-lg shadow-lg border border-gray-700 flex gap-3 z-10">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded">
        <span className="text-sm text-gray-400">Parts:</span>
        <span className="font-semibold">{partsCount}</span>
      </div>

      <button
        onClick={togglePlay}
        className={`px-4 py-2 rounded font-semibold transition ${
          isPlaying
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>

      <button
        onClick={reset}
        className="px-4 py-2 rounded font-semibold bg-gray-700 hover:bg-gray-600 transition"
      >
        Reset
      </button>
    </div>
  );
}
