'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { Cabinet3D } from './cabinet-3d';
import type { Cabinet } from '@/types';
import { 
  WORLD_SCALE,
  CABINET_3D_HEIGHT 
} from '@/lib/constants';

interface Design3DLayoutProps {
  cabinets: Cabinet[];
}

export function Design3DLayout({ cabinets }: Design3DLayoutProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{
          position: [10, 15, 15],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} />
        
        {/* Ground Plane */}
        <Plane
          args={[100, 100]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <meshStandardMaterial color="#f0f0f0" />
        </Plane>

        {/* Grid */}
        <gridHelper args={[100, 100, '#999', '#ddd']} position={[0, 0.01, 0]} />

        {/* Render all cabinets */}
        {cabinets.map((cabinet) => (
          <group
            key={cabinet.id}
            position={[
              (cabinet.positionX || 0) * WORLD_SCALE,
              CABINET_3D_HEIGHT / 2, // Raise cabinet by half its height
              (cabinet.positionY || 0) * WORLD_SCALE
            ]}
          >
            <Cabinet3D cabinet={cabinet} />
          </group>
        ))}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={50}
          target={[0, 1, 0]}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
