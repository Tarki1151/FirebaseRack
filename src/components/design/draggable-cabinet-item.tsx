
"use client";
import type { Cabinet } from "@/types";
import { DESIGN_CABINET_WIDTH_PX, DESIGN_CABINET_DEPTH_PX, MAX_U } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useRackVision } from "@/store/rack-vision-store";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface DraggableCabinetItemProps {
  cabinet: Cabinet;
  isOverlapping: boolean;
}

export function DraggableCabinetItem({ cabinet, isOverlapping }: DraggableCabinetItemProps) {
  const router = useRouter();
  const { setActiveTab } = useRackVision();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("cabinetId", cabinet.id);
    e.dataTransfer.setData("offsetX", e.nativeEvent.offsetX.toString());
    e.dataTransfer.setData("offsetY", e.nativeEvent.offsetY.toString());
  };

  const handleDoubleClick = () => {
    setActiveTab(cabinet.id);
    router.push(`/cabinet/${cabinet.id}`);
  };

  const totalUsedU = cabinet.devices.reduce((sum, device) => {
    if (device.startU < 1 || device.startU > MAX_U) return sum;
    const endU = device.startU + device.uSize - 1;
    if (endU > MAX_U) return sum + (MAX_U - device.startU + 1);
    return sum + device.uSize;
  }, 0);
  const exceedsCapacity = totalUsedU > MAX_U;


  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDoubleClick={handleDoubleClick}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        left: cabinet.positionX ?? 0,
        top: cabinet.positionY ?? 0,
        width: DESIGN_CABINET_WIDTH_PX,
        height: DESIGN_CABINET_DEPTH_PX,
      }}
      title={`Drag to move. Double click to view details for ${cabinet.name}.`}
    >
      <Card
        className={`w-full h-full flex flex-col items-center justify-center transition-all duration-150 ease-in-out hover:shadow-lg ${
          isOverlapping ? "ring-2 ring-destructive ring-offset-2" : "ring-1 ring-transparent hover:ring-primary"
        } ${exceedsCapacity ? "bg-red-100 dark:bg-red-900/30 border-destructive" : "bg-card"}`}
      >
        <CardHeader className="p-1 text-center">
          <CardTitle className="text-xs font-medium truncate">
            {cabinet.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-1 text-xs text-muted-foreground flex items-center justify-center">
           {exceedsCapacity ? (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
          <span className="ml-1">{totalUsedU}U/{MAX_U}U</span>
        </CardContent>
      </Card>
    </div>
  );
}
