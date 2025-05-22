
"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { Cabinet, Device, LocationData, CabinetSheetDeviceData } from "@/types";
import { MOCK_CABINET_DATA_FILE_NAME } from "@/lib/constants";

export type ViewMode = "2D" | "3D";

interface RackVisionContextType {
  cabinets: Cabinet[];
  setCabinets: React.Dispatch<React.SetStateAction<Cabinet[]>>;
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  activeTab: string; // 'design' or cabinetId
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  importedFileName: string | null;
  setImportedFileName: React.Dispatch<React.SetStateAction<string | null>>;
  isLoadingData: boolean;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  loadMockData: () => void; // Keep for manual loading if needed, but not auto
  clearAllCabinetData: () => void;
  updateCabinetPosition: (cabinetId: string, x: number, y: number) => void;
}

const RackVisionContext = createContext<RackVisionContextType | undefined>(undefined);

// Mock data - simulating parsed Excel data
const mockLocationData: LocationData[] = [
  { cabinetId: "cab1", name: "Cabinet Alpha", x: 50, y: 50 },
  { cabinetId: "cab2", name: "Cabinet Bravo", x: 200, y: 50 },
  { cabinetId: "cab3", name: "Cabinet Charlie", x: 50, y: 250 },
];

const mockCabinetSheetData: Record<string, CabinetSheetDeviceData[]> = {
  "Cabinet Alpha": [
    { Rack: 1, Face: "front", U: 2, "Brand/model": "Server X1" },
    { Rack: 3, Face: "front", U: 1, "Brand/model": "Patch Panel" },
    { Rack: 5, Face: "arka", U: 4, "Brand/model": "Storage Array Z" },
    { Rack: 40, Face: "front", U: 3, "Brand/model": "UPS Unit" },
  ],
  "Cabinet Bravo": [
    { Rack: 10, Face: "front", U: 2, "Brand/model": "Firewall G" },
    { Rack: 12, Face: "back", U: 1, "Brand/model": "Switch S1" },
    { Rack: 20, Face: "front", U: 3, "Brand/model": "Server Y2" },
  ],
  "Cabinet Charlie": Array.from({ length: 15 }, (_, i) => ({
    Rack: 1 + i * 3, Face: i % 2 === 0 ? "front" : "arka", U: 2, "Brand/model": `Device ${i + 1}`
  })),
};

function parseMockData(): Cabinet[] {
  return mockLocationData.map((loc) => {
    const devicesData = mockCabinetSheetData[loc.name] || [];
    const devices: Device[] = devicesData.map((d, index) => ({
      id: `${loc.cabinetId}-dev-${index}`,
      startU: d.Rack,
      face: d.Face.toLowerCase() === "arka" || d.Face.toLowerCase() === "back" ? "rear" : "front",
      uSize: d.U,
      brandModel: d["Brand/model"],
    }));
    return {
      id: loc.cabinetId,
      name: loc.name,
      devices,
      positionX: loc.x,
      positionY: loc.y,
    };
  });
}

export function RackVisionProvider({ children }: { children: ReactNode }) {
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("2D");
  const [activeTab, setActiveTab] = useState<string>("design");
  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  // Start isLoadingData as false. It will be set to true during actual loading operations.
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false); 

  // Function to explicitly load mock data if needed (e.g., by a button)
  const loadMockData = () => {
    console.log("Store: Loading mock data...");
    setIsLoadingData(true);
    setTimeout(() => {
      const parsedCabinets = parseMockData();
      setCabinets(parsedCabinets);
      setImportedFileName(MOCK_CABINET_DATA_FILE_NAME);
      setActiveTab("design"); 
      setIsLoadingData(false);
      console.log("Store: Mock data loaded.", parsedCabinets);
    }, 500);
  };
  
  // Remove automatic mock data loading on initial mount
  // useEffect(() => {
  //   // Only load mock data if no user file has been imported and no cabinets exist
  //   if (!importedFileName && cabinets.length === 0) {
  //      loadMockData();
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // Run once on mount, or if cabinets/importedFileName change to re-evaluate

  const clearAllCabinetData = () => {
    console.log("Store: Clearing all cabinet data and imported file name.");
    setCabinets([]);
    setImportedFileName(null);
    setActiveTab("design"); // Reset to design tab
    // setIsLoadingData(false); // Already false or will be set by new load
  };


  const updateCabinetPosition = (cabinetId: string, x: number, y: number) => {
    console.log(`Store: updateCabinetPosition called for ${cabinetId} to X=${x}, Y=${y}`);
    setCabinets(prevCabinets => {
      const updatedCabinets = prevCabinets.map(cab =>
        cab.id === cabinetId ? { ...cab, positionX: x, positionY: y } : cab
      );
      const targetCabinet = updatedCabinets.find(c => c.id === cabinetId);
      console.log(`Store: Cabinet ${cabinetId} new state in updatedCabinets:`, targetCabinet);
      return updatedCabinets;
    });
  };

  return (
    <RackVisionContext.Provider
      value={{
        cabinets,
        setCabinets,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        importedFileName,
        setImportedFileName,
        isLoadingData,
        setIsLoadingData,
        loadMockData, // Exposed for manual loading
        clearAllCabinetData,
        updateCabinetPosition,
      }}
    >
      {children}
    </RackVisionContext.Provider>
  );
}

export function useRackVision() {
  const context = useContext(RackVisionContext);
  if (context === undefined) {
    throw new Error("useRackVision must be used within a RackVisionProvider");
  }
  return context;
}
