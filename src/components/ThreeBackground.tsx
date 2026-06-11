'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const FIBONACCI_COUNT = 12;
const STAR_COUNT = 2000;
const DUST_COUNT = 300;
const THORN_COUNT = 24;
const SPHERE_RADIUS = 200;

interface SphereData {
  mass: number;
  speed: number;
  orbitRadius: number;
  angle: number;
  size: number;
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const starFieldRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);
  const spheresRef = useRef<THREE.Mesh[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const starPositions = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 100 + Math.random() * 800;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  const dustPositions = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
    }
    return positions;
  }, []);

  const spheres = useMemo(() => {
    const data: SphereData[] = [];
    for (let i = 0; i < FIBONACCI_COUNT; i++) {
      const t = (i + 1) / FIBONACCI_COUNT;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      data.push({
        mass: 0.5 + Math.random() * 2,
        speed: 0.0003 + Math.random() * 0.0005,
        orbitRadius: 80 + Math.random() * 150,
        angle: Math.random() * Math.PI * 2,
        size: 3 + Math.random() * 6,
      });
    }
    return data;
  }, []);

  const thornPositions = useMemo(() => {
    const positions: { x: number; y: number; z: number; rot: number }[] = [];
    for (let i = 0; i < THORN_COUNT; i++) {
      const angle = (i / THORN_COUNT) * Math.PI * 2;
      const r = 50 + Math.random() * 10;
      positions.push({
        x: Math.cos(angle) * r,
        y: 0,
        z: Math.sin(angle) * r,
        rot: angle,
      });
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Mouse-follow parallax
      const mx = (state.mouse.x * 0.05);
      const my = (state.mouse.y * 0.05);
      groupRef.current.rotation.x += (my * 0.3 - groupRef.current.rotation.x) * 0.02;
      groupRef.current.rotation.y += (mx * 0.3 - groupRef.current.rotation.y) * 0.02;

      // Auto-rotation
      groupRef.current.rotation.y += 0.0003;
    }

    // Star field subtle rotation
    if (starFieldRef.current) {
      starFieldRef.current.rotation.y += 0.0001;
    }

    // Dust drift
    if (dustRef.current) {
      const positions = dustRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < DUST_COUNT; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.01;
        positions[i * 3] += Math.cos(state.clock.elapsedTime * 0.08 + i * 0.5) * 0.005;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Orbit spheres
    spheresRef.current.forEach((mesh, i) => {
      if (mesh) {
        const s = spheres[i];
        s.angle += s.speed;
        const x = Math.cos(s.angle) * s.orbitRadius;
        const z = Math.sin(s.angle) * s.orbitRadius;
        mesh.position.x = x;
        mesh.position.z = z;
        mesh.rotation.x = state.clock.elapsedTime * 0.1 * s.speed * 100;
        mesh.rotation.y = state.clock.elapsedTime * 0.15 * s.speed * 100;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Ambient light */}
      <ambientLight intensity={0.08} color="#550000" />
      {/* Dim red light */}
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#ff0000" distance={800} decay={2} />
      {/* Point crimson light */}
      <pointLight position={[100, 100, 100]} intensity={0.5} color="#ff1a6b" distance={600} decay={2} />

      {/* Star field */}
      <points ref={starFieldRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={STAR_COUNT}
            array={starPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          color="#b8a9c4"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Crimson dust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={DUST_COUNT}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          color="#ff0000"
          transparent
          opacity={0.15}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Universe spheres */}
      {spheres.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) spheresRef.current[i] = el; }}
          position={[
            Math.cos(s.angle) * s.orbitRadius,
            (Math.random() - 0.5) * 40,
            Math.sin(s.angle) * s.orbitRadius,
          ]}
        >
          <sphereGeometry args={[s.size, 12, 12]} />
          <meshBasicMaterial
            color="#ff0000"
            wireframe
            transparent
            opacity={0.3 + s.mass * 0.1}
          />
        </mesh>
      ))}

      {/* Thorn ring */}
      {thornPositions.map((t, i) => (
        <mesh key={i} position={[t.x, t.y, t.z]} rotation={[0, t.rot, 0]}>
          <coneGeometry args={[1, 12, 4]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function ThreeBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 500], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
