// src/app/(app)/design/3d/page.tsx
'use client';

import React, { Suspense, useState } from 'react';
import { useRackVision } from '@/store/rack-vision-store';
import { SingleCabinet3DView } from '@/components/cabinet-view/single-cabinet-3d-view';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function Design3DPage() {
  const { cabinets, isLoadingData } = useRackVision();
  const [selectedCabinetId, setSelectedCabinetId] = useState<string | null>(null);
  
  const selectedCabinet = cabinets.find(cabinet => cabinet.id === selectedCabinetId) || cabinets[0];

  if (isLoadingData && cabinets.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading 3D Scene...</p>
      </div>
    );
  }

  if (!selectedCabinet) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] p-4">
        <h1 className="text-2xl font-bold mb-4">No Cabinets Found</h1>
        <p className="text-muted-foreground mb-6">Please add a cabinet to view in 3D</p>
        <Link href="/design">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Design
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">3D Cabinet View</h1>
          <p className="text-muted-foreground">{selectedCabinet.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          {cabinets.length > 1 && (
            <select
              className="bg-background border rounded-md px-3 py-1 text-sm"
              value={selectedCabinetId || ''}
              onChange={(e) => setSelectedCabinetId(e.target.value || null)}
            >
              <option value="">Select a cabinet</option>
              {cabinets.map((cabinet) => (
                <option key={cabinet.id} value={cabinet.id}>
                  {cabinet.name}
                </option>
              ))}
            </select>
          )}
          <Link href="/design">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Design
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 relative">
        <SingleCabinet3DView cabinet={selectedCabinet} />
      </div>
    </div>
  );
}
