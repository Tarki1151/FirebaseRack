// src/components/design/design-page-client.tsx
'use client';

import React, { useState } from 'react';
import { DesignArea } from "@/components/design/design-area";
import { Design3DLayout } from "@/components/cabinet-view/design-3d-layout";
import { ViewToggle } from "@/components/ui/view-toggle";
import FileImporter from '@/components/file-importer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRackVision } from '@/store/rack-vision-store';
import type { Cabinet } from '@/types';

const DesignPageClient: React.FC = () => {
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const { cabinets, setCabinets, setImportedFileName, setIsLoadingData } = useRackVision();

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
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Server Room Layout Designer</CardTitle>
            <ViewToggle 
              viewMode={viewMode} 
              onViewModeChange={setViewMode} 
            />
          </div>
          <CardDescription>
            {viewMode === '2D' 
              ? 'Drag and drop cabinets to arrange your server room layout. Double-click a cabinet to view its details.'
              : '3D view of your server room layout. Use mouse to rotate, scroll to zoom, and right-click to pan.'}
            {viewMode === '2D' && (
              <span> Cabinets will snap to a {process.env.NEXT_PUBLIC_DESIGN_GRID_CELL_SIZE_PX || 20}px grid. Red borders indicate overlapping cabinets.</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <FileImporter onFileUploadSuccess={handleFileUploadSuccess} />
          
          {cabinets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <p className="text-muted-foreground mb-4">
                No cabinets found. Import a file to get started.
              </p>
              <FileImporter onFileUploadSuccess={handleFileUploadSuccess}>
                <Button variant="outline">Import File</Button>
              </FileImporter>
            </div>
          ) : viewMode === '2D' ? (
            <DesignArea />
          ) : (
            <div className="h-[600px] w-full">
              <Design3DLayout cabinets={cabinets} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignPageClient;
