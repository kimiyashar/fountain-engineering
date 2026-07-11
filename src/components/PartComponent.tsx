'use client';

import { FountainPart, useFountainStore } from '@/store';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import WaterJet from './WaterJet';

interface Props {
  part: FountainPart;
  isSelected: boolean;
  isPlaying: boolean;
}

function jetProfile(variant: string) {
  switch (variant) {
    case 'arc':
      return { spread: 1.5, power: 6.2 };
    case 'spray':
      return { spread: 2.6, power: 4.4 };
    case 'bell':
      return { spread: 0.9, power: 5.6 };
    case 'foam':
      return { spread: 0.5, power: 3.2 };
    default:
      return { spread: 0.26, power: 8.2 }; // vertical
  }
}

function SelectionRing({ radius = 0.5 }: { radius?: number }) {
  return (
    <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.12, 48]} />
      <meshBasicMaterial color="#2f8fd8" transparent opacity={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

// A glossy water surface, either a disc or a square, sitting just above a basin.
function Water({ y, radius, square = false }: { y: number; radius: number; square?: boolean }) {
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {square ? (
        <planeGeometry args={[radius * 2, radius * 2]} />
      ) : (
        <circleGeometry args={[radius, 56]} />
      )}
      <meshStandardMaterial
        color="#2ea3dd"
        transparent
        opacity={0.82}
        roughness={0.06}
        metalness={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function PartComponent({ part, isSelected, isPlaying }: Props) {
  const selectPart = useFountainStore((s) => s.selectPart);
  const [hovered, setHovered] = useState(false);
  const waterRef = useRef<THREE.Group>(null);

  // Gentle bob on all water surfaces of this part while running.
  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = isPlaying
        ? Math.sin(state.clock.elapsedTime * 2.2) * 0.02
        : 0;
    }
  });

  const onClick = (e: any) => {
    e.stopPropagation();
    selectPart(part.id);
  };
  const enter = () => setHovered(true);
  const leave = () => setHovered(false);

  // ---------- WATER JETS ----------
  if (part.type === 'jet') {
    const p = jetProfile(part.variant);
    const js = part.scale[0];
    return (
      <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave}>
        <group scale={[js, js, js]}>
          <WaterJet position={[0, 0, 0]} isPlaying={isPlaying} spread={p.spread} power={p.power} color={part.color || '#cdeeff'} />
        </group>
        {isSelected && <SelectionRing radius={0.3 * js} />}
      </group>
    );
  }

  // ---------- LIGHTS ----------
  if (part.type === 'light') {
    const c = part.color || '#ffcf7a';
    const s = part.scale[0];
    return (
      <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave}>
        <mesh scale={[s, s, s]}>
          <sphereGeometry args={[0.26, 22, 22]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={isSelected ? 3.2 : hovered ? 2.4 : 1.8} toneMapped={false} />
        </mesh>
        <pointLight color={c} intensity={isPlaying ? 7 : 4} distance={7} decay={2} position={[0, 0.3, 0]} />
        {isSelected && <SelectionRing radius={0.32} />}
      </group>
    );
  }

  // ---------- BASES (basin + visible water on top) ----------
  if (part.type === 'base') {
    const s = part.scale[0];
    const stone = isSelected ? '#bcdcf5' : hovered ? '#efe7d3' : part.color || '#d8d2c7';
    const { bodies, waters, ringR } = baseSpec(part.variant, stone);
    return (
      <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave}>
        <group scale={[s, s, s]}>
          {bodies}
          <group ref={waterRef}>{waters}</group>
        </group>
        {isSelected && <SelectionRing radius={ringR * s} />}
      </group>
    );
  }

  // ---------- DECORATIONS ----------
  const s = part.scale[0];
  return (
    <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave} scale={[s, s, s]}>
      {renderDecoration(part.variant, isSelected ? '#bcdcf5' : hovered ? '#ffe08a' : part.color)}
      {isSelected && <SelectionRing radius={0.5} />}
    </group>
  );
}

