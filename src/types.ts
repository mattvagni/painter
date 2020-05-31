export type BlockColor = string | null;

export type Tool = "brush" | "eraser" | "fill" | "color-picker";

export type ToolStatus = "active" | "inactive";

export type Matrix = BlockColor[][];

export interface PixelPosition {
  x: number;
  y: number;
}

// X + Y in this context are coordinates in a matrix (not px values)
export interface CanvasPosition {
  x: number;
  y: number;
}
