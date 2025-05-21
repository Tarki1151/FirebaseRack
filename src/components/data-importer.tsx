
"use client";

import { Button } from "@/components/ui/button";
import { useRackVision } from "@/store/rack-vision-store";
import { UploadCloud, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_CABINET_DATA_FILE_NAME } from "@/lib/constants";


export default function DataImporter() {
  const { loadMockData, importedFileName, isLoadingData } = useRackVision();
  const { toast } = useToast();

  const handleImport = () => {
    // In a real app, this would open a file dialog and process the file.
    // For now, it just loads mock data.
    loadMockData();
    toast({
      title: "Data Loaded",
      description: `${MOCK_CABINET_DATA_FILE_NAME} (mock) has been loaded.`,
    });
  };

  return (
    <div className="flex items-center gap-2">
      {importedFileName ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border rounded-md">
          <FileText className="h-4 w-4" />
          <span>{importedFileName}</span>
        </div>
      ) : (
        <Button onClick={handleImport} disabled={isLoadingData} variant="outline">
          <UploadCloud className="mr-2 h-4 w-4" />
          {isLoadingData ? "Loading Data..." : "Load Rack Data (Mock)"}
        </Button>
      )}
    </div>
  );
}
