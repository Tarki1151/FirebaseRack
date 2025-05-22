
"use client";

import { useEffect, useState } from "react"; // Added useState
import { useParams, useRouter } from "next/navigation";
import { useRackVision } from "@/store/rack-vision-store";
// import { CabinetVisualizer } from "@/components/cabinet-view/cabinet-visualizer"; // Remove this
import { Cabinet2D } from "@/components/cabinet-view/cabinet-2d"; // Import Cabinet2D
import { SingleCabinet3DView } from "@/components/cabinet-view/single-cabinet-3d-view"; // Import SingleCabinet3DView
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { Label } from "@/components/ui/label"; // Import Label
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CabinetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cabinetId = params.cabinetId as string;
  
  const { cabinets, setActiveTab, isLoadingData, importedFileName } = useRackVision();
  const [showLocal3D, setShowLocal3D] = useState(false); // Local state for 2D/3D toggle

  useEffect(() => {
    if (cabinetId) {
      setActiveTab(cabinetId);
    }
  }, [cabinetId, setActiveTab]); // Added setActiveTab to dependency array

  // This effect might be needed if you want the global viewMode to influence the initial local state
  // For now, the local checkbox will control it independently on this page.
  // useEffect(() => {
  //   if (viewMode === '3D') setShowLocal3D(true);
  //   else setShowLocal3D(false);
  // }, [viewMode]);

  if (isLoadingData && cabinets.length === 0 && !importedFileName) { // Adjusted loading condition
    return (
      <div className="space-y-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-8 w-24" /> {/* Placeholder for back button */}
        </div>
        <Skeleton className="h-96 w-full" /> {/* Placeholder for 2D/3D view area */}
      </div>
    );
  }
  
  const cabinet = cabinets.find((c) => c.id === cabinetId);

  if (!cabinet) {
    return (
      <div className="text-center py-10">
        <div className="flex items-center justify-start p-4">
            <Button variant="outline" onClick={() => router.push("/design")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Design
            </Button>
        </div>
        <h1 className="text-2xl font-semibold mb-4">Cabinet Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The cabinet with ID "{cabinetId}" could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 space-y-4">
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push("/design")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Design Layout
            </Button>
            <div className="flex items-center space-x-2">
                <Checkbox 
                    id="local-3d-toggle"
                    checked={showLocal3D}
                    onCheckedChange={(checkedState) => setShowLocal3D(Boolean(checkedState))}
                />
                <Label htmlFor="local-3d-toggle" className="text-sm font-medium">
                    Show 3D View
                </Label>
            </div>
        </div>
      
      {showLocal3D ? (
        <SingleCabinet3DView cabinet={cabinet} />
      ) : (
        <Cabinet2D cabinet={cabinet} />
      )}
    </div>
  );
}
