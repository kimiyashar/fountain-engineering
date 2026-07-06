'use client';

import { FountainPart } from '@/store';
import { useRef, useState } from 'react';
import { Mesh } from 'three';

interface PartComponentProps {
  part: FountainPart;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PartComponent({ part, isSelected, onSelect }: PartComponentProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const getGeometry = () => {
    switch (part.type) {
      case 'base':
        return (
          <cylinderGeometry args={[2, 2.5, 1, 32]} />
        );
      case 'jet':
        return (
          <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
        );
      case 'light':
        return (
          <sphereGeometry args={[0.3, 16, 16]} />
        );
      case 'decoration':
        return (
          <boxGeometry args={[0.5, 0.5, 0.5]} />
        );
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const getColor = () => {
    if (isSelected) return '#ff6b6b';
    if (hovered) return '#ffd93d';

    switch (part.type) {
      case 'base':
        return part.color || '#8b8680';
      case 'jet':
        return part.color || '#4a90e2';
      case 'light':
        return part.color || '#ffd700';
      case 'decoration':
        return part.color || '#6c5ce7';
      default:
        return '#999';
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={part.position}
      rotation={part.rotation}
      scale={part.scale}
      onClick={() => onSelect()}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      {getGeometry()}
      <meshStandardMaterial color={getColor()} emissive={hovered || isSelected ? getColor() : '#000000'} emissiveIntensity={hovered || isSelected ? 0.3 : 0} />
    </mesh>
  );
}
