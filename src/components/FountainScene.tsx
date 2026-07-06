'use client';

import { useFountainStore, FountainPart } from '@/store';
import { useRef } from 'react';
import { Mesh } from 'three';
import PartComponent from './PartComponent';

export default function FountainScene() {
  const parts = useFountainStore((state) => state.design.parts);
  const selectedPartId = useFountainStore((state) => state.selectedPartId);
  const selectPart = useFountainStore((state) => state.selectPart);

  return (
    <group>
      {parts.map((part) => (
        <PartComponent
          key={part.id}
          part={part}
          isSelected={selectedPartId === part.id}
          onSelect={() => selectPart(part.id)}
        />
      ))}
    </group>
  );
}
