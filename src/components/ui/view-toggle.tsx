
"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { ViewMode } from "@/store/rack-vision-store";
import { LayoutDashboard, View as CubeViewIcon } from "lucide-react"; // Using View for 3D Cube

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  const handleToggle = (checked: boolean) => {
    onViewModeChange(checked ? "3D" : "2D");
  };

  return (
    <div className="flex items-center space-x-2">
      <LayoutDashboard className={`h-5 w-5 ${viewMode === '2D' ? 'text-primary' : 'text-muted-foreground'}`} />
      <Switch
        id="view-mode-toggle"
        checked={viewMode === "3D"}
        onCheckedChange={handleToggle}
        aria-label={`Switch to ${viewMode === '2D' ? '3D' : '2D'} view`}
      />
      <CubeViewIcon className={`h-5 w-5 ${viewMode === '3D' ? 'text-primary' : 'text-muted-foreground'}`} />
      <Label htmlFor="view-mode-toggle" className="sr-only">
        Toggle 2D/3D View
      </Label>
    </div>
  );
}
