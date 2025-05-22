
export const CABINET_WIDTH_MM = 800;
export const CABINET_DEPTH_MM = 1000;
export const CABINET_HEIGHT_MM = 2000;
export const MAX_U = 42; // Number of usable U slots
export const U_HEIGHT_MM = CABINET_HEIGHT_MM / MAX_U; // Approximately 47.619 mm

// Visual Scale for Cabinet Items on Design Page AND 3D VIEW
export const VISUAL_SCALE = 0.5; // 50% scaling for 2D detailed items, might need adjustment for 3D world units
export const WORLD_SCALE = 0.01; // Example: 1px in 2D design might be 0.01 world units in 3D for cabinet positions
                                // Or, use a direct mapping: 100px in 2D layout = 1 unit in 3D world

// Base dimensions for 2D visualization (before scaling for DraggableCabinetItem)
export const BASE_U_HEIGHT_PX = 12; 
export const BASE_CABINET_VERTICAL_PADDING_U = 1; 
export const BASE_CABINET_SIDE_PADDING_PX = 10; 
export const BASE_CABINET_DETAIL_WIDTH_PX = 200; 

// SCALED dimensions for 2D DraggableCabinetItem and Cabinet2D
export const SCALED_U_HEIGHT_PX = BASE_U_HEIGHT_PX * VISUAL_SCALE;
export const SCALED_CABINET_VERTICAL_PADDING_PX = BASE_CABINET_VERTICAL_PADDING_U * BASE_U_HEIGHT_PX * VISUAL_SCALE; 
export const SCALED_CABINET_SIDE_PADDING_PX = BASE_CABINET_SIDE_PADDING_PX * VISUAL_SCALE;
export const SCALED_CABINET_DETAIL_WIDTH_PX = BASE_CABINET_DETAIL_WIDTH_PX * VISUAL_SCALE;
export const SCALED_USABLE_HEIGHT_PX = MAX_U * BASE_U_HEIGHT_PX * VISUAL_SCALE; 
export const SCALED_TOTAL_VISUAL_HEIGHT_PX = (MAX_U * BASE_U_HEIGHT_PX + 2 * BASE_CABINET_VERTICAL_PADDING_U * BASE_U_HEIGHT_PX) * VISUAL_SCALE;

// --- Dimensions for 3D View (using real-world mm, then scaled for the scene) ---
const SCENE_SCALE_FACTOR = 0.001; // 1mm = 0.001 units in 3D scene (e.g., meters)
export const CABINET_3D_WIDTH = CABINET_WIDTH_MM * SCENE_SCALE_FACTOR;
export const CABINET_3D_HEIGHT = CABINET_HEIGHT_MM * SCENE_SCALE_FACTOR;
export const CABINET_3D_DEPTH = CABINET_DEPTH_MM * SCENE_SCALE_FACTOR;
export const U_3D_HEIGHT = U_HEIGHT_MM * SCENE_SCALE_FACTOR;
// export const DEVICE_3D_DEPTH_FRONT = CABINET_DEPTH_MM / 2 * 0.8 * SCENE_SCALE_FACTOR; // Example: 80% of half depth
// export const DEVICE_3D_DEPTH_REAR = CABINET_DEPTH_MM / 2 * 0.8 * SCENE_SCALE_FACTOR;
export const DEVICE_3D_DEPTH = CABINET_DEPTH_MM * 0.4 * SCENE_SCALE_FACTOR; // Default device depth


// Design page specific dimensions (used for the top-down layout logic in DesignArea)
export const DESIGN_GRID_CELL_SIZE_PX = 20; 
export const DESIGN_AREA_LOGICAL_CABINET_WIDTH_PX = SCALED_CABINET_DETAIL_WIDTH_PX; 
export const DESIGN_AREA_LOGICAL_CABINET_HEIGHT_PX = SCALED_TOTAL_VISUAL_HEIGHT_PX; 

// Device Colors
export const DEVICE_COLOR_FRONT_BG = "bg-sky-200"; 
export const DEVICE_COLOR_REAR_BG = "bg-amber-200"; 
export const DEVICE_COLOR_OVERSIZED_BG = "bg-red-300"; 
export const DEVICE_TEXT_COLOR = "text-slate-700";

// For 3D Materials / Colors
export const COLOR_CABINET_3D = 0x64748b; // slate-500
export const COLOR_DEVICE_FRONT_3D = 0x7dd3fc; // sky-300
export const COLOR_DEVICE_REAR_3D = 0xfbbf24; // amber-400
export const COLOR_DEVICE_OVERSIZED_3D = 0xfca5a5; // red-300


export const MOCK_CABINET_DATA_FILE_NAME = "rack_data_example.xlsx";

// Constants for default cabinet layout in file-importer (uses scaled 2D dimensions)
export const DEFAULT_CABINET_START_X = 20; 
export const DEFAULT_CABINET_START_Y = 20; 
export const DEFAULT_ADJACENT_CABINET_SPACING_PX = 10 * VISUAL_SCALE; 
export const DEFAULT_CORRIDOR_SPACING_PX = 50 * VISUAL_SCALE; 
export const DEFAULT_CABINETS_PER_ROW = 5; 
