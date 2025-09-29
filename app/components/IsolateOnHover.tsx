// app/components/IsolateOnHover.tsx
// Wrap any mesh/group to make it hover-isolatable: hovered gets highlight, others dim.

'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useHover } from './HoverContext';

function traverseAndStyle(root: THREE.Object3D, style: 'normal' | 'dim' | 'highlight') {
  root.traverse((obj) => {
    // Only operate on Mesh-like objects that have a material
    const mesh = obj as THREE.Mesh;
    const material: THREE.Material | THREE.Material[] | undefined =
      // Some Object3D instances do not have material; guard accordingly
      (mesh as unknown as { material?: THREE.Material | THREE.Material[] }).material;
    if (!material) return;

    const materials = Array.isArray(material) ? material : [material];

    materials.forEach((mat) => {
      const isStandard = (m: THREE.Material): m is THREE.MeshStandardMaterial => {
        return (m as THREE.MeshStandardMaterial).isMeshStandardMaterial === true;
      };
      const std = isStandard(mat) ? mat : undefined;

      if (style === 'dim') {
        // Opacity is available on materials that extend Material with opacity/transparent
        if (Object.prototype.hasOwnProperty.call(mat, 'opacity')) {
          mat.transparent = true;
          (mat as THREE.Material & { opacity: number }).opacity = 0.4;
        }
        if (std) {
          std.emissive = new THREE.Color(0x000000);
          std.emissiveIntensity = 0;
        }
      } else if (style === 'normal') {
        if (Object.prototype.hasOwnProperty.call(mat, 'opacity')) {
          mat.transparent = true;
          (mat as THREE.Material & { opacity: number }).opacity = 1.0;
        }
        if (std) {
          std.emissive = new THREE.Color(0x000000);
          std.emissiveIntensity = 0;
        }
      } else if (style === 'highlight') {
        if (Object.prototype.hasOwnProperty.call(mat, 'opacity')) {
          mat.transparent = true;
          (mat as THREE.Material & { opacity: number }).opacity = 1.0;
        }
        if (std) {
          std.emissive = new THREE.Color(0x444444);
          std.emissiveIntensity = 0.6;
        }
      }

      mat.needsUpdate = true;
    });
  });
}

export function IsolateOnHover({
  id,
  children,
}: {
  // Unique id for this object; also used to look up info in the panel.
  id: string;
  // The 3D content to render (mesh/group).
  children: React.ReactNode;
}) {
  const { hoveredId, setHoveredId } = useHover();
  const groupRef = useRef<THREE.Group>(null);

  // Update dim/highlight each frame so late-loaded materials are handled.
  useFrame(() => {
    const root = groupRef.current;
    if (!root) return;
    if (hoveredId === null) traverseAndStyle(root, 'normal');
    else if (hoveredId === id) traverseAndStyle(root, 'highlight');
    else traverseAndStyle(root, 'dim');
  });

  // Pointer cursor UX
  useEffect(() => {
    if (hoveredId === id) document.body.style.cursor = 'pointer';
    else if (hoveredId === null) document.body.style.cursor = 'default';
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [hoveredId, id]);

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredId(id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHoveredId(null);
      }}
    >
      {children}
    </group>
  );
  
}