'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
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

interface Cabinet3DProps {
  cabinet: Cabinet;
}

export function Cabinet3D({ cabinet }: Cabinet3DProps) {
  const cabinetRef = useRef<THREE.Group>(null);
  
  // Create a material with better properties
  const createDeviceMaterial = (color: THREE.ColorRepresentation, isOversized: boolean) => {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: isOversized ? 0.9 : 0.3,
      roughness: isOversized ? 0.1 : 0.5,
      emissive: isOversized ? color : 0x000000,
      emissiveIntensity: isOversized ? 0.2 : 0,
    });
  };

  // Cabinet frame parts
  const frameThickness = 0.05;
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: COLOR_CABINET_3D,
    metalness: 0.8,
    roughness: 0.2,
  });

  // Glass door component
  const GlassDoor = ({ positionZ, rotationY = 0 }: { positionZ: number; rotationY?: number }) => (
    <mesh 
      position={[0, 0, positionZ]} 
      rotation={[0, rotationY, 0]}
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

  return (
    <group ref={cabinetRef}>
      {/* Cabinet frame */}
      {/* Left side */}
      <mesh
        position={[-CABINET_3D_WIDTH/2 + frameThickness/2, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[
          frameThickness,
          CABINET_3D_HEIGHT - frameThickness * 2,
          CABINET_3D_DEPTH - frameThickness * 2
        ]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      {/* Right side */}
      <mesh
        position={[CABINET_3D_WIDTH/2 - frameThickness/2, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[
          frameThickness,
          CABINET_3D_HEIGHT - frameThickness * 2,
          CABINET_3D_DEPTH - frameThickness * 2
        ]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      {/* Top */}
      <mesh
        position={[0, CABINET_3D_HEIGHT/2 - frameThickness/2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[CABINET_3D_WIDTH, frameThickness, CABINET_3D_DEPTH]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      {/* Bottom */}
      <mesh
        position={[0, -CABINET_3D_HEIGHT/2 + frameThickness/2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[CABINET_3D_WIDTH, frameThickness, CABINET_3D_DEPTH]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      {/* Front glass door */}
      <GlassDoor positionZ={CABINET_3D_DEPTH/2 - 0.01} />
      
      {/* Back glass door */}
      <GlassDoor positionZ={-CABINET_3D_DEPTH/2 + 0.01} rotationY={Math.PI} />

      {/* Devices */}
      {cabinet.devices?.map((device) => {
        const isOversized = device.startU + device.uSize - 1 > MAX_U;
        const effectiveSizeU = isOversized ? Math.max(0, MAX_U - device.startU + 1) : device.uSize;
        
        if (effectiveSizeU <= 0 || device.startU > MAX_U) return null;

        const deviceHeight3D = effectiveSizeU * U_3D_HEIGHT;
        const deviceCenterY = (CABINET_3D_HEIGHT / 2) - ((device.startU - 1) * U_3D_HEIGHT) - (deviceHeight3D / 2);
        const isFront = device.face === 'front';
        const deviceColor = isFront 
          ? COLOR_DEVICE_FRONT_3D 
          : isOversized 
            ? COLOR_DEVICE_OVERSIZED_3D 
            : COLOR_DEVICE_REAR_3D;
        
        // Move devices 30% further inside the cabinet (20% + 10% more)
        const deviceOffsetZ = isFront 
          ? -CABINET_3D_DEPTH/2 * 0.7 + DEVICE_3D_DEPTH/2
          : CABINET_3D_DEPTH/2 * 0.7 - DEVICE_3D_DEPTH/2;
        
        const deviceMaterial = createDeviceMaterial(deviceColor, isOversized);
        const deviceWidth = CABINET_3D_WIDTH * 0.9;

        return (
          <group key={device.id}>
            <mesh 
              position={[0, deviceCenterY, deviceOffsetZ]}
              castShadow
              receiveShadow
            >
              <RoundedBox 
                args={[deviceWidth * 0.95, deviceHeight3D * 0.95, DEVICE_3D_DEPTH * 1.5]} 
                radius={0.02}
                smoothness={4}
              >
                <primitive object={deviceMaterial} attach="material" />
              </RoundedBox>
            </mesh>
            
            {/* Device label */}
            <group position={[0, deviceCenterY, deviceOffsetZ]}>
              <group 
                position={[0, 0, isFront ? -DEVICE_3D_DEPTH * 0.75 - 0.01 : DEVICE_3D_DEPTH * 0.75 + 0.01]} 
                rotation={[0, isFront ? 0 : Math.PI, 0]}
              >
                <group rotation={[0, Math.PI, 0]}>
                  <Text
                    position={[0, 0, 0.001]}
                    fontSize={0.06}
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
        );
      })}
      
      {/* U markers */}
      {Array.from({ length: MAX_U + 1 }).map((_, i) => {
        if (i % 5 !== 0) return null;
        return (
          <group key={`u-marker-${i}`}>
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
          </group>
        );
      })}
    </group>
  );
}
