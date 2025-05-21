
"use client";

import type { Cabinet } from "@/types";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CABINET_WIDTH_MM,
  CABINET_DEPTH_MM,
  CABINET_HEIGHT_MM,
  U_HEIGHT_MM,
  MAX_U,
} from "@/lib/constants";

interface Cabinet3DProps {
  cabinet: Cabinet;
}

// Scale factor for display (mm to scene units)
const SCALE = 0.001; 

const SCALED_CABINET_WIDTH = CABINET_WIDTH_MM * SCALE;
const SCALED_CABINET_DEPTH = CABINET_DEPTH_MM * SCALE;
const SCALED_CABINET_HEIGHT = CABINET_HEIGHT_MM * SCALE;
const SCALED_U_HEIGHT = U_HEIGHT_MM * SCALE;

export function Cabinet3D({ cabinet }: Cabinet3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || !textOverlayRef.current) return;

    const currentMount = mountRef.current;
    const currentTextOverlay = textOverlayRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5); // Light gray background

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(
      SCALED_CABINET_WIDTH * 1.5,
      SCALED_CABINET_HEIGHT * 0.75,
      SCALED_CABINET_DEPTH * 1.5
    );
    camera.lookAt(0, SCALED_CABINET_HEIGHT / 2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, SCALED_CABINET_HEIGHT / 2, 0);
    controls.update();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Cabinet Box (semi-transparent frame)
    const cabinetGeometry = new THREE.BoxGeometry(
      SCALED_CABINET_WIDTH,
      SCALED_CABINET_HEIGHT,
      SCALED_CABINET_DEPTH
    );
    const cabinetMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const cabinetMesh = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
    cabinetMesh.position.y = SCALED_CABINET_HEIGHT / 2; // Center cabinet origin at its base
    scene.add(cabinetMesh);
    
    // Cabinet Edges
    const edges = new THREE.EdgesGeometry(cabinetGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x666666, linewidth: 1.5 });
    const cabinetFrame = new THREE.LineSegments(edges, lineMaterial);
    cabinetFrame.position.copy(cabinetMesh.position);
    scene.add(cabinetFrame);


    // Devices
    const deviceMeshes: THREE.Mesh[] = [];
    currentTextOverlay.innerHTML = ''; // Clear previous text overlays

    cabinet.devices.forEach((device, index) => {
      if (device.startU < 1 || device.startU > MAX_U) return;

      const deviceHeight = device.uSize * SCALED_U_HEIGHT;
      let displayDeviceHeight = deviceHeight;
      if (device.startU + device.uSize - 1 > MAX_U) {
          displayDeviceHeight = (MAX_U - device.startU + 1) * SCALED_U_HEIGHT;
          if (displayDeviceHeight <= 0) return;
      }


      const deviceGeometry = new THREE.BoxGeometry(
        SCALED_CABINET_WIDTH * 0.98, // Slightly smaller than cabinet
        displayDeviceHeight,
        SCALED_CABINET_DEPTH * 0.9 // Shorter depth for devices
      );

      const deviceColor = device.face === "front" ? 0x3498db : 0xf39c12; // Blue : Orange
      const deviceMaterial = new THREE.MeshStandardMaterial({ color: deviceColor, metalness: 0.3, roughness: 0.6 });
      const deviceMesh = new THREE.Mesh(deviceGeometry, deviceMaterial);

      // Position devices. U1 is at the bottom of the cabinet in 3D space.
      // Center of device = (startU - 0.5 + uSize / 2) * SCALED_U_HEIGHT
      // Bottom of device = (startU - 1) * SCALED_U_HEIGHT
      // Center Y of device = bottom_of_device + deviceHeight / 2
      const deviceBottomY = (device.startU - 1) * SCALED_U_HEIGHT;
      deviceMesh.position.y = deviceBottomY + displayDeviceHeight / 2;

      if (device.face === "front") {
        deviceMesh.position.z = (SCALED_CABINET_DEPTH - SCALED_CABINET_DEPTH * 0.9) / 2; // Push to front
      } else { // rear
        deviceMesh.position.z = -(SCALED_CABINET_DEPTH - SCALED_CABINET_DEPTH * 0.9) / 2; // Push to back
      }
      scene.add(deviceMesh);
      deviceMeshes.push(deviceMesh);

      // Add HTML overlay for text
      const textElement = document.createElement('div');
      textElement.className = 'absolute text-xs text-white p-1 bg-black bg-opacity-50 rounded select-none pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis';
      textElement.style.transform = 'translate(-50%, -50%)';
      textElement.innerText = device.brandModel;
      textElement.dataset.deviceId = device.id;
      currentTextOverlay.appendChild(textElement);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
      // Update text overlay positions
      deviceMeshes.forEach((mesh, index) => {
        const device = cabinet.devices.find(d => d.id === (mesh.userData.deviceId || cabinet.devices[index]?.id)); // Find device, assuming userData.deviceId is set or by index
        if (!device) return;

        const textElement = currentTextOverlay.querySelector(`[data-device-id="${device.id}"]`) as HTMLDivElement;
        if (!textElement) return;
        
        const pos = mesh.position.clone();
        // Project 3D point to 2D screen space
        pos.project(camera);

        const x = (pos.x * 0.5 + 0.5) * currentMount.clientWidth;
        const y = (pos.y * -0.5 + 0.5) * currentMount.clientHeight;
        
        textElement.style.left = `${x}px`;
        textElement.style.top = `${y}px`;

        // Basic occlusion check (very simplified)
        const distanceToCamera = camera.position.distanceTo(mesh.position);
        const raycaster = new THREE.Raycaster(camera.position, mesh.position.clone().sub(camera.position).normalize());
        const intersects = raycaster.intersectObjects(scene.children);
        let occluded = false;
        if (intersects.length > 0) {
            if (intersects[0].object !== mesh && intersects[0].distance < distanceToCamera - 0.1 /* tolerance */) {
                occluded = true;
            }
        }
        textElement.style.display = occluded ? 'none' : 'block';

      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      currentMount.removeChild(renderer.domElement);
      renderer.dispose();
      // Dispose geometries, materials, textures etc.
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      currentTextOverlay.innerHTML = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cabinet]); // Rerun effect if cabinet data changes

  return (
    <div className="w-full h-[calc(100vh-20rem)] relative border rounded-md shadow-lg overflow-hidden">
      <h2 className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-semibold z-10 text-foreground bg-background/70 px-3 py-1 rounded">
        {cabinet.name} - 3D View
      </h2>
      <div ref={mountRef} className="w-full h-full" />
      <div ref={textOverlayRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
    </div>
  );
}

