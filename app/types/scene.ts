// app/types/scene.ts
// Global types for info shown in the UI.

export type SceneObjectInfo = {
  // A unique id for a 3D object in the scene (e.g., "bed", "desk").
  id: string;
  // A short title to display in the info panel.
  title: string;
  // A longer description for the hovered object.
  description: string;
};

export type InfoMap = Record<string, SceneObjectInfo>;
