// createScene.ts - Create Babylon.js scene with camera, lighting, and placeholder meshes that match GLB structure
import { Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, MeshBuilder, Color3, Color4, Engine } from '@babylonjs/core';

// Scene configuration constants
const SCENE_CONFIG = {
  backgroundColor: new Color4(0.95, 0.95, 0.95, 1.0),
  camera: {
    alpha: -Math.PI / 2, // Horizontal rotation
    beta: Math.PI / 3,   // Vertical rotation
    radius: 10,          // Distance
    lowerRadiusLimit: 3,
    upperRadiusLimit: 20,
    target: new Vector3(0, 0.75, 0),
  },
  lighting: {
    hemispheric: {
      direction: new Vector3(0, 1, 0),
      intensity: 1.0,
      diffuse: new Color3(1, 1, 1),
      specular: new Color3(0.5, 0.5, 0.5),
    },
    directional: {
      direction: new Vector3(-1, -1, -0.5),
      intensity: 0.5,
    },
  },
  meshes: {
    countertop: {
      name: 'COUNTERTOP_MAIN',
      size: { width: 4, height: 0.1, depth: 2 },
      position: new Vector3(0, 0.5, -1),
    },
    backsplash: {
      name: 'BACKSPLASH_MAIN',
      size: { width: 4, height: 1.5, depth: 0.1 },
      position: new Vector3(0, 1.25, -2),
    },
    island: {
      name: 'ISLAND_MAIN',
      size: { width: 2.5, height: 0.1, depth: 1.3 },
      position: new Vector3(0, 0.5, 1.2),
    },
  },
} as const;

/**
 * Creates a Babylon.js scene with:
 * - ArcRotateCamera with zoom limits
 * - Studio-like environment lighting
 * - Placeholder meshes named COUNTERTOP_MAIN, BACKSPLASH_MAIN, and ISLAND_MAIN
 * 
 * FUTURE: This is where kitchen.glb should be loaded later.
 * Replace the placeholder mesh creation with:
 *   SceneLoader.ImportMesh("", "/models/", "kitchen.glb", scene, (meshes) => {
 *     // Meshes will be automatically registered by name
 *     // registerSurfaces() will handle them
 *   });
 *
 * NOTE: Add HDRI environment texture for realistic PBR stone reflection in the future.
 */
export const createScene = (engine: Engine, canvas: HTMLCanvasElement): Scene => {
  const scene = new Scene(engine);
  scene.clearColor = SCENE_CONFIG.backgroundColor;

  // Create ArcRotateCamera with zoom limits
  const camera = new ArcRotateCamera(
    'camera',
    SCENE_CONFIG.camera.alpha,
    SCENE_CONFIG.camera.beta,
    SCENE_CONFIG.camera.radius,
    SCENE_CONFIG.camera.target,
    scene
  );

  camera.lowerRadiusLimit = SCENE_CONFIG.camera.lowerRadiusLimit;
  camera.upperRadiusLimit = SCENE_CONFIG.camera.upperRadiusLimit;
  camera.attachControl(canvas, true);

  // Create studio-like environment lighting
  const hemisphericLight = new HemisphericLight('hemisphericLight', SCENE_CONFIG.lighting.hemispheric.direction, scene);
  hemisphericLight.intensity = SCENE_CONFIG.lighting.hemispheric.intensity;
  hemisphericLight.diffuse = SCENE_CONFIG.lighting.hemispheric.diffuse;
  hemisphericLight.specular = SCENE_CONFIG.lighting.hemispheric.specular;

  // Add directional light for better definition
  const directionalLight = new DirectionalLight('directionalLight', SCENE_CONFIG.lighting.directional.direction, scene);
  directionalLight.intensity = SCENE_CONFIG.lighting.directional.intensity;

  // FUTURE: Replace this section with kitchen.glb loading
  // For now, create placeholder boxes to match GLB zones

  // Countertop (back of kitchen)
  const countertop = MeshBuilder.CreateBox(
    SCENE_CONFIG.meshes.countertop.name,
    SCENE_CONFIG.meshes.countertop.size,
    scene
  );
  countertop.position = SCENE_CONFIG.meshes.countertop.position;

  // Backsplash (vertical, behind counter)
  const backsplash = MeshBuilder.CreateBox(
    SCENE_CONFIG.meshes.backsplash.name,
    SCENE_CONFIG.meshes.backsplash.size,
    scene
  );
  backsplash.position = SCENE_CONFIG.meshes.backsplash.position;

  // Island (front of kitchen)
  const island = MeshBuilder.CreateBox(
    SCENE_CONFIG.meshes.island.name,
    SCENE_CONFIG.meshes.island.size,
    scene
  );
  island.position = SCENE_CONFIG.meshes.island.position;

  camera.setTarget(SCENE_CONFIG.camera.target);

  return scene;
};
