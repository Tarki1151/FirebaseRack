// src/components/cabinet-view/single-cabinet-3d-view.tsx
'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Center, useHelper, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
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

// Helper component for debugging lights
const Lights = () => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'white');

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight 
        ref={directionalLightRef}
        position={[5, 10, 7]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <directionalLight position={[0, -5, 0]} intensity={0.2} />
    </>
  );
};

// Simple text component for device labels
const DeviceLabel = ({ position, text, color = 'white' }: { position: [number, number, number], text: string, color?: string }) => (
  <Text
    position={position}
    fontSize={0.1}
    color={color}
    anchorX="center"
    anchorY="middle"
    maxWidth={CABINET_3D_WIDTH * 0.8}
    lineHeight={1}
    letterSpacing={0.02}
    textAlign="center"
  >
    {text}
  </Text>
);

interface SingleCabinet3DViewProps {
  cabinet: Cabinet;
}

// Cabinet frame component
const CabinetFrame = () => {
  const frameThickness = 0.05;
  const material = new THREE.MeshStandardMaterial({
    color: COLOR_CABINET_3D,
    metalness: 0.8,
    roughness: 0.2,
  });
  
  // Cabinet frame parts
  const parts = [
    // Left side
    {
      position: [
        -CABINET_3D_WIDTH/2 + frameThickness/2, 
        0, 
        0
      ],
      size: [
        frameThickness, 
        CABINET_3D_HEIGHT - frameThickness*2, 
        CABINET_3D_DEPTH - frameThickness*2
      ]
    },
    // Right side
    {
      position: [
        CABINET_3D_WIDTH/2 - frameThickness/2, 
        0, 
        0
      ],
      size: [
        frameThickness, 
        CABINET_3D_HEIGHT - frameThickness*2, 
        CABINET_3D_DEPTH - frameThickness*2
      ]
    },
    // Top
    {
      position: [
        0, 
        CABINET_3D_HEIGHT/2 - frameThickness/2, 
        0
      ],
      size: [
        CABINET_3D_WIDTH, 
        frameThickness, 
        CABINET_3D_DEPTH
      ]
    },
    // Bottom
    {
      position: [
        0, 
        -CABINET_3D_HEIGHT/2 + frameThickness/2, 
        0
      ],
      size: [
        CABINET_3D_WIDTH, 
        frameThickness, 
        CABINET_3D_DEPTH
      ]
    },
    // Back glass door
    {
      position: [
        0, 
        0, 
        CABINET_3D_DEPTH/2 - frameThickness/2
      ],
      render: () => (
        <mesh 
          position={[0, 0, 0]} 
          castShadow
        >
          <planeGeometry args={[CABINET_3D_WIDTH * 0.98, CABINET_3D_HEIGHT * 0.98]} />
          <meshStandardMaterial 
            color={0xffffff} 
            transparent 
            opacity={0.2} 
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      )
    },
  ];

  return (
    <group>
      {parts.map((part, index) => (
        part.render ? (
          <group key={index} position={part.position as [number, number, number]}>
            {part.render()}
          </group>
        ) : (
          <mesh
            key={index}
            position={part.position as [number, number, number]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={part.size as [number, number, number]} />
            <primitive object={material.clone()} attach="material" />
          </mesh>
        )
      ))}
    </group>
  );
};

// Glass door effect
const GlassDoor = () => (
  <mesh 
    position={[0, 0, -CABINET_3D_DEPTH/2 + 0.01]} 
    rotation={[0, 0, 0]}
    castShadow
    receiveShadow
  >
    <planeGeometry args={[CABINET_3D_WIDTH * 0.98, CABINET_3D_HEIGHT * 0.98]} />
    <meshStandardMaterial 
      color={0xffffff} 
      transparent 
      opacity={0.15} 
      roughness={0.1}
      metalness={0.9}
    />
  </mesh>
);

// Main cabinet component with devices
const Cabinet3DModel: React.FC<{ cabinet: Cabinet }> = ({ cabinet }) => {
  const cabinetCenterY = 0;
  const deviceWidth = CABINET_3D_WIDTH * 0.9;
  const deviceDepth = DEVICE_3D_DEPTH * 1.5;
  
  // Create a material with better properties
  const createDeviceMaterial = (color: number, isOversized: boolean) => {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: isOversized ? 0.9 : 0.3,
      roughness: isOversized ? 0.1 : 0.5,
      emissive: isOversized ? color : 0x000000,
      emissiveIntensity: isOversized ? 0.2 : 0,
    });
  };

  return (
    <group>
      {/* Cabinet frame */}
      <CabinetFrame />
      
      {/* Front glass door */}
      <GlassDoor />
      
      {/* Devices */}
      {cabinet.devices.map(device => {
        const isOversized = device.startU + device.uSize - 1 > MAX_U;
        let effectiveSizeU = device.uSize;
        if (isOversized) {
          effectiveSizeU = Math.max(0, MAX_U - device.startU + 1);
        }
        if (effectiveSizeU <= 0 || device.startU > MAX_U) return null;

        const deviceHeight3D = effectiveSizeU * U_3D_HEIGHT;
        // Flip the Y-coordinate to place devices from bottom to top
        const deviceCenterY = (CABINET_3D_HEIGHT / 2) - ((device.startU - 1) * U_3D_HEIGHT) - (deviceHeight3D / 2);
        const isFront = device.face === 'front';
        const deviceColor = isFront ? COLOR_DEVICE_FRONT_3D : 
                            isOversized ? COLOR_DEVICE_OVERSIZED_3D : 
                            COLOR_DEVICE_REAR_3D;
        
        const deviceOffsetZ = isFront 
          ? -CABINET_3D_DEPTH/2 + deviceDepth/2 + 0.02
          : CABINET_3D_DEPTH/2 - deviceDepth/2 - 0.01;
        
        const deviceMaterial = createDeviceMaterial(deviceColor, isOversized);
        
        return (
          <group key={device.id}>
            <group>
              <mesh 
                position={[0, deviceCenterY, deviceOffsetZ]}
                castShadow
                receiveShadow
              >
                <RoundedBox 
                  args={[deviceWidth * 0.95, deviceHeight3D * 0.95, deviceDepth]} 
                  radius={0.02}
                  smoothness={4}
                >
                  <primitive object={deviceMaterial} attach="material" />
                </RoundedBox>
              </mesh>
              
              {/* Device label on original face */}
              <group position={[0, deviceCenterY, deviceOffsetZ]}>
                <group position={[0, 0, isFront ? -deviceDepth/2 - 0.01 : deviceDepth/2 + 0.01]} rotation={[0, isFront ? 0 : Math.PI, 0]}>
                  <group rotation={[0, Math.PI, 0]}>
                    <Text
                      position={[0, 0, 0.001]} // Slightly in front of the face
                      fontSize={0.06} // Smaller font size
                      color="white"
                      anchorX="center"
                      anchorY="middle"
                      maxWidth={deviceWidth * 0.9}
                      lineHeight={1}
                      letterSpacing={0.015}
                      textAlign="center"
                      outlineWidth={0.002}
                      outlineColor="#000000"
                      outlineOpacity={0.8}
                      depthOffset={1}
                    >
                      {device.brandModel || device.id}
                    </Text>
                  </group>
                </group>
              </group>
            </group>
          </group>
        );
      })}
      
      {/* U markers - flipped to match bottom-to-top */}
      {Array.from({ length: MAX_U + 1 }).map((_, i) => (
        <group key={`u-marker-${i}`}>
          {i % 5 === 0 && (
            <>
              <mesh position={[CABINET_3D_WIDTH/2 + 0.1, CABINET_3D_HEIGHT/2 - i * U_3D_HEIGHT, 0]}>
                <boxGeometry args={[0.1, 0.01, 0.1]} />
                <meshBasicMaterial color="#64748b" />
              </mesh>
              <Text
                position={[CABINET_3D_WIDTH/2 + 0.2, CABINET_3D_HEIGHT/2 - i * U_3D_HEIGHT, 0]}
                fontSize={0.1}
                color="#64748b"
                anchorX="left"
                anchorY="middle"
              >
                {i}U
              </Text>
            </>
          )}
        </group>
      ))}
    </group>
  );
};