// Returns the stone bodies + water surfaces for each fountain, arranged so the
// water always sits *on top* of the basin (never hidden inside it) with a
// stone rim showing around the edge — like a real fountain.
function baseSpec(variant: string, color: string) {
  const mat = <meshStandardMaterial color={color} roughness={0.7} metalness={0.08} />;

  switch (variant) {
    case 'square':
      return {
        ringR: 2.5,
        bodies: (
          <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
            <boxGeometry args={[3.8, 0.7, 3.8]} />
            {mat}
          </mesh>
        ),
        waters: <Water y={0.72} radius={1.65} square />,
      };
    case 'pool':
      return {
        ringR: 2.7,
        bodies: (
          <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
            <cylinderGeometry args={[2.6, 2.7, 0.45, 10]} />
            {mat}
          </mesh>
        ),
        waters: <Water y={0.46} radius={2.35} />,
      };
    case 'pedestal':
      return {
        ringR: 1.7,
        bodies: (
          <group>
            <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
              <cylinderGeometry args={[1.5, 1.7, 0.45, 44]} />
              {mat}
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
              <cylinderGeometry args={[0.42, 0.5, 1.2, 24]} />
              {mat}
            </mesh>
            <mesh castShadow receiveShadow position={[0, 1.65, 0]}>
              <cylinderGeometry args={[1.25, 0.8, 0.5, 44]} />
              {mat}
            </mesh>
          </group>
        ),
        waters: (
          <group>
            <Water y={0.47} radius={1.35} />
            <Water y={1.92} radius={1.05} />
          </group>
        ),
      };
    case 'tiered':
      return {
        ringR: 2.3,
        bodies: (
          <group>
            <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
              <cylinderGeometry args={[2.1, 2.4, 0.7, 46]} />
              {mat}
            </mesh>
            <mesh castShadow receiveShadow position={[0, 1.05, 0]}>
              <cylinderGeometry args={[0.36, 0.46, 1.1, 24]} />
              {mat}
            </mesh>
            <mesh castShadow receiveShadow position={[0, 1.72, 0]}>
              <cylinderGeometry args={[1.15, 0.72, 0.5, 44]} />
              {mat}
            </mesh>
          </group>
        ),
        waters: (
          <group>
            <Water y={0.72} radius={1.85} />
            <Water y={1.99} radius={0.95} />
          </group>
        ),
      };
    default: // round bowl
      return {
        ringR: 2.2,
        bodies: (
          <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
            <cylinderGeometry args={[2.2, 2.5, 0.7, 52]} />
            {mat}
          </mesh>
        ),
        waters: <Water y={0.72} radius={1.95} />,
      };
  }
}

function renderDecoration(variant: string, color?: string) {
  switch (variant) {
    case 'plant':
      return (
        <group>
          <mesh castShadow position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 0.3, 12]} />
            <meshStandardMaterial color="#7a5230" />
          </mesh>
          <mesh castShadow position={[0, 0.55, 0]}>
            <coneGeometry args={[0.4, 0.9, 14]} />
            <meshStandardMaterial color={color || '#3f9e57'} />
          </mesh>
        </group>
      );
    case 'statue':
      return (
        <group>
          <mesh castShadow position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.28, 0.34, 0.7, 20]} />
            <meshStandardMaterial color={color || '#d7d2c8'} roughness={0.6} />
          </mesh>
          <mesh castShadow position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.26, 20, 20]} />
            <meshStandardMaterial color={color || '#d7d2c8'} roughness={0.6} />
          </mesh>
        </group>
      );
    case 'lantern':
      return (
        <mesh castShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[0.5, 0.8, 0.5]} />
          <meshStandardMaterial color={color || '#ff8a5c'} emissive={'#ff7a3c'} emissiveIntensity={0.6} />
        </mesh>
      );
    case 'koi':
      return (
        <mesh castShadow position={[0, 0.12, 0]} scale={[1, 0.4, 0.6]}>
          <sphereGeometry args={[0.4, 18, 18]} />
          <meshStandardMaterial color={color || '#ff8f4d'} />
        </mesh>
      );
    case 'lilypad':
      return (
        <mesh castShadow position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 24]} />
          <meshStandardMaterial color={color || '#4faa74'} side={THREE.DoubleSide} />
        </mesh>
      );
    default: // stone
      return (
        <mesh castShadow position={[0, 0.25, 0]}>
          <dodecahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color={color || '#8f887e'} roughness={0.9} flatShading />
        </mesh>
      );
  }
}
