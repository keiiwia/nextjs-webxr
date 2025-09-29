// app/components/Bedroom.tsx
// Split the GLB into hoverable top-level groups and clone materials to avoid shared side effects.

'use client';

import React, { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { IsolateOnHover } from './IsolateOnHover';

export function Model(props: React.ComponentProps<'group'>) {
  // Load GLB from public folder. Ensure the file name matches exactly.
  const gltf = useGLTF('/tiny_isometric_room.glb') as unknown as {
    scene: THREE.Group;
  };

  // Ensure meshes don't disappear due to culling and render double-sided if needed
  useEffect(() => {
    gltf.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!('isMesh' in mesh) || !(mesh as unknown as { isMesh: boolean }).isMesh) return;

      mesh.frustumCulled = false;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const material: THREE.Material | THREE.Material[] | undefined =
        (mesh as unknown as { material?: THREE.Material | THREE.Material[] }).material;
      if (material) {
        const materials = Array.isArray(material) ? material : [material];
        materials.forEach((mat) => {
          if (Object.prototype.hasOwnProperty.call(mat, 'side')) {
            (mat as THREE.Material & { side: number }).side = THREE.DoubleSide;
          }
        });
      }

      // geometry guards
      const geometry = (mesh as unknown as { geometry?: THREE.BufferGeometry }).geometry;
      geometry?.computeBoundingSphere?.();
      geometry?.computeBoundingBox?.();
    });
  }, [gltf]);

  // OPTIONAL: List specific child names you want to isolate.
  // Leave this empty to keep the default behavior (top-level children only).
  // Example: new Set(['Bed', 'Desk', 'Lamp'])
  const desiredNames = useMemo(() => new Set<string>([]), []);

  // Collect every mesh (per-piece) so poorly organized GLBs still isolate by piece.
  // If `desiredNames` is set, we'll filter by those names; otherwise include all meshes.
  const sourceObjects = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    gltf.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if ((mesh as unknown as { isMesh?: boolean }).isMesh) meshes.push(mesh);
    });

    if (desiredNames.size > 0) {
      const filtered = meshes.filter((m) => m.name && desiredNames.has(m.name));
      // Fallback to all meshes if filter produced nothing so the scene still appears
      return filtered.length > 0 ? filtered : meshes;
    }

    return meshes;
  }, [gltf, desiredNames]);

  // Create deep clones with independent materials so dim/highlight doesn't affect originals.
  const childClones = useMemo(() => {
    const worldPos = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    const worldScale = new THREE.Vector3();

    return sourceObjects.map((mesh, index) => {
      // Ensure world matrix is up to date, then decompose
      mesh.updateWorldMatrix(true, false);
      mesh.matrixWorld.decompose(worldPos, worldQuat, worldScale);

      // Clone geometry and materials so styling does not leak
      const clonedMaterial = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material?.clone?.() ?? mesh.material;

      const clonedMesh = new THREE.Mesh(mesh.geometry.clone(), clonedMaterial ?? undefined);
      clonedMesh.castShadow = true;
      clonedMesh.receiveShadow = true;
      clonedMesh.frustumCulled = false;

      // Put the cloned mesh into a container with the original world transform
      const container = new THREE.Group();
      container.position.copy(worldPos);
      container.quaternion.copy(worldQuat);
      container.scale.copy(worldScale);
      container.add(clonedMesh);

      const id = (mesh.name && mesh.name.trim().length > 0) ? mesh.name : `piece-${index}`;
      // console.log('hover piece id:', id);
      return { id, object: container };
    });
  }, [sourceObjects]);

  return (
    <group {...props} dispose={null}>
      {childClones.map(({ id, object }) => (
        <IsolateOnHover key={id} id={id}>
          <primitive object={object} />
        </IsolateOnHover>
      ))}
    </group>
  );
}

// Preload for better UX
useGLTF.preload('/tiny_isometric_room.glb');