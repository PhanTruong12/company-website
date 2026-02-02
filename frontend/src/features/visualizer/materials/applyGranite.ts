// features/visualizer/materials/applyGranite.ts - Apply granite material to meshes
import { Scene, Mesh, PBRMaterial, Texture, Color3 } from '@babylonjs/core';
import type { Granite } from '../../../shared/types';

/**
 * Applies granite material to all meshes matching the surface prefix
 * @param scene - Babylon.js scene
 * @param surfacePrefix - Mesh name prefix (e.g., "COUNTERTOP", "BACKSPLASH")
 * @param granite - Granite material data
 */
export const applyGraniteToSurface = (
  scene: Scene,
  surfacePrefix: string,
  granite: Granite
): void => {
  // Find all meshes that match the surface prefix
  const meshes = scene.meshes.filter(
    (mesh) => mesh.name.startsWith(surfacePrefix) && mesh instanceof Mesh
  ) as Mesh[];

  if (meshes.length === 0) {
    console.warn(`No meshes found with prefix: ${surfacePrefix}`);
    return;
  }

  // Create or get existing PBR material
  let material = scene.getMaterialByName(`granite-${granite.id}`) as PBRMaterial;

  if (!material) {
    material = new PBRMaterial(`granite-${granite.id}`, scene);
  }

  // Set base properties
  material.roughness = granite.roughness;
  material.metallic = 0.0; // Granite is non-metallic

  // Load and apply albedo texture
  if (granite.albedo) {
    const albedoTexture = new Texture(granite.albedo, scene);
    // Apply texture tiling based on scale
    albedoTexture.uScale = granite.scale;
    albedoTexture.vScale = granite.scale;
    material.albedoTexture = albedoTexture;
  } else {
    // Fallback: use a default color if texture fails to load
    material.albedoColor = new Color3(0.8, 0.8, 0.8);
  }

  // Apply material to all matching meshes
  meshes.forEach((mesh) => {
    mesh.material = material;
  });

  console.log(`Applied granite "${granite.name}" to ${meshes.length} mesh(es) with prefix "${surfacePrefix}"`);
};
