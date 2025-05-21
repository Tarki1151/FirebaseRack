
import { DesignArea } from "@/components/design/design-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DesignPage() {
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
           <DesignArea />
        </CardContent>
      </Card>
    </div>
  );
}
