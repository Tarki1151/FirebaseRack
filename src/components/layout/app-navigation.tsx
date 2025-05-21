
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRackVision } from "@/store/rack-vision-store";
import { ViewToggle } from "@/components/ui/view-toggle";
import { useRouter } from "next/navigation";
import DataImporter from "@/components/data-importer";

export function AppNavigation() {
  const { cabinets, activeTab, setActiveTab, viewMode, setViewMode, importedFileName } = useRackVision();
  const router = useRouter();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "design") {
      router.push("/design");
    } else {
      router.push(`/cabinet/${value}`);
    }
  };

  return (
    <div className="sticky top-16 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-x-auto">
          {importedFileName && (
            <Tabs value={activeTab} onValueChange={handleTabChange} className="whitespace-nowrap">
              <TabsList>
                <TabsTrigger value="design">Design Layout</TabsTrigger>
                {cabinets.map((cabinet) => (
                  <TabsTrigger key={cabinet.id} value={cabinet.id}>
                    {cabinet.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
           <DataImporter />
        </div>
        {activeTab !== "design" && importedFileName && (
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        )}
      </div>
    </div>
  );
}
