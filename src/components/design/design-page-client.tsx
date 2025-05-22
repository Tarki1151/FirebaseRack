// src/components/design/design-page-client.tsx
'use client';

import React from 'react'; // Removed useState as cabinets state is now global
import { DesignArea } from "@/components/design/design-area";
import FileImporter from '@/components/file-importer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Cabinet } from '@/types'; // Only Cabinet type might be needed here for the callback
import { useRackVision } from '@/store/rack-vision-store'; // Import the store hook

const DesignPageClient: React.FC = () => {
  // Get state and setters from the global store
  const { setCabinets, setImportedFileName, setIsLoadingData } = useRackVision();

  const handleFileUploadSuccess = (parsedCabinets: Cabinet[]) => {
    console.log("DesignPageClient: File upload successful, updating GLOBAL cabinets state via store.");
    // Update the global store with the new cabinets from the file
    setCabinets(parsedCabinets);
    // Optionally, update other relevant global states
    // For example, if selectedFile has a name property:
    // setImportedFileName(selectedFile.name); // This needs selectedFile to be passed or handled differently
    setImportedFileName("User Uploaded File"); // Placeholder name
    setIsLoadingData(false); // Data is now loaded from the file
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Server Room Layout Designer</CardTitle>
          <CardDescription>
            Drag and drop cabinets to arrange your server room layout. Double-click a cabinet to view its details.
            Cabinets will snap to a {process.env.NEXT_PUBLIC_DESIGN_GRID_CELL_SIZE_PX || 20}px grid.
            Red borders indicate overlapping cabinets.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <FileImporter onFileUploadSuccess={handleFileUploadSuccess} />
           {/* DesignArea will now get its cabinets directly from the useRackVision hook */}
           <DesignArea />
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignPageClient;
