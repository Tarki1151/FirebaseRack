
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
  isLoadingData: boolean;
  loadMockData: () => void;
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
    { Rack: 40, Face: "front", U: 3, "Brand/model": "UPS Unit" }, // Exceeds 42U if Rack is 1-based
  ],
  "Cabinet Bravo": [
    { Rack: 10, Face: "front", U: 2, "Brand/model": "Firewall G" },
    { Rack: 12, Face: "back", U: 1, "Brand/model": "Switch S1" },
    { Rack: 20, Face: "front", U: 3, "Brand/model": "Server Y2" },
  ],
  "Cabinet Charlie": Array.from({ length: 15 }, (_, i) => ({ // To test capacity alerts
    Rack: 1 + i * 3, Face: i % 2 === 0 ? "front" : "arka", U: 2, "Brand/model": `Device ${i + 1}`
  })), // This will exceed 42U
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
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  const loadMockData = () => {
    setIsLoadingData(true);
    // Simulate async data loading
    setTimeout(() => {
      const parsedCabinets = parseMockData();
      setCabinets(parsedCabinets);
      setImportedFileName(MOCK_CABINET_DATA_FILE_NAME);
      setActiveTab("design"); // Reset to design tab after loading
      setIsLoadingData(false);
    }, 500);
  };
  
  // Load mock data on initial mount for demo purposes
  useEffect(() => {
    loadMockData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const updateCabinetPosition = (cabinetId: string, x: number, y: number) => {
    setCabinets(prevCabinets =>
      prevCabinets.map(cab =>
        cab.id === cabinetId ? { ...cab, positionX: x, positionY: y } : cab
      )
    );
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
        isLoadingData,
        loadMockData,
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
