'use client';

import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';

import { Model as Bedroom } from './components/Bedroom';
import { HoverProvider } from './components/HoverContext';
import { InfoPanel } from './components/InfoPanel';
import type { InfoMap } from './types/scene';

export default function Home() {
  // Provide your descriptions here. Keys must match child ids (typically GLB node names).
  // You can add more entries as you learn the names, e.g., "Bed", "Desk", "Lamp", etc.
  const infoMap: InfoMap = useMemo(() => ({
    // Add entries where the KEY equals the isolated piece's id
    // For per-piece isolation, ids are usually the mesh names from your GLB.
    // If a mesh has no name, our code assigns a fallback like "piece-0", "piece-1", ...

    // --- Examples you can customize (safe to delete or replace) ---
    'Bed': {
      id: 'Bed',
      title: 'Bed',
      description: 'A cozy place to sleep. Replace with your own description.',
    },
    'Desk': {
      id: 'Desk',
      title: 'Desk',
      description: 'A workspace for study or creation. Write your notes here.',
    },
    'Laptop': {
      id: 'Laptop',
      title: 'Laptop',
      description: 'Portable computer on the desk.',
    },

    // --- Fallback examples for unnamed meshes (auto-generated ids) ---
    'piece-0': {
      id: 'piece-0',
      title: 'Unnamed Piece 0',
      description: 'This mesh had no name in the GLB. Rename when identified.',
    },
    'piece-1': {
      id: 'piece-1',
      title: 'Unnamed Piece 1',
      description: 'Add a description after you identify this piece.',
    },
  }), []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <HoverProvider infoMap={infoMap}>
        {/* Overlay UI */}
        <InfoPanel />

        <Canvas camera={{ position: [5, 12, 5], near: 0.1, far: 1000 }}>
          {/* Lights */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.0} castShadow />

          {/* Room model */}
          <Suspense fallback={null}>
            <Bedroom scale={1} />
          </Suspense>

          {/* Grid helper */}
          <Grid
            args={[20, 20]}
            position={[0, -1, 0]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#6f6f6f"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#9d4b4b"
            fadeDistance={25}
            fadeStrength={1}
          />

          {/* Camera controls */}
          <OrbitControls enablePan enableZoom enableRotate />
        </Canvas>
      </HoverProvider>
    </div>
  );
}
