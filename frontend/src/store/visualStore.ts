// visualStore.ts - Zustand store for 3D visualizer state
import { create } from 'zustand';

export type SurfaceType = 'COUNTERTOP' | 'BACKSPLASH' | 'ISLAND' | null;

export interface Granite {
  id: string;
  name: string;
  thumb: string;
  albedo: string;
  roughness: number;
  scale: number;
}

interface VisualState {
  activeSurface: SurfaceType;
  selectedGranite: Granite | null;
  setActiveSurface: (surface: SurfaceType) => void;
  setSelectedGranite: (granite: Granite | null) => void;
}

export const useVisualStore = create<VisualState>((set) => ({
  activeSurface: null,
  selectedGranite: null,
  setActiveSurface: (surface) => set({ activeSurface: surface }),
  setSelectedGranite: (granite) => set({ selectedGranite: granite }),
}));
