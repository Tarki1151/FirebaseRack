
"use client";

import type { Cabinet } from "@/types";
import { MAX_U } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface CapacityIndicatorProps {
  cabinet: Cabinet;
}

export function CapacityIndicator({ cabinet }: CapacityIndicatorProps) {
  const totalUsedU = cabinet.devices.reduce((sum, device) => {
    // Ensure device fits within its declared startU and MAX_U
    if (device.startU < 1 || device.startU > MAX_U) return sum;
    const endU = device.startU + device.uSize -1;
    if (endU > MAX_U) {
        // count only the part that fits
        return sum + (MAX_U - device.startU + 1);
    }
    return sum + device.uSize;
  }, 0);
  
  const percentageUsed = (totalUsedU / MAX_U) * 100;
  const exceedsCapacity = totalUsedU > MAX_U;

  return (
    <div className="my-4 p-4 border rounded-lg shadow-sm bg-card">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Capacity</h3>
        <Badge variant={exceedsCapacity ? "destructive" : "secondary"}>
          {totalUsedU}U / {MAX_U}U
        </Badge>
      </div>
      <Progress value={Math.min(percentageUsed, 100)} className={exceedsCapacity ? "[&>*]:bg-destructive" : ""} />
      {exceedsCapacity && (
        <div className="mt-2 flex items-center text-destructive text-sm">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Warning: Cabinet capacity exceeded by {totalUsedU - MAX_U}U. Some devices may not be fully representable.
        </div>
      )}
       <p className="text-xs text-muted-foreground mt-1">
        Devices are counted based on their U size starting from their Rack U position. If a device partilly exceeds {MAX_U}U, only the portion within {MAX_U}U is counted.
      </p>
    </div>
  );
}
