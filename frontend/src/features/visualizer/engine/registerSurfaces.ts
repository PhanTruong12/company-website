// features/visualizer/engine/registerSurfaces.ts - Register surface click handlers
import { Scene, Mesh, PickingInfo } from '@babylonjs/core';
import { useVisualStore } from '../store/visualStore';
import type { SurfaceType } from '../../../shared/types';
import { applyGraniteToSurface } from '../materials/applyGranite';

/**
 * Determines surface type from mesh name
 * Only relies on mesh name prefix, works with placeholder boxes and future glb meshes
 */
const getSurfaceTypeFromMesh = (meshName: string): SurfaceType => {
  if (meshName.startsWith('COUNTERTOP')) {
    return 'COUNTERTOP';
  }
  if (meshName.startsWith('BACKSPLASH')) {
    return 'BACKSPLASH';
  }
  if (meshName.startsWith('ISLAND')) {
    return 'ISLAND';
  }
  return null;
};

/**
 * Registers click handlers for surface meshes
 * When a mesh is clicked, sets it as active surface in the store
 */
export const registerSurfaceClickHandlers = (scene: Scene): void => {
  scene.onPointerObservable.add((pointerInfo) => {
    if (pointerInfo.type !== 1) return; // Only handle POINTERDOWN events

    const pickInfo = pointerInfo.pickInfo as PickingInfo;
    if (!pickInfo.hit || !pickInfo.pickedMesh) return;

    const mesh = pickInfo.pickedMesh as Mesh;
    const surfaceType = getSurfaceTypeFromMesh(mesh.name);

    if (surfaceType) {
      const { setActiveSurface } = useVisualStore.getState();
      setActiveSurface(surfaceType);
      console.log(`Surface selected: ${surfaceType} (mesh: ${mesh.name})`);
    }
  });
};

/**
 * Subscribes to store changes and applies granite materials to active surface
 * This is the bridge between UI state and Babylon scene
 */
export const subscribeToMaterialChanges = (scene: Scene): (() => void) => {
  let lastActiveSurface: SurfaceType = null;
  let lastSelectedGraniteId: string | null = null;

  return useVisualStore.subscribe((state) => {
    const { activeSurface, selectedGranite } = state;

    // Only apply if something changed
    if (
      activeSurface === lastActiveSurface &&
      selectedGranite?.id === lastSelectedGraniteId
    ) {
      return;
    }

    lastActiveSurface = activeSurface;
    lastSelectedGraniteId = selectedGranite?.id || null;

    if (!activeSurface || !selectedGranite) return;

    // Apply granite material to all meshes matching the active surface prefix
    applyGraniteToSurface(scene, activeSurface, selectedGranite);
  });
};
