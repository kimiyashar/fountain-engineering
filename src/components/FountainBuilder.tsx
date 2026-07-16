'use client';

import { Suspense, useEffect } from 'react';
import Canvas3D from './Canvas3D';
import PartsBin from './PartsBin';
import TopBar from './TopBar';
import Inspector from './Inspector';
import { dropBridge } from '@/dropBridge';
import { useFountainStore } from '@/store';

export default function FountainBuilder() {
  const count = useFountainStore((s) => s.design.parts.length);

  // Keyboard shortcuts: Backspace/Delete removes the selected part, ⌘/Ctrl+Z undoes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
      if (typing) return;
      const st = useFountainStore.getState();
      if ((e.key === 'Backspace' || e.key === 'Delete') && st.selectedPartId) {
        e.preventDefault();
        st.removePart(st.selectedPartId);
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        st.undo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'var(--panel-soft)' }}>
      <TopBar />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Canvas area is the drop target */}
        <div
          style={{ flex: 1, position: 'relative', minWidth: 0 }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          }}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            if (id && dropBridge.place) dropBridge.place(e.clientX, e.clientY, id);
          }}
        >
          <Suspense
            fallback={
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}>
                Loading your workshop…
              </div>
            }
          >
            <Canvas3D />
          </Suspense>

          <Inspector />

          {/* Friendly hint pinned to the bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid var(--line)',
              borderRadius: 999,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--ink-soft)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {count === 0
              ? '👉 Drag a fountain from the right to start building'
              : '🖱️ Drag to spin · scroll to zoom · click a part to edit · press ▶ to turn on the water'}
          </div>
        </div>

        <PartsBin />
      </div>
    </div>
  );
}
