'use client';

import { useFountainStore } from '@/store';

const SWATCHES = [
  '#ff5a4a', '#ff8f4d', '#f4b93e', '#5cff9a', '#37d6c1',
  '#37b6d6', '#5a86ff', '#a45cff', '#ff4fd8', '#ffffff',
];

export default function Inspector() {
  const selectedId = useFountainStore((s) => s.selectedPartId);
  const part = useFountainStore((s) =>
    s.design.parts.find((p) => p.id === s.selectedPartId)
  );
  const updatePart = useFountainStore((s) => s.updatePart);
  const removePart = useFountainStore((s) => s.removePart);
  const duplicatePart = useFountainStore((s) => s.duplicatePart);
  const selectPart = useFountainStore((s) => s.selectPart);

  if (!selectedId || !part) return null;

  const canColor = part.type === 'light' || part.type === 'base' || part.type === 'decoration';
  const scale = part.scale[0];

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        width: 232,
        background: 'var(--panel)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
        padding: 14,
        zIndex: 15,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 15, fontWeight: 800 }}>{part.name}</div>
        <button
          onClick={() => selectPart(null)}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16, color: 'var(--ink-soft)' }}
          title="Close"
        >
          ✕
        </button>
      </div>

      {canColor && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', margin: '12px 0 6px' }}>
            Color
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
            {SWATCHES.map((c) => (
              <button
                key={c}
                onClick={() => updatePart(part.id, { color: c })}
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: 8,
                  background: c,
                  cursor: 'pointer',
                  border:
                    part.color?.toLowerCase() === c.toLowerCase()
                      ? '3px solid var(--brand)'
                      : '1px solid rgba(0,0,0,0.12)',
                }}
              />
            ))}
          </div>
        </>
      )}

      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', margin: '14px 0 6px' }}>
        Size
      </div>
      <input
        type="range"
        min={0.5}
        max={2.5}
        step={0.05}
        value={scale}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          updatePart(part.id, { scale: [v, v, v] });
        }}
        style={{ width: '100%', accentColor: 'var(--brand)' }}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button
          className="tbtn"
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={() => duplicatePart(part.id)}
        >
          ⧉ Copy
        </button>
        <button
          className="tbtn tbtn-stop"
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={() => removePart(part.id)}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}
