// src/components/design/design-area.tsx
'use client';

import React, { useRef, useState, useEffect } from "react";
import type { Cabinet } from "@/types";
import { useRackVision } from "@/store/rack-vision-store";
import { DraggableCabinetItem } from "./draggable-cabinet-item";
import {
  DESIGN_GRID_CELL_SIZE_PX,
  DESIGN_AREA_LOGICAL_CABINET_WIDTH_PX,
  DESIGN_AREA_LOGICAL_CABINET_HEIGHT_PX,
  VISUAL_SCALE,
} from "@/lib/constants";
import { Ruler } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const AREA_WIDTH = 2000;
const AREA_HEIGHT = 1500;

// Remove DesignAreaProps as cabinets will come from the store
// interface DesignAreaProps {
//   cabinets: Cabinet[];
// }

export function DesignArea(/*{ cabinets: cabinetsFromProp }: DesignAreaProps*/) {
  // Get cabinets directly from the store
  const { cabinets, updateCabinetPosition, isLoadingData } = useRackVision();
  
  // cabinetsToRender is now just an alias for cabinets from the store
  const cabinetsToRender = cabinets;
  
  const areaRef = useRef<HTMLDivElement>(null);
  const [overlappingCabinets, setOverlappingCabinets] = useState<Set<string>>(new Set());

  const checkOverlap = (cabinetA: Cabinet, cabinetB: Cabinet): boolean => {
    const posA_x = cabinetA.positionX;
    const posA_y = cabinetA.positionY;
    const posB_x = cabinetB.positionX;
    const posB_y = cabinetB.positionY;

    if (posA_x === undefined || posA_y === undefined || posB_x === undefined || posB_y === undefined) {
      return false;
    }

    const cabinetWidth = DESIGN_AREA_LOGICAL_CABINET_WIDTH_PX;
    const cabinetHeight = DESIGN_AREA_LOGICAL_CABINET_HEIGHT_PX;

    return (
      posA_x < posB_x + cabinetWidth &&
      posA_x + cabinetWidth > posB_x &&
      posA_y < posB_y + cabinetHeight &&
      posA_y + cabinetHeight > posB_y
    );
  };

  useEffect(() => {
    const newOverlapping = new Set<string>();
    // Ensure cabinetsToRender (which is cabinets from store) is not null/undefined before iterating
    if (cabinetsToRender) {
      for (let i = 0; i < cabinetsToRender.length; i++) {
        for (let j = i + 1; j < cabinetsToRender.length; j++) {
          if (checkOverlap(cabinetsToRender[i], cabinetsToRender[j])) {
            newOverlapping.add(cabinetsToRender[i].id);
            newOverlapping.add(cabinetsToRender[j].id);
          }
        }
      }
    }
    setOverlappingCabinets(newOverlapping);
  }, [cabinetsToRender]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!areaRef.current) return;

    const cabinetId = e.dataTransfer.getData("cabinetId");
    const offsetX = parseFloat(e.dataTransfer.getData("offsetX"));
    const offsetY = parseFloat(e.dataTransfer.getData("offsetY"));

    if (!cabinetId || isNaN(offsetX) || isNaN(offsetY)) {
      console.warn("Drop event missing data:", { cabinetId, offsetX, offsetY });
      return;
    }

    const areaRect = areaRef.current.getBoundingClientRect();
    let newX = e.clientX - areaRect.left - (offsetX * VISUAL_SCALE);
    let newY = e.clientY - areaRect.top - (offsetY * VISUAL_SCALE);

    newX = Math.round(newX / DESIGN_GRID_CELL_SIZE_PX) * DESIGN_GRID_CELL_SIZE_PX;
    newY = Math.round(newY / DESIGN_GRID_CELL_SIZE_PX) * DESIGN_GRID_CELL_SIZE_PX;

    const cabinetWidth = DESIGN_AREA_LOGICAL_CABINET_WIDTH_PX;
    const cabinetHeight = DESIGN_AREA_LOGICAL_CABINET_HEIGHT_PX;
    newX = Math.max(0, Math.min(newX, AREA_WIDTH - cabinetWidth));
    newY = Math.max(0, Math.min(newY, AREA_HEIGHT - cabinetHeight));
    
    console.log(`DesignArea: Dropping ${cabinetId} at X=${newX}, Y=${newY}`);
    updateCabinetPosition(cabinetId, newX, newY);
  };

  if (isLoadingData && cabinetsToRender.length === 0) { // Show loading only if no cabinets yet
     return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-15rem)] border rounded-lg bg-muted/30">
          <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"> 
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5424 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <p className="mt-4 text-lg text-muted-foreground">Loading Design Area...</p>
        </div>
    );
  }

  // Show empty state if not loading and no cabinets
  if (!isLoadingData && cabinetsToRender.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-15rem)] border rounded-lg bg-muted/30">
          <Ruler className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Design Area is Empty</h2>
          <p className="text-muted-foreground">Upload an Excel file to see cabinets and start designing your layout.</p>
        </div>
    );
  }

  return (
    <ScrollArea className="w-full h-[calc(100vh-15rem)] border rounded-lg shadow-lg bg-slate-50 dark:bg-slate-800/50 overflow-auto p-1">
      <div
        ref={areaRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative bg-grid-pattern"
        style={{
            width: AREA_WIDTH,
            height: AREA_HEIGHT,
            backgroundImage: `
                linear-gradient(to right, hsl(var(--border)/0.4) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)/0.4) 1px, transparent 1px)
            `,
            backgroundSize: `${DESIGN_GRID_CELL_SIZE_PX}px ${DESIGN_GRID_CELL_SIZE_PX}px`
        }}
      >
        {cabinetsToRender && cabinetsToRender.map((cabinet) => (
          <DraggableCabinetItem
            key={cabinet.id}
            cabinet={cabinet}
            isOverlapping={overlappingCabinets.has(cabinet.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
