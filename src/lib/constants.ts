
export const CABINET_WIDTH_MM = 800;
export const CABINET_DEPTH_MM = 1000;
export const CABINET_HEIGHT_MM = 2000;
export const MAX_U = 42;
export const U_HEIGHT_MM = CABINET_HEIGHT_MM / MAX_U; // Approximately 47.619 mm

// For 2D visualization in pixels
export const CABINET_2D_WIDTH_PX = 150; // Arbitrary width for 2D representation
export const U_HEIGHT_PX = 12; // Height of one U in pixels for 2D representation
export const CABINET_2D_HEIGHT_PX = MAX_U * U_HEIGHT_PX;

// For Design page layout
export const DESIGN_GRID_CELL_SIZE_PX = 20; // Snap to grid
export const DESIGN_CABINET_WIDTH_PX = CABINET_WIDTH_MM / 10; // Scaled for top-down view
export const DESIGN_CABINET_DEPTH_PX = CABINET_DEPTH_MM / 10; // Scaled for top-down view

// Device Colors
export const DEVICE_COLOR_FRONT = "bg-sky-300"; // Light blue
export const DEVICE_COLOR_REAR = "bg-amber-300"; // Light orange
export const DEVICE_TEXT_COLOR = "text-slate-700";

export const MOCK_CABINET_DATA_FILE_NAME = "rack_data_example.xlsx";
