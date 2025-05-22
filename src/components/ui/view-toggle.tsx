'use client';

import { LayoutDashboard, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ViewToggleProps {
  viewMode: '2D' | '3D';
  onViewModeChange: (mode: '2D' | '3D') => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-1 bg-muted p-1 rounded-md">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewMode === '2D' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onViewModeChange('2D')}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="sr-only">2D View</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>2D View</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewMode === '3D' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onViewModeChange('3D')}
          >
            <Box className="h-4 w-4" />
            <span className="sr-only">3D View</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>3D View</TooltipContent>
      </Tooltip>
    </div>
  );
}
