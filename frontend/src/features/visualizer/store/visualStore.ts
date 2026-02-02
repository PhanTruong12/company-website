// features/visualizer/store/visualStore.ts - 3D Visualizer state store
import { create } from 'zustand';
import type { SurfaceType, Granite } from '../../../shared/types';

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
