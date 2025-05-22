// src/components/cabinet-view/single-cabinet-3d-view.tsx
'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Center } from '@react-three/drei';
import type { Cabinet, Device } from '@/types';
import {
  CABINET_3D_WIDTH,
  CABINET_3D_HEIGHT,
  CABINET_3D_DEPTH,
  U_3D_HEIGHT,
  DEVICE_3D_DEPTH,
  MAX_U,
  COLOR_CABINET_3D,
  COLOR_DEVICE_FRONT_3D,
  COLOR_DEVICE_REAR_3D,
  COLOR_DEVICE_OVERSIZED_3D,
} from '@/lib/constants';

interface SingleCabinet3DViewProps {
  cabinet: Cabinet;
}

// This is kept for when we re-enable the Canvas
const Cabinet3DModel: React.FC<{ cabinet: Cabinet }> = ({ cabinet }) => {
  const cabinetCenterY = 0; 

  return (
    <group>
      <mesh position={[0, cabinetCenterY, 0]}>
        <boxGeometry args={[CABINET_3D_WIDTH, CABINET_3D_HEIGHT, CABINET_3D_DEPTH]} />
        <meshStandardMaterial color={COLOR_CABINET_3D} opacity={0.8} transparent />
      </mesh>
      {cabinet.devices.map(device => {
        const isOversized = device.startU + device.uSize - 1 > MAX_U;
        let effectiveSizeU = device.uSize;
        if (isOversized) {
          effectiveSizeU = Math.max(0, MAX_U - device.startU + 1);
        }
        if (effectiveSizeU <= 0 || device.startU > MAX_U) return null;

        const deviceHeight3D = effectiveSizeU * U_3D_HEIGHT;
        const deviceCenterY = ((device.startU - 1) * U_3D_HEIGHT) + (deviceHeight3D / 2) - (CABINET_3D_HEIGHT / 2);
        let deviceColor = device.face === 'front' ? COLOR_DEVICE_FRONT_3D : COLOR_DEVICE_REAR_3D;
        if (isOversized) deviceColor = COLOR_DEVICE_OVERSIZED_3D;
        const deviceOffsetZ = device.face === 'front' 
          ? -CABINET_3D_DEPTH / 2 + DEVICE_3D_DEPTH / 2 
          : CABINET_3D_DEPTH / 2 - DEVICE_3D_DEPTH / 2;
        return (
          <mesh 
            key={device.id} 
            position={[0, deviceCenterY, deviceOffsetZ]}
          >
            <boxGeometry args={[CABINET_3D_WIDTH * 0.85, deviceHeight3D, DEVICE_3D_DEPTH]} />
            <meshStandardMaterial color={deviceColor} />
          </mesh>
        );
      })}
    </group>
  );
};

export const SingleCabinet3DView: React.FC<SingleCabinet3DViewProps> = ({ cabinet }) => {
  console.log("[SingleCabinet3DView] Rendering for cabinet:", cabinet?.name);
  if (!cabinet) {
    return <div style={{color: 'orange'}}>No cabinet data provided to SingleCabinet3DView.</div>;
  }
  
  // Log the constants to ensure they are valid numbers
  console.log("[SingleCabinet3DView] Constants: ", {
    CABINET_3D_WIDTH,
    CABINET_3D_HEIGHT,
    CABINET_3D_DEPTH,
  });

  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #ccc', marginTop: '1rem', background: '#f0f0f0' }}>
      <p className="p-2 text-sm">Displaying 3D View for: <strong>{cabinet.name}</strong></p>
      <p className="p-2 text-xs">Device count: {cabinet.devices?.length || 0}</p>
      {/* <Canvas camera={{ position: [CABINET_3D_WIDTH * 1.5, CABINET_3D_HEIGHT * 0.75, CABINET_3D_DEPTH * 2.5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          <Center>
            <Cabinet3DModel cabinet={cabinet} />
          </Center>
          <OrbitControls />
        </Suspense>
      </Canvas> */}
      <div style={{padding: '10px', color: 'blue'}}> Canvas is temporarily commented out for testing. If you see this text and the cabinet name/device count above, the component is mounting correctly when the checkbox is ticked.</div>
    </div>
  );
};
