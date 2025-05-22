// src/components/design/draggable-cabinet-item.tsx
'use client';

import React from 'react';
import type { Cabinet } from '@/types';
import {
  MAX_U,
  VISUAL_SCALE,
  SCALED_U_HEIGHT_PX,
  SCALED_CABINET_VERTICAL_PADDING_PX,
  SCALED_CABINET_SIDE_PADDING_PX,
  SCALED_CABINET_DETAIL_WIDTH_PX,
  SCALED_TOTAL_VISUAL_HEIGHT_PX,
  SCALED_USABLE_HEIGHT_PX,
  DEVICE_COLOR_FRONT_BG,
  DEVICE_COLOR_REAR_BG,
} from '@/lib/constants';
import { useRackVision } from '@/store/rack-vision-store';

interface DraggableCabinetItemProps {
  cabinet: Cabinet;
  isOverlapping: boolean;
}

export const DraggableCabinetItem: React.FC<DraggableCabinetItemProps> = ({ cabinet, isOverlapping }) => {
  const { setActiveTab } = useRackVision();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('cabinetId', cabinet.id);
    const rect = e.currentTarget.getBoundingClientRect();
    // Store the original, unscaled offset
    const offsetX = (e.clientX - rect.left) / VISUAL_SCALE;
    const offsetY = (e.clientY - rect.top) / VISUAL_SCALE;
    e.dataTransfer.setData('offsetX', String(offsetX)); // Corrected syntax here
    e.dataTransfer.setData('offsetY', String(offsetY));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDoubleClick = () => {
    setActiveTab(cabinet.id);
  };

  // Scaled header height
  const headerHeight = 20 * VISUAL_SCALE;

  const renderDevices = () => {
    return cabinet.devices.map((device) => {
      const deviceTop = (MAX_U - (device.startU + device.uSize - 1)) * SCALED_U_HEIGHT_PX;
      const deviceHeight = device.uSize * SCALED_U_HEIGHT_PX;
      return (
        <div
          key={device.id}
          className={`absolute left-0 w-full flex items-center justify-center text-center overflow-hidden ${
            device.face === 'front' ? DEVICE_COLOR_FRONT_BG : DEVICE_COLOR_REAR_BG
          }`}
          style={{
            top: `${deviceTop}px`,
            height: `${deviceHeight}px`,
            fontSize: `${10 * VISUAL_SCALE}px`, // Scale font size
            padding: `${2 * VISUAL_SCALE}px`,
            borderBottom: `${1 * VISUAL_SCALE}px solid rgba(0,0,0,0.1)`,
            boxSizing: 'border-box',
          }}
          title={`${device.brandModel} (U: ${device.startU}-${device.startU + device.uSize -1}, Face: ${device.face})`}
        >
          <span className="truncate" style={{ lineHeight: `${1.2 * VISUAL_SCALE}em` }}>{device.brandModel}</span>
        </div>
      );
    });
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDoubleClick={handleDoubleClick}
      className={`absolute cursor-grab rounded-md shadow-md hover:shadow-lg transition-shadow bg-slate-200 border ${ // Scaled border
        isOverlapping ? 'border-red-500 ring-2 ring-red-500' : 'border-slate-400'
      }`}
      style={{
        left: cabinet.positionX || 0,
        top: cabinet.positionY || 0,
        width: `${SCALED_CABINET_DETAIL_WIDTH_PX}px`,
        height: `${SCALED_TOTAL_VISUAL_HEIGHT_PX}px`,
        boxSizing: 'border-box',
        borderWidth: `${2 * VISUAL_SCALE}px`, // Scale border width if needed
      }}
      title={`Cabinet: ${cabinet.name}
ID: ${cabinet.id}
Position: (X: ${cabinet.positionX}, Y: ${cabinet.positionY})`}
    >
      <div className="relative w-full h-full overflow-hidden flex flex-col">
        <div 
          className="bg-slate-700 text-white font-semibold text-center truncate flex items-center justify-center"
          style={{
             height: `${headerHeight}px`,
             fontSize: `${10 * VISUAL_SCALE}px`,
             padding: `${2*VISUAL_SCALE}px`,
             flexShrink: 0 
            }}
        >
          {cabinet.name}
        </div>
        <div 
          className="relative bg-slate-50 flex-grow"
          style={{
            paddingTop: `${SCALED_CABINET_VERTICAL_PADDING_PX}px`,
            paddingBottom: `${SCALED_CABINET_VERTICAL_PADDING_PX}px`,
          }}
        >
            <div
              className="relative mx-auto bg-white"
              style={{
                height: `${SCALED_USABLE_HEIGHT_PX}px`,
                width: `calc(100% - ${2 * SCALED_CABINET_SIDE_PADDING_PX}px)`,
                marginLeft: `${SCALED_CABINET_SIDE_PADDING_PX}px`,
                marginRight: `${SCALED_CABINET_SIDE_PADDING_PX}px`,
                boxShadow: `inset 0 0 ${2 * VISUAL_SCALE}px rgba(0,0,0,0.2)`,
              }}
            >
              {renderDevices()}
            </div>
        </div>
      </div>
    </div>
  );
};
