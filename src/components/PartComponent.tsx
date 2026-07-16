'use client';

import { FountainPart, useFountainStore } from '@/store';
import { useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import WaterJet from './WaterJet';
import { getFountainSpec, disposeGroup, WaterRing } from '@/fountainModels';
import { buildDecoration } from '@/previews';

interface Props {
  part: FountainPart;
  isSelected: boolean;
  isPlaying: boolean;
}

function jetProfile(variant: string) {
  switch (variant) {
    case 'column':
      return { spread: 0.5, power: 6.6 };
    case 'geyser':
      return { spread: 0.3, power: 11 };
    case 'arc':
      return { spread: 1.5, power: 6.2 };
    case 'spray':
      return { spread: 2.6, power: 4.4 };
    case 'bell':
      return { spread: 0.9, power: 5.6 };
    case 'mist':
      return { spread: 2.2, power: 3 };
    case 'foam':
      return { spread: 0.5, power: 3.2 };
    case 'spiral':
      return { spread: 0.8, power: 7 };
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

function WaterSurface({ ring, isPlaying }: { ring: WaterRing; isPlaying: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = ring.y + (isPlaying ? Math.sin(state.clock.elapsedTime * 2.4 + ring.r) * 0.012 : 0);
    }
  });
  return (
    <mesh ref={ref} position={[0, ring.y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      {ring.square ? <planeGeometry args={[ring.r * 2, ring.r * 2]} /> : <circleGeometry args={[ring.r, 64]} />}
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

function FountainModel({ variant, color, scales }: { variant: string; color: string; scales?: number[] }) {
  const spec = getFountainSpec(variant);
  const key = scales ? scales.map((s) => s.toFixed(2)).join(',') : '';
  const group = useMemo(() => spec.build(color, scales), [spec, color, key]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => disposeGroup(group), [group]);
  return <primitive object={group} />;
}

function DecoModel({ variant, color }: { variant: string; color?: string }) {
  const group = useMemo(() => buildDecoration(variant, color || '#9a9488'), [variant, color]);
  useEffect(() => () => disposeGroup(group), [group]);
  return <primitive object={group} />;
}

export default function PartComponent({ part, isSelected, isPlaying }: Props) {
  const selectPart = useFountainStore((s) => s.selectPart);
  const [hovered, setHovered] = useState(false);
  const dynLight = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const l = dynLight.current;
    if (!l || !isPlaying) return;
    const t = state.clock.elapsedTime;
    if (part.variant === 'cycle') l.color.setHSL((t * 0.12) % 1, 1, 0.6);
    else if (part.variant === 'flame') l.intensity = 5 + Math.sin(t * 20) * 1.5 + Math.sin(t * 33) * 1;
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

    const single = (spread: number, power: number, key?: any, pos: [number, number, number] = [0, 0, 0]) => (
      <group key={key} position={pos}>
        <WaterJet position={[0, 0, 0]} isPlaying={isPlaying} spread={spread} power={power} color={color} />
      </group>
    );

    let content: ReactNode;
    let ringR = 0.3;

    if (part.variant === 'ring') {
      ringR = 1.2;
      content = (
        <>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return single(1.2, 5, i, [Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9]);
          })}
          {single(0.3, 7, 'c')}
        </>
      );
    } else if (part.variant === 'crown') {
      ringR = 1.2;
      content = Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return single(0.28, 7.5, i, [Math.cos(a) * 1, 0, Math.sin(a) * 1]);
      });
    } else if (part.variant === 'fanwall') {
      ringR = 1.8;
      content = Array.from({ length: 5 }, (_, i) => single(1.4, 6, i, [(i - 2) * 0.7, 0, 0]));
    } else {
      const p = jetProfile(part.variant);
      content = single(p.spread, p.power);
    }

    return (
      <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave}>
        <group scale={[js, js, js]}>{content}</group>
        {isSelected && <SelectionRing radius={ringR * js} />}
      </group>
    );
  }

  // ---------- LIGHTS ----------
  if (part.type === 'light') {
    const c = part.color || '#ffcf7a';
    const s = part.scale[0];
    const v = part.variant;
    const bulbGlow = (col: string, r = 0.24, ei = 2) => (
      <mesh scale={[s, s, s]}>
        <sphereGeometry args={[r, 24, 24]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={isSelected ? ei + 1.4 : hovered ? ei + 0.6 : ei} toneMapped={false} />
      </mesh>
    );

    let content: ReactNode;
    let ringR = 0.3;

    if (v === 'ledring') {
      ringR = 1.5;
      content = Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const col = new THREE.Color().setHSL(i / 10, 1, 0.6);
        return (
          <group key={i} position={[Math.cos(a) * 1.4 * s, 0, Math.sin(a) * 1.4 * s]}>
            <mesh>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={col} emissive={col} emissiveIntensity={2.4} toneMapped={false} />
            </mesh>
            <pointLight color={col} intensity={isPlaying ? 3 : 1.6} distance={5} decay={2} />
          </group>
        );
      });
    } else if (v === 'washbar') {
      ringR = 1.6;
      content = Array.from({ length: 6 }, (_, i) => (
        <group key={i} position={[(i - 2.5) * 0.5 * s, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.13, 14, 14]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={2.4} toneMapped={false} />
          </mesh>
          <pointLight color={c} intensity={isPlaying ? 4 : 2.2} distance={5} decay={2} />
        </group>
      ));
    } else if (v === 'fiber') {
      ringR = 1.3;
      content = (
        <>
          {Array.from({ length: 34 }, (_, i) => {
            const a = (i * 2.399) % (Math.PI * 2);
            const rad = (i / 34) * 1.2 * s;
            const col = new THREE.Color().setHSL((i * 0.13) % 1, 0.7, 0.7);
            return (
              <mesh key={i} position={[Math.cos(a) * rad, 0.08 + (i % 3) * 0.05, Math.sin(a) * rad]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color={col} emissive={col} emissiveIntensity={3} toneMapped={false} />
              </mesh>
            );
          })}
          <pointLight color={'#ffffff'} intensity={isPlaying ? 2 : 1} distance={5} decay={2} position={[0, 0.4, 0]} />
        </>
      );
    } else if (v === 'beam' || v === 'gobo') {
      content = (
        <>
          <mesh scale={[s, s, s]}>
            <cylinderGeometry args={[0.18, 0.24, 0.3, 20]} />
            <meshStandardMaterial color="#cfcfcf" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.7 * s, 0]}>
            <coneGeometry args={[v === 'gobo' ? 1.1 * s : 0.85 * s, 3.4 * s, v === 'gobo' ? 10 : 26, 1, true]} />
            <meshBasicMaterial color={c} transparent opacity={v === 'gobo' ? 0.16 : 0.13} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          <spotLight position={[0, 0.2, 0]} angle={0.55} penumbra={0.6} color={c} intensity={isPlaying ? 13 : 7} distance={11} />
          {bulbGlow(c, 0.12, 3)}
        </>
      );
    } else if (v === 'laser') {
      content = (
        <>
          <mesh position={[0, 1.6 * s, 0]}>
            <cylinderGeometry args={[0.03 * s, 0.03 * s, 3.2 * s, 10]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={4} toneMapped={false} />
          </mesh>
          {bulbGlow(c, 0.1, 4)}
          <pointLight color={c} intensity={isPlaying ? 5 : 3} distance={6} decay={2} position={[0, 0.2, 0]} />
        </>
      );
    } else if (v === 'wash') {
      content = (
        <>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.1 * s, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshBasicMaterial color={c} transparent opacity={0.14} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          {bulbGlow(c, 0.16, 2.2)}
          <pointLight color={c} intensity={isPlaying ? 6 : 3.4} distance={9} decay={2} position={[0, 0.3, 0]} />
        </>
      );
    } else if (v === 'flame') {
      content = (
        <>
          {bulbGlow('#ff8a2c', 0.2, 2.6)}
          <mesh position={[0, 0.32 * s, 0]} scale={[s, s, s]}>
            <coneGeometry args={[0.12, 0.4, 12]} />
            <meshStandardMaterial color={'#ffd24a'} emissive={'#ffb02c'} emissiveIntensity={3} toneMapped={false} />
          </mesh>
          <pointLight ref={dynLight} color={'#ff9a3c'} intensity={isPlaying ? 5 : 3} distance={7} decay={2} position={[0, 0.4, 0]} />
        </>
      );
    } else {
      // bulb / cycle
      content = (
        <>
          {bulbGlow(c)}
          <pointLight ref={dynLight} color={c} intensity={isPlaying ? 8 : 4.5} distance={8} decay={2} position={[0, 0.25, 0]} />
        </>
      );
    }

    return (
      <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave}>
        {content}
        {isSelected && <SelectionRing radius={ringR * s} />}
      </group>
    );
  }

  // ---------- FOUNTAIN BASES ----------
  if (part.type === 'base') {
    const s = part.scale[0];
    const spec = getFountainSpec(part.variant);
    const stone = isSelected ? '#cfe4f5' : hovered ? '#f3ecdb' : part.color || '#e9e2d2';
    const { waters, selR } = spec.measure(part.tierScales);
    return (
      <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave}>
        <group scale={[s, s, s]}>
          <FountainModel variant={part.variant} color={stone} scales={part.tierScales} />
          {waters.map((w, i) => (
            <WaterSurface key={i} ring={w} isPlaying={isPlaying} />
          ))}
        </group>
        {isSelected && <SelectionRing radius={selR * s} />}
      </group>
    );
  }

  // ---------- DECORATIONS ----------
  const s = part.scale[0];
  return (
    <group position={part.position} onClick={onClick} onPointerEnter={enter} onPointerLeave={leave} scale={[s, s, s]}>
      <DecoModel variant={part.variant} color={isSelected ? '#bcdcf5' : hovered ? '#ffe08a' : part.color} />
      {isSelected && <SelectionRing radius={0.7} />}
    </group>
  );
}
