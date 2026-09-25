import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

const ParticleNetwork = () => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 50; i++) {
        p.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10));
    }
    return p;
  }, []);

  const lines = useMemo(() => {
      const l = [];
      for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
              if (points[i].distanceTo(points[j]) < 4) {
                  l.push([points[i], points[j]]);
              }
          }
      }
      return l;
  }, [points]);

  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
        groupRef.current.rotation.y += 0.002;
        groupRef.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#00ffcc" />
        </mesh>
      ))}
      {lines.map((line, i) => (
         <Line key={i} points={line} color="#0088aa" opacity={0.3} transparent lineWidth={1} />
      ))}
    </group>
  );
};

const Background3D = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: '#050505' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <fog attach="fog" args={['#050505', 5, 20]} />
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ParticleNetwork />
      </Canvas>
    </div>
  );
};

export default Background3D;
