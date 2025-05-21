
"use client";

import type { Cabinet } from "@/types";
import { useRackVision } from "@/store/rack-vision-store";
import { Cabinet2D } from "./cabinet-2d";
import { Cabinet3D } from "./cabinet-3d";
import { CapacityIndicator } from "./capacity-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CabinetVisualizerProps {
  cabinet: Cabinet;
}

export function CabinetVisualizer({ cabinet }: CabinetVisualizerProps) {
  const { viewMode } = useRackVision();

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Cabinet: {cabinet.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CapacityIndicator cabinet={cabinet} />
        {viewMode === "2D" ? (
          <Cabinet2D cabinet={cabinet} />
        ) : (
          <Cabinet3D cabinet={cabinet} />
        )}
      </CardContent>
    </Card>
  );
}
