'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function TemplateDownloadButton() {
  const handleDownload = () => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = '/templates/input_template_new.xlsx';
    link.download = 'rack_vision_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      onClick={handleDownload}
      variant="outline"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Şablonu İndir
    </Button>
  );
}
