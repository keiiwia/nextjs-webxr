// app/components/InfoPanel.tsx
// Simple fixed overlay that shows details of the currently hovered object.

'use client';

import React from 'react';
import { useHover } from './HoverContext';

export function InfoPanel() {
  const { hoveredId, infoMap } = useHover();
  const info = hoveredId ? infoMap[hoveredId] : null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        width: 300,
        maxWidth: 'calc(100vw - 32px)',
        background: 'rgba(20,20,20,0.9)',
        color: 'white',
        padding: 16,
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        fontFamily: 'sans-serif',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {info ? (
        <>
          <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>Hovering:</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{info.title}</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>{info.description}</div>
        </>
      ) : (
        hoveredId ? (
          <>
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>Hovering:</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{hoveredId}</div>
            <div style={{ fontSize: 14, lineHeight: 1.5 }}>No details added yet. Add an entry for this id in <code>infoMap</code> inside <code>app/page.tsx</code>.</div>
          </>
        ) : (
          <div style={{ fontSize: 14, opacity: 0.8 }}>Hover over an object to learn more.</div>
        )
      )}
    </div>
  );
}