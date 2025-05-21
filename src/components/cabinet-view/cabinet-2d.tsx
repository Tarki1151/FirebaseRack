
import type { Cabinet } from "@/types";
import { CABINET_2D_WIDTH_PX, CABINET_2D_HEIGHT_PX, U_HEIGHT_PX, MAX_U } from "@/lib/constants";
import { Device2D } from "./device-2d";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Cabinet2DProps {
  cabinet: Cabinet;
}

export function Cabinet2D({ cabinet }: Cabinet2DProps) {
  return (
    <ScrollArea className="w-full h-[calc(100vh-20rem)] border rounded-md shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">{cabinet.name} - 2D View (Front/Rear)</h2>
        <div className="flex justify-around gap-4">
          {/* Front View */}
          <div className="relative bg-slate-200 border border-slate-300" style={{ width: CABINET_2D_WIDTH_PX, height: CABINET_2D_HEIGHT_PX }}>
            <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground select-none">
              {[...Array(MAX_U)].map((_, i) => (
                (i + 1) % 5 === 0 || i === 0 || i === MAX_U -1 ? <span key={`front-u-${i+1}`} style={{height: U_HEIGHT_PX}} className="flex items-center">{i+1}</span> : <span key={`front-u-${i+1}`} style={{height: U_HEIGHT_PX}} className="flex items-center">&nbsp;</span>
              ))}
            </div>
            {cabinet.devices
              .filter((device) => device.face === "front")
              .map((device) => (
                <Device2D key={device.id} device={device} cabinetWidth={CABINET_2D_WIDTH_PX} />
              ))}
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 text-4xl font-bold select-none opacity-50 transform rotate-90">FRONT</span>
          </div>

          {/* Rear View */}
          <div className="relative bg-slate-200 border border-slate-300" style={{ width: CABINET_2D_WIDTH_PX, height: CABINET_2D_HEIGHT_PX }}>
             <div className="absolute -right-6 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground select-none items-end">
              {[...Array(MAX_U)].map((_, i) => (
                (i + 1) % 5 === 0 || i === 0 || i === MAX_U -1 ? <span key={`rear-u-${i+1}`} style={{height: U_HEIGHT_PX}} className="flex items-center">{i+1}</span> : <span key={`rear-u-${i+1}`} style={{height: U_HEIGHT_PX}} className="flex items-center">&nbsp;</span>
              ))}
            </div>
            {cabinet.devices
              .filter((device) => device.face === "rear")
              .map((device) => (
                <Device2D key={device.id} device={device} cabinetWidth={CABINET_2D_WIDTH_PX} />
              ))}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 text-4xl font-bold select-none opacity-50 transform rotate-90">REAR</span>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