export const SingleCabinet3DView: React.FC<SingleCabinet3DViewProps> = ({ cabinet }) => {
  const orbitControlsRef = useRef<any>(null);
  
  // Early return for missing cabinet data
  if (!cabinet) {
    return (
      <div className="flex items-center justify-center w-full h-[500px] border border-gray-200 rounded-lg bg-gray-50">
        <div className="p-4 text-center">
          <div className="text-orange-500 font-medium">No cabinet data available</div>
          <p className="text-sm text-gray-600 mt-1">Please select a valid cabinet to view in 3D</p>
        </div>
      </div>
    );
  }
  
  // Calculate a good initial camera position based on cabinet size
  const cameraDistance = Math.max(
    CABINET_3D_WIDTH * 2.5, 
    CABINET_3D_HEIGHT * 1.5, 
    CABINET_3D_DEPTH * 4
  );

  return (
    <div className="flex flex-col w-full h-[500px] border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="p-2 bg-white/90 backdrop-blur-sm text-gray-800 text-sm border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-gray-900">{cabinet.name}</span>
            <span className="text-xs text-gray-500 ml-2">• {cabinet.devices?.length || 0} cihaz</span>
          </div>
          <div className="text-xs text-gray-500">
            Döndürmek için sağ tıkla • Yakınlaştırmak için kaydır • Kaydırmak için orta tıkla
          </div>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas 
          camera={{ 
            position: [cameraDistance * 0.7, cameraDistance * 0.5, cameraDistance * 0.7],
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          shadows
        >
        <Suspense fallback={null}>
          <Lights />
          
          {/* Cabinet with devices */}
          <Center>
            <Cabinet3DModel cabinet={cabinet} />
          </Center>
          
          {/* Orbit controls */}
          <OrbitControls 
            ref={orbitControlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={CABINET_3D_WIDTH * 0.8}
            maxDistance={CABINET_3D_WIDTH * 10}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
            screenSpacePanning={true}
            target={[0, CABINET_3D_HEIGHT * 0.1, 0]}
          />
          
          {/* Soft background */}
          <color attach="background" args={[0xf8fafc]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 7]} intensity={0.8} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
