
export interface Device {
  id: string;
  startU: number; // Starting U position
  face: "front" | "rear";
  uSize: number; // Size in U
  brandModel: string;
}

export interface Cabinet {
  id: string;
  name: string;
  devices: Device[];
  positionX?: number; // X coordinate on the design layout
  positionY?: number; // Y coordinate on the design layout
}

// Represents the structure of data parsed from the "Location" sheet (or equivalent)
export interface LocationData {
  cabinetId: string;
  name: string; // Cabinet Name like "C01" or "Cabinet Alpha"
  x: number; // initial X position in the room layout
  y: number; // initial Y position in the room layout
}

// Represents the structure of data parsed from individual cabinet sheets
export interface CabinetSheetDeviceData {
  // From Excel: "Rack" (starting U), "Face" ("arka" or "back" for rear, else front), "U" (U size), "Brand/model"
  Rack: number; // starting U
  Face: string; // "arka", "back", or other (implies front)
  U: number; // U size
  "Brand/model": string;
}
