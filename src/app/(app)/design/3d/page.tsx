// src/app/(app)/design/3d/page.tsx
'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane, Text } from '@react-three/drei';
import { useRackVision } from '@/store/rack-vision-store';
import type { Cabinet, Device } from '@/types';
import {
  CABINET_3D_WIDTH,
  CABINET_3D_HEIGHT,
  CABINET_3D_DEPTH,
  U_3D_HEIGHT,
  DEVICE_3D_DEPTH,
  MAX_U,
  WORLD_SCALE, // To map 2D design positions to 3D world positions
  COLOR_CABINET_3D,
  COLOR_DEVICE_FRONT_3D,
  COLOR_DEVICE_REAR_3D,     // Corrected: Was COLOR_DEVICE_REAR_BG previously by mistake
  COLOR_DEVICE_OVERSIZED_3D,
} from '@/lib/constants';

// Simple 3D Cabinet Component
const Cabinet3DModel: React.FC<{ cabinet: Cabinet }> = ({ cabinet }) => {
  const cabinetWorldX = (cabinet.positionX || 0) * WORLD_SCALE;
  // In 3D, Y is up. The 2D Y position from the design layout maps to 3D Z.
  const cabinetWorldZ = (cabinet.positionY || 0) * WORLD_SCALE;
  const cabinetWorldY = CABINET_3D_HEIGHT / 2; // Place bottom of cabinet on the ground (y=0)

  return (
    <group position={[cabinetWorldX, cabinetWorldY, cabinetWorldZ]}>
      {/* Cabinet Box */}
      <mesh>
        <boxGeometry args={[CABINET_3D_WIDTH, CABINET_3D_HEIGHT, CABINET_3D_DEPTH]} />
        <meshStandardMaterial color={COLOR_CABINET_3D} opacity={0.9} transparent />
      </mesh>
      {/* Cabinet Name Text (Optional) */}
      <Text
        position={[0, CABINET_3D_HEIGHT / 2 + 0.2, 0]} // Position above the cabinet
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {cabinet.name}
      </Text>

      {/* Devices - Rendered inside the cabinet group, so positions are relative */}
      {cabinet.devices.map(device => {
        const isOversized = device.startU + device.uSize - 1 > MAX_U;
        const effectiveSizeU = isOversized ? MAX_U - device.startU + 1 : device.uSize;
        // Do not render if device effectively has no size or starts completely out of MAX_U range
        if (effectiveSizeU <= 0 || device.startU > MAX_U) return null; 

        const deviceHeight3D = effectiveSizeU * U_3D_HEIGHT;
        
        // Y position of the device center, from bottom of cabinet (0) to top (CABINET_3D_HEIGHT)
        // U1 is at the bottom. 
        // (device.startU - 1) * U_3D_HEIGHT is the bottom edge of the device from cabinet bottom (Y= -CABINET_3D_HEIGHT/2)
        // Add half of deviceHeight3D to get to its center.
        const deviceCenterY = ((device.startU - 1) * U_3D_HEIGHT) + (deviceHeight3D / 2) - (CABINET_3D_HEIGHT / 2);

        let deviceColor = device.face === 'front' ? COLOR_DEVICE_FRONT_3D : COLOR_DEVICE_REAR_3D; // Corrected here
        if (isOversized) {
          deviceColor = COLOR_DEVICE_OVERSIZED_3D;
        }

        // Position device slightly forward/backward based on face
        const deviceOffsetZ = device.face === 'front' ? -CABINET_3D_DEPTH / 2 + DEVICE_3D_DEPTH / 2 : CABINET_3D_DEPTH / 2 - DEVICE_3D_DEPTH / 2;

        return (
          <mesh 
            key={device.id} 
            position={[0, deviceCenterY, deviceOffsetZ]} // X=center, Y=calculated, Z=front/rear
          >
            <boxGeometry args={[CABINET_3D_WIDTH * 0.9, deviceHeight3D, DEVICE_3D_DEPTH]} /> {/* Slightly thinner than cabinet */}
            <meshStandardMaterial color={deviceColor} />
          </mesh>
        );
      })}
    </group>
  );
};

export default function Design3DPage() {
  const { cabinets, isLoadingData } = useRackVision();

  if (isLoadingData && cabinets.length === 0) {
    return <div className="flex items-center justify-center h-screen"><p>Loading 3D Scene...</p></div>;
  }

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 5rem)' /* Adjust height as needed */ }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Ground Plane */}
          <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#555" />
          </Plane>

          {/* Render Cabinets */}
          {cabinets.map((cabinet) => (
            <Cabinet3DModel key={cabinet.id} cabinet={cabinet} />
          ))}

          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
