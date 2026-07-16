'use client';

import { FountainPart, useFountainStore } from '@/store';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import WaterJet from './WaterJet';
import { getFountainSpec, disposeGroup, WaterRing } from '@/fountainModels';

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
      <ringGeometry args={[radius, radius + 0.12, 64]} />
      <meshBasicMaterial color="#2f8fd8" transparent opacity={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Glassy, reflective water that catches the environment and ripples gently.
function WaterSurface({ ring, isPlaying }: { ring: WaterRing; isPlaying: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = ring.y + (isPlaying ? Math.sin(state.clock.elapsedTime * 2.4 + ring.r) * 0.012 : 0);
    }
  });
  return (
    <mesh ref={ref} position={[0, ring.y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      {ring.square ? (
        <planeGeometry args={[ring.r * 2, ring.r * 2]} />
      ) : (
        <circleGeometry args={[ring.r, 64]} />
      )}
      <meshPhysicalMaterial
        color="#2b7fb0"
        roughness={0.06}
        metalness={0}
        transmission={0.35}
        thickness={0.6}
        ior={1.33}
        transparent
        opacity={0.9}
        envMapIntensity={1.4}
        clearcoat={1}
        clearcoatRoughness={0.04}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Imperative fountain model rendered via <primitive>, rebuilt only when the
// variant or colour changes, and disposed to avoid GPU leaks.
function FountainModel({ variant, color }: { variant: string; color: string }) {
  const spec = getFountainSpec(variant);
  const group = useMemo(() => spec.build(color), [spec, color]);
  useEffect(() => () => disposeGroup(group), [group]);
  return <primitive object={group} />;
}

export default function PartComponent({ part, isSelected, isPlaying }: Props) {
  const selectPart = useFountainStore((s) => s.selectPart);
  const [hovered, setHovered] = useState(false);
  const cycleRef = useRef<THREE.PointLight>(null);

  // Smoothly cycle the Color-LED hue while the water runs (delights a light nerd).
  useFrame((state) => {
    if (cycleRef.current && isPlaying && part.catalogId === 'rgb-light') {
      const h = (state.clock.elapsedTime * 0.12) % 1;
      cycleRef.current.color.setHSL(h, 1, 0.6);
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
    const js = part.scale[0];
    const color = part.color || '#5cc0ef';

    if (part.variant === 'ring') {
      // A ring of outward-arcing jets — the classic Sims/Disneyland look.
      const N = 8;
      return (
        <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave}>
          <group scale={[js, js, js]}>
            {Array.from({ length: N }, (_, i) => {
              const a = (i / N) * Math.PI * 2;
              return (
                <group key={i} position={[Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9]}>
                  <WaterJet position={[0, 0, 0]} isPlaying={isPlaying} spread={1.2} power={5} color={color} />
                </group>
              );
            })}
            <WaterJet position={[0, 0, 0]} isPlaying={isPlaying} spread={0.3} power={7} color={color} />
          </group>
          {isSelected && <SelectionRing radius={1.2 * js} />}
        </group>
      );
    }

    const p = jetProfile(part.variant);
    return (
      <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave}>
        <group scale={[js, js, js]}>
          <WaterJet position={[0, 0, 0]} isPlaying={isPlaying} spread={p.spread} power={p.power} color={color} />
        </group>
        {isSelected && <SelectionRing radius={0.3 * js} />}
      </group>
    );
  }

  // ---------- LIGHTS ----------
  if (part.type === 'light') {
    const c = part.color || '#ffcf7a';
    const s = part.scale[0];

    if (part.variant === 'ledring') {
      const N = 10;
      return (
        <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave}>
          <group scale={[s, s, s]}>
            {Array.from({ length: N }, (_, i) => {
              const a = (i / N) * Math.PI * 2;
              const hue = i / N;
              const col = new THREE.Color().setHSL(hue, 1, 0.6);
              return (
                <group key={i} position={[Math.cos(a) * 1.4, 0, Math.sin(a) * 1.4]}>
                  <mesh>
                    <sphereGeometry args={[0.16, 16, 16]} />
                    <meshStandardMaterial color={col} emissive={col} emissiveIntensity={2.4} toneMapped={false} />
                  </mesh>
                  <pointLight color={col} intensity={isPlaying ? 3 : 1.6} distance={5} decay={2} />
                </group>
              );
            })}
          </group>
          {isSelected && <SelectionRing radius={1.5 * s} />}
        </group>
      );
    }

    if (part.variant === 'beam') {
      // A spotlight with a visible volumetric-looking beam cone.
      return (
        <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave}>
          <mesh scale={[s, s, s]}>
            <cylinderGeometry args={[0.18, 0.24, 0.3, 20]} />
            <meshStandardMaterial color="#cfcfcf" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.6 * s, 0]}>
            <coneGeometry args={[0.9 * s, 3.2 * s, 24, 1, true]} />
            <meshBasicMaterial color={c} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          <spotLight position={[0, 0.2, 0]} target-position={[0, 4, 0]} angle={0.5} penumbra={0.6} color={c} intensity={isPlaying ? 12 : 6} distance={10} />
          <mesh>
            <sphereGeometry args={[0.12 * s, 16, 16]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={3} toneMapped={false} />
          </mesh>
          {isSelected && <SelectionRing radius={0.34 * s} />}
        </group>
      );
    }

    // Standard glowing bulb (underwater LED).
    return (
      <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave}>
        <mesh scale={[s, s, s]}>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={isSelected ? 3.4 : hovered ? 2.6 : 2} toneMapped={false} />
        </mesh>
        <pointLight ref={cycleRef} color={c} intensity={isPlaying ? 8 : 4.5} distance={8} decay={2} position={[0, 0.25, 0]} />
        {isSelected && <SelectionRing radius={0.3 * s} />}
      </group>
    );
  }

  // ---------- FOUNTAIN BASES ----------
  if (part.type === 'base') {
    const s = part.scale[0];
    const spec = getFountainSpec(part.variant);
    const stone = isSelected ? '#cfe4f5' : hovered ? '#f3ecdb' : part.color || '#e9e2d2';
    return (
      <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave}>
        <group scale={[s, s, s]}>
          <FountainModel variant={part.variant} color={stone} />
          {spec.waters.map((w, i) => (
            <WaterSurface key={i} ring={w} isPlaying={isPlaying} />
          ))}
        </group>
        {isSelected && <SelectionRing radius={spec.selR * s} />}
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
    case 'hedge':
      return (
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color || '#3c8a4e'} roughness={0.95} />
        </mesh>
      );
    case 'column':
      return (
        <group>
          <mesh castShadow position={[0, 0.1, 0]}>
            <boxGeometry args={[0.6, 0.2, 0.6]} />
            <meshStandardMaterial color={color || '#e4ddcc'} roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.22, 0.26, 1.8, 24]} />
            <meshStandardMaterial color={color || '#e4ddcc'} roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0, 2.1, 0]}>
            <boxGeometry args={[0.6, 0.2, 0.6]} />
            <meshStandardMaterial color={color || '#e4ddcc'} roughness={0.7} />
          </mesh>
        </group>
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
