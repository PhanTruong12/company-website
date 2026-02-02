// shared/types/visualizer.ts - 3D Visualizer domain types
export type SurfaceType = 'COUNTERTOP' | 'BACKSPLASH' | 'ISLAND' | null;

export interface Granite {
  id: string;
  name: string;
  thumb: string;
  albedo: string;
  roughness: number;
  scale: number;
}
