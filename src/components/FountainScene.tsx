'use client';

import { useFountainStore } from '@/store';
import PartComponent from './PartComponent';

export default function FountainScene() {
  const parts = useFountainStore((s) => s.design.parts);
  const isPlaying = useFountainStore((s) => s.design.isPlaying);
  const selectedPartId = useFountainStore((s) => s.selectedPartId);

  return (
    <group>
      {parts.map((part) => (
        <PartComponent
          key={part.id}
          part={part}
          isSelected={selectedPartId === part.id}
          isPlaying={isPlaying}
        />
      ))}
    </group>
  );
}
