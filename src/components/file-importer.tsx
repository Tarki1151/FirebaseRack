// src/components/file-importer.tsx
'use client';

import React, { ChangeEvent, useState } from 'react';
import * as XLSX from 'xlsx';
import type { Cabinet, Device } from '@/types';
import {
  SCALED_CABINET_DETAIL_WIDTH_PX,
  SCALED_TOTAL_VISUAL_HEIGHT_PX,
  DEFAULT_CABINET_START_X,
  DEFAULT_CABINET_START_Y,
  DEFAULT_ADJACENT_CABINET_SPACING_PX,
  DEFAULT_CORRIDOR_SPACING_PX,
  DEFAULT_CABINETS_PER_ROW,
  MAX_U, // Import MAX_U for validation
} from '@/lib/constants';

interface FileImporterProps {
  onFileUploadSuccess: (cabinets: Cabinet[]) => void;
}

const FileImporter: React.FC<FileImporterProps> = ({ onFileUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setError(null);
    } else {
      setSelectedFile(null);
    }
    event.target.value = '';
  };

  const handleProcessClick = () => {
    if (!selectedFile) {
      setError("No file selected to process.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    console.log("--- Starting File Processing ---");

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        try {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          console.log("Workbook loaded. Detected sheet names:", workbook.SheetNames);

          const cabinetsData: Cabinet[] = [];
          const parsedLocationMap: { [key: string]: { x: number; y: number; name: string } } = {};
          const allCabinetSheetNames: string[] = [];

          const locationSheetName = "Location";
          console.log(`Looking for "${locationSheetName}" sheet...`);

          if (workbook.SheetNames.includes(locationSheetName)) {
            const locationWorksheet = workbook.Sheets[locationSheetName];
            const locationRows = XLSX.utils.sheet_to_json(locationWorksheet, { header: 1 }) as string[][];
            console.log(`Found "${locationSheetName}" sheet. Header row:`, locationRows[0]);

            if (locationRows.length > 1) {
              const headers = locationRows[0];
              const corridorColumnHeader = "Corridor";
              const corridorColumnIndex = headers.findIndex(h => h && h.trim().toLowerCase() === corridorColumnHeader.trim().toLowerCase());

              if (corridorColumnIndex === -1) {
                console.warn(`"${corridorColumnHeader}" column not found in "${locationSheetName}" sheet. Cannot process corridor layout.`);
              } else {
                console.log(`"${corridorColumnHeader}" column found at index ${corridorColumnIndex}.`);
                let currentCorridorY = DEFAULT_CABINET_START_Y;

                for (let i = 1; i < locationRows.length; i++) {
                  const row = locationRows[i];
                  const corridorName = row[corridorColumnIndex];
                  console.log(`Processing Corridor "${corridorName}" (Excel row ${i + 1})`);
                  let currentCabinetX = DEFAULT_CABINET_START_X;
                  let cabinetsInThisCorridor = 0;

                  for (let j = 0; j < headers.length; j++) {
                    if (j === corridorColumnIndex) continue;

                    const cabinetIdCellValue = row[j];
                    if (cabinetIdCellValue && String(cabinetIdCellValue).trim() !== "") {
                      const idStr = String(cabinetIdCellValue).trim();
                      console.log(`  Found CabinetID "${idStr}" in Corridor "${corridorName}" at slot/column "${headers[j]}"`);
                      parsedLocationMap[idStr] = {
                        x: currentCabinetX,
                        y: currentCorridorY,
                        name: idStr 
                      };
                      currentCabinetX += SCALED_CABINET_DETAIL_WIDTH_PX + DEFAULT_ADJACENT_CABINET_SPACING_PX;
                      cabinetsInThisCorridor++;
                    }
                  }
                  if (cabinetsInThisCorridor > 0) {
                    currentCorridorY += SCALED_TOTAL_VISUAL_HEIGHT_PX + DEFAULT_CORRIDOR_SPACING_PX; 
                  }
                }
              }
            }
            console.log("Final Parsed Location Map (from Corridor layout):", parsedLocationMap);
          } else {
            console.warn(`Warning: "${locationSheetName}" sheet not found. All cabinets will be placed sequentially by default.`);
          }

          workbook.SheetNames.forEach(sheetName => {
            if (sheetName.toLowerCase() !== locationSheetName.toLowerCase()) {
                allCabinetSheetNames.push(sheetName);
            }
          });
          console.log("Cabinet sheets to process (excluding Location):", allCabinetSheetNames);

          let defaultPlacedCount = 0;
          allCabinetSheetNames.forEach(sheetName => {
            const cabinetId = sheetName;
            console.log(`--- Processing Cabinet Sheet: "${cabinetId}" ---`);
            const cabinetWorksheet = workbook.Sheets[sheetName];
            if (!cabinetWorksheet) {
                console.warn(`Sheet "${cabinetId}" could not be found.`);
                return;
            }

            const deviceData = XLSX.utils.sheet_to_json(cabinetWorksheet) as any[];
            console.log(`Raw JSON for devices in "${cabinetId}" (first 3):`, deviceData.slice(0,3));

            const devices: Device[] = deviceData.map((row: any, index: number) => {
              const startU = Number(row.Rack);
              const uSize = Number(row.U);
              const rawFaceValue = String(row.Face || '').trim().toLowerCase();
              const face: 'front' | 'rear' = (rawFaceValue === 'arka' || rawFaceValue === 'back') ? 'rear' : 'front';
              const brandModel = String(row.BrandModel || row['Brand/model'] || row.Brand_model || 'Unknown Device');

              console.log(`  Device row in "${cabinetId}": Rack=${row.Rack}, RawFace='${row.Face}', ParsedFace='${face}', U=${row.U}, BrandModel(Excel)='${row.BrandModel}', ParsedBrandModel='${brandModel}'`);

              // Validation: Check for NaN, startU out of 1-MAX_U physical bounds, uSize < 1.
              // The check for (startU + uSize - 1) > MAX_U (oversized) is handled by Device2D now.
              if (isNaN(startU) || isNaN(uSize) || startU < 1 || startU > MAX_U || uSize < 1 || !brandModel || (brandModel === "Unknown Device" && !row.BrandModel && !row['Brand/model'] && !row.Brand_model) ) {
                  console.warn(`  Skipping invalid device in "${cabinetId}" (fails basic validation - e.g. starts outside MAX_U, zero U-size, or no model):`, 
                               {excelRow: row, parsedStartU: startU, parsedUSize: uSize, parsedBrandModel: brandModel });
                  return null;
              }
              // Log if a device *would* be oversized, but still include it for Device2D to handle.
              if (startU + uSize - 1 > MAX_U) {
                console.log(`    Device "${brandModel}" in "${cabinetId}" is oversized (starts at ${startU}, size ${uSize}U). Will be capped by renderer.`);
              }

              const deviceId = `${cabinetId}-U${startU}-${face}-${brandModel.replace(/\s+/g, '')}-${index}`;
              console.log(`    Created device: ID=${deviceId}, startU=${startU}, uSize=${uSize}, face=${face}, model=${brandModel}`);
              return { id: deviceId, startU, face, uSize, brandModel };
            }).filter((device): device is Device => device !== null);
            console.log(`Finished processing devices for "${cabinetId}". Found ${devices.length} valid devices.`);

            let positionX: number;
            let positionY: number;
            let cabinetName: string;

            if (parsedLocationMap[cabinetId]) {
              positionX = parsedLocationMap[cabinetId].x;
              positionY = parsedLocationMap[cabinetId].y;
              cabinetName = parsedLocationMap[cabinetId].name;
            } else {
              const rowIndex = Math.floor(defaultPlacedCount / DEFAULT_CABINETS_PER_ROW);
              const colIndex = defaultPlacedCount % DEFAULT_CABINETS_PER_ROW;
              positionX = DEFAULT_CABINET_START_X + colIndex * (SCALED_CABINET_DETAIL_WIDTH_PX + DEFAULT_ADJACENT_CABINET_SPACING_PX);
              positionY = DEFAULT_CABINET_START_Y + rowIndex * (SCALED_TOTAL_VISUAL_HEIGHT_PX + DEFAULT_CORRIDOR_SPACING_PX * 2);
              cabinetName = cabinetId;
              defaultPlacedCount++;
              console.log(`Cabinet "${cabinetId}" (Name: "${cabinetName}") NOT in Location. Default Pos: X=${positionX}, Y=${positionY}`);
            }

            cabinetsData.push({
              id: cabinetId,
              name: cabinetName,
              devices: devices,
              positionX: positionX,
              positionY: positionY,
            });
          });

          console.log("--- Successfully Parsed All Cabinets ---:", JSON.parse(JSON.stringify(cabinetsData))); // Deep log
          onFileUploadSuccess(cabinetsData);

        } catch (error: any) {
          console.error("--- Error During File Processing ---:", error);
          setError(`Error processing file: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
          setIsProcessing(false);
          setSelectedFile(null);
          console.log("--- File Processing Finished ---");
        }
      }
    };
    reader.onerror = (errorEvent) => {
      console.error("Error reading file:", errorEvent);
      setError(`Error reading file object: ${selectedFile?.name}. Type: ${errorEvent.type}`);
      setIsProcessing(false);
      setSelectedFile(null);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <label htmlFor="file-upload" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 cursor-pointer">
          Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="sr-only"
        />
        {selectedFile && (
          <span className="text-sm text-muted-foreground flex-grow truncate">{selectedFile.name}</span>
        )}
        <button
          onClick={handleProcessClick}
          disabled={!selectedFile || isProcessing}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2"
        >
          {isProcessing ? 'Processing...' : 'Process File'}
        </button>
      </div>
      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}
    </div>
  );
};

export default FileImporter;
