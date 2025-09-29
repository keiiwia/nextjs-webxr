// app/components/HoverContext.tsx
// Provides global hover state and a central info map for the UI overlay.

'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import type { InfoMap } from '../types/scene';

type HoverContextValue = {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  infoMap: InfoMap;
};

const HoverContext = createContext<HoverContextValue | null>(null);

export function HoverProvider({
  children,
  infoMap,
}: {
  children: React.ReactNode;
  infoMap: InfoMap;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const value = useMemo(() => ({ hoveredId, setHoveredId, infoMap }), [hoveredId, infoMap]);
  return <HoverContext.Provider value={value}>{children}</HoverContext.Provider>;
}

export function useHover() {
  const ctx = useContext(HoverContext);
  if (!ctx) {
    throw new Error('useHover must be used inside a HoverProvider');
  }
  return ctx;
}
