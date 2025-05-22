// src/app/(app)/design/page.tsx

// import { DesignArea } from "@/components/design/design-area"; // No longer needed here
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import FileImporter from '@/components/file-importer'; // No longer needed here
import DesignPageClient from '@/components/design/design-page-client'; // Import the new Client Component

export default function DesignPage() {
  return (
    // Render the Client Component
    <DesignPageClient />
  );
}
