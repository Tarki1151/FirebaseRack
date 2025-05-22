'use client'; // This component uses client-side state and event handlers

import React, { useState, useRef } from 'react'; // Import useState and useRef
import type { Cabinet, Device } from "@/types";
import {
  MAX_U,
  SCALED_U_HEIGHT_PX,
  SCALED_CABINET_DETAIL_WIDTH_PX,
  SCALED_TOTAL_VISUAL_HEIGHT_PX,
  SCALED_CABINET_VERTICAL_PADDING_PX,
  SCALED_CABINET_SIDE_PADDING_PX,
  SCALED_USABLE_HEIGHT_PX,
  VISUAL_SCALE, // Import VISUAL_SCALE for font scaling
} from "@/lib/constants";
import { Device2D } from "./device-2d";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button"; // For zoom buttons
import { ZoomInIcon, ZoomOutIcon, RotateCcwIcon } from "lucide-react"; // Icons for buttons

interface Cabinet2DProps {
  cabinet: Cabinet;
}

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;

export function Cabinet2D({ cabinet }: Cabinet2DProps) {
  const [scale, setScale] = useState(1);
  // const headerHeight = 20 * VISUAL_SCALE; // Scale header height if it's part of the scaled content
  const headerHeight = SCALED_CABINET_VERTICAL_PADDING_PX; // Or use vertical padding as reference if header is inside this.

  const usableDeviceAreaWidth = SCALED_CABINET_DETAIL_WIDTH_PX - (2 * SCALED_CABINET_SIDE_PADDING_PX);

  const zoomIn = () => setScale(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  const zoomOut = () => setScale(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
  const resetZoom = () => setScale(1);

  const renderFace = (faceType: "front" | "rear") => {
    return (
      <div 
        className="relative bg-slate-200 border border-slate-400 rounded-md shadow-lg origin-top-left"
        style={{
          width: SCALED_CABINET_DETAIL_WIDTH_PX,
          height: SCALED_TOTAL_VISUAL_HEIGHT_PX,
          boxSizing: 'border-box',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div className="relative w-full h-full overflow-hidden flex flex-col">
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
                width: `${usableDeviceAreaWidth}px`,
                marginLeft: `${SCALED_CABINET_SIDE_PADDING_PX}px`,
                marginRight: `${SCALED_CABINET_SIDE_PADDING_PX}px`,
                boxShadow: 'inset 0 0 2px rgba(0,0,0,0.2)',
              }}
            >
              {cabinet.devices
                .filter((device) => device.face === faceType)
                .map((device) => (
                  <Device2D 
                    key={device.id} 
                    device={device} 
                    cabinetWidth={usableDeviceAreaWidth}
                  />
                ))}
            </div>
          </div>
        </div>
        {/* U Numbering - positioned absolutely relative to the main cabinet div */}
        <div 
            className={`absolute top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground select-none ${
                faceType === 'front' ? '-left-7' : '-right-7 items-end' // Adjusted for slightly more space for numbers
            }`}
            style={{ 
                // Align U numbers with the usable U space, considering the top padding
                paddingTop: `${SCALED_CABINET_VERTICAL_PADDING_PX}px`, 
                paddingBottom: `${SCALED_CABINET_VERTICAL_PADDING_PX}px`,
            }}
        >
            {[...Array(MAX_U)].map((_, i) => {
                // Iterate from top (MAX_U) down to 1 for display order in flex column
                const uNumberToDisplay = MAX_U - i;
                 return (
                    (uNumberToDisplay % 5 === 0 || uNumberToDisplay === MAX_U || uNumberToDisplay === 1) ? 
                    <span key={`${faceType}-u-${uNumberToDisplay}`} style={{ height: SCALED_U_HEIGHT_PX, fontSize: `${8 * VISUAL_SCALE}px`}} className="flex items-center justify-center">{uNumberToDisplay}</span>
                    : 
                    <span key={`${faceType}-u-${uNumberToDisplay}`} style={{ height: SCALED_U_HEIGHT_PX, fontSize: `${8 * VISUAL_SCALE}px`}} className="flex items-center justify-center">&nbsp;</span>
                );
            })}
        </div>
         <span 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300 font-bold select-none opacity-80 transform rotate-90 tracking-wider"
            style={{fontSize: `${24 * VISUAL_SCALE}px`}} // Scaled font size for FRONT/REAR text
        >
            {faceType.toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <ScrollArea 
        className="w-full h-[calc(100vh-10rem)] border rounded-md shadow-lg bg-slate-100 relative overflow-auto"
    >
        {/* Zoom Buttons with higher z-index */}
        <div className="absolute top-2 right-2 z-50 flex space-x-2">
            <Button variant="outline" size="icon" onClick={zoomIn} title="Zoom In">
                <ZoomInIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={zoomOut} title="Zoom Out">
                <ZoomOutIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={resetZoom} title="Reset Zoom">
                <RotateCcwIcon className="h-4 w-4" />
            </Button>
        </div>
      
      <div 
        className="p-6 flex flex-col md:flex-row justify-around items-start gap-8"
        style={{ 
            // This container might need to be large enough to allow its children to scale without being clipped by its own dimensions initially
            // Or ensure overflow is visible on a direct parent of the scaled items if ScrollArea doesn't handle it perfectly.
            // For simplicity, we let the children define their scaled size.
        }}
      >
          <div style={{ width: SCALED_CABINET_DETAIL_WIDTH_PX * scale, height: SCALED_TOTAL_VISUAL_HEIGHT_PX * scale, transition: 'width 0.1s ease-out, height 0.1s ease-out'}}>
            {renderFace("front")}
          </div>
          <div style={{ width: SCALED_CABINET_DETAIL_WIDTH_PX * scale, height: SCALED_TOTAL_VISUAL_HEIGHT_PX * scale, transition: 'width 0.1s ease-out, height 0.1s ease-out'}}>
            {renderFace("rear")}
          </div>
      </div>
    </ScrollArea>
  );
}
