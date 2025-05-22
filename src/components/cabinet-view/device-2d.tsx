
import type { Device } from "@/types";
import { SCALED_U_HEIGHT_PX as U_HEIGHT_PX, DEVICE_COLOR_FRONT_BG as DEVICE_COLOR_FRONT, DEVICE_COLOR_REAR_BG as DEVICE_COLOR_REAR, DEVICE_TEXT_COLOR, MAX_U } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Device2DProps {
  device: Device;
  cabinetWidth: number; // width of the cabinet representation in px
}

export function Device2D({ device, cabinetWidth }: Device2DProps) {
  if (device.startU < 1 || device.startU > MAX_U) {
    return null; // Device is outside valid U range
  }
  
  const deviceHeight = device.uSize * U_HEIGHT_PX;
  // Calculate top position, 1-based U from top
  const topPosition = (device.startU - 1) * U_HEIGHT_PX;

  // Adjust height if device exceeds MAX_U
  let displayHeight = deviceHeight;
  if (device.startU + device.uSize -1 > MAX_U) {
    displayHeight = (MAX_U - device.startU + 1) * U_HEIGHT_PX;
    if (displayHeight <=0) return null; // Device fully outside MAX_U
  }


  const bgColor = device.face === "front" ? DEVICE_COLOR_FRONT : DEVICE_COLOR_REAR;

  return (
    <div
      className={cn(
        "absolute left-0 right-0 flex items-center justify-center border border-slate-400 shadow-sm",
        bgColor,
        DEVICE_TEXT_COLOR
      )}
      style={{
        top: `${topPosition}px`,
        height: `${displayHeight}px`,
        width: `${cabinetWidth}px`,
      }}
      title={`${device.brandModel} (${device.uSize}U, ${device.face})`}
    >
      <span className="text-xs px-1 truncate select-none">
        {device.brandModel}
      </span>
    </div>
  );
}
