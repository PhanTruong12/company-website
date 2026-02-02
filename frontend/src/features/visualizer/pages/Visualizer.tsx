// features/visualizer/pages/Visualizer.tsx - Main 3D granite visualizer page
import { useEffect, useRef } from 'react';
import { createEngine } from '../engine/createEngine';
import { createScene } from '../engine/createScene';
import { registerSurfaceClickHandlers, subscribeToMaterialChanges } from '../engine/registerSurfaces';
import { MaterialPanel } from '../components/MaterialPanel';
import './Visualizer.css';

export const Visualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine and scene
    const { engine, cleanup: engineCleanup } = createEngine(canvasRef.current);
    const scene = createScene(engine, canvasRef.current);

    // Register surface click handlers
    registerSurfaceClickHandlers(scene);

    // Subscribe to material changes from store
    const unsubscribe = subscribeToMaterialChanges(scene);

    // Start render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Cleanup
    return () => {
      unsubscribe();
      engineCleanup();
    };
  }, []);

  return (
    <div className="visualizer-page">
      <div className="visualizer-canvas-container">
        <canvas ref={canvasRef} className="visualizer-canvas" />
      </div>
      <MaterialPanel />
    </div>
  );
};
