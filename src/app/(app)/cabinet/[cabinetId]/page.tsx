
"use client"; // Keep client component for router and context access

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRackVision } from "@/store/rack-vision-store";
import { CabinetVisualizer } from "@/components/cabinet-view/cabinet-visualizer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


export default function CabinetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cabinetId = params.cabinetId as string;
  
  const { cabinets, setActiveTab, isLoadingData, importedFileName } = useRackVision();

  useEffect(() => {
    if (cabinetId) {
      setActiveTab(cabinetId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cabinetId]);

  if (isLoadingData || !importedFileName) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  const cabinet = cabinets.find((c) => c.id === cabinetId);

  if (!cabinet) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-4">Cabinet Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The cabinet with ID "{cabinetId}" could not be found.
        </p>
        <Button onClick={() => router.push("/design")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Design Layout
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <CabinetVisualizer cabinet={cabinet} />
    </div>
  );
}
