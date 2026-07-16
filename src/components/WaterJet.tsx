'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WaterJetProps {
  position: [number, number, number];
  isPlaying: boolean;
  // spread controls how wide the spray fans out (0 = straight column, higher = fan)
  spread?: number;
  // power controls initial upward velocity (jet height)
  power?: number;
  color?: string;
}

const PARTICLE_COUNT = 1100;
const GRAVITY = 9.8;

// A single water jet rendered as a GPU point cloud driven by simple ballistic
// physics on the CPU: every particle is launched upward from the nozzle with a
// little randomized sideways spread, then falls under gravity and respawns.
export default function WaterJet({
  position,
  isPlaying,
  spread = 0.6,
  power = 5.5,
  color = '#5cc0ef',
}: WaterJetProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Per-particle state lives outside React so we can mutate it every frame
  // without triggering re-renders.
  const { positions, velocities, lifetimes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const lifetimes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      resetParticle(positions, velocities, lifetimes, i, spread, power);
      // Stagger initial lifetimes so the stream is continuous, not pulsed.
      lifetimes[i] = Math.random() * 1.6;
    }
    return { positions, velocities, lifetimes };
  }, [spread, power]);

  const circleTexture = useMemo(() => makeDropletTexture(), []);

  useFrame((_, rawDelta) => {
    const geom = pointsRef.current?.geometry;
    if (!geom) return;

    // Clamp delta so a paused/backgrounded tab doesn't teleport particles.
    const delta = Math.min(rawDelta, 0.05);
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;

    if (isPlaying) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;

        velocities[ix + 1] -= GRAVITY * delta;
        positions[ix] += velocities[ix] * delta;
        positions[ix + 1] += velocities[ix + 1] * delta;
        positions[ix + 2] += velocities[ix + 2] * delta;

        lifetimes[i] += delta;

        // Respawn once the droplet has fallen back to (or below) the nozzle.
        if (positions[ix + 1] < 0 && velocities[ix + 1] < 0) {
          resetParticle(positions, velocities, lifetimes, i, spread, power);
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Nozzle sitting at the base of the spray */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 0.16, 16]} />
        <meshStandardMaterial color="#9aa4ad" metalness={0.85} roughness={0.3} />
      </mesh>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={circleTexture}
          color={color}
          size={0.17}
          sizeAttenuation
          transparent
          opacity={1}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function resetParticle(
  positions: Float32Array,
  velocities: Float32Array,
  lifetimes: Float32Array,
  i: number,
  spread: number,
  power: number
) {
  const ix = i * 3;
  // Start at the nozzle mouth with a tiny random offset.
  positions[ix] = (Math.random() - 0.5) * 0.05;
  positions[ix + 1] = 0.15;
  positions[ix + 2] = (Math.random() - 0.5) * 0.05;

  // Launch upward with a randomized cone of sideways spread.
  const angle = Math.random() * Math.PI * 2;
  const radial = Math.random() * spread;
  velocities[ix] = Math.cos(angle) * radial;
  velocities[ix + 1] = power * (0.85 + Math.random() * 0.3);
  velocities[ix + 2] = Math.sin(angle) * radial;

  lifetimes[i] = 0;
}

// Soft round droplet sprite so points look like water, not squares.
function makeDropletTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(210,240,255,0.8)');
  gradient.addColorStop(1, 'rgba(160,210,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
