'use client';

import { useFountainStore } from '@/store';
import { getFountainSpec } from '@/fountainModels';

const SWATCHES = [
  '#ff5a4a', '#ff8f4d', '#f4b93e', '#5cff9a', '#37d6c1',
  '#37b6d6', '#5a86ff', '#a45cff', '#ff4fd8', '#ffffff',
];

export default function Inspector() {
  const selectedId = useFountainStore((s) => s.selectedPartId);
  const part = useFountainStore((s) => s.design.parts.find((p) => p.id === s.selectedPartId));
  const updatePart = useFountainStore((s) => s.updatePart);
  const removePart = useFountainStore((s) => s.removePart);
  const duplicatePart = useFountainStore((s) => s.duplicatePart);
  const selectPart = useFountainStore((s) => s.selectPart);

  if (!selectedId || !part) return null;

  const canColor = part.type === 'light' || part.type === 'base' || part.type === 'decoration';
  const scale = part.scale[0];

  const spec = part.type === 'base' ? getFountainSpec(part.variant) : null;
  const showTiers = spec && spec.tierCount > 1 && part.tierScales;

  const setTier = (i: number, v: number) => {
    const next = [...(part.tierScales || [])];
    next[i] = v;
    updatePart(part.id, { tierScales: next });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        width: 242,
        maxHeight: 'calc(100% - 32px)',
        overflowY: 'auto',
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
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', margin: '12px 0 6px' }}>Color</div>
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
                  border: part.color?.toLowerCase() === c.toLowerCase() ? '3px solid var(--brand)' : '1px solid rgba(0,0,0,0.12)',
                }}
              />
            ))}
          </div>
        </>
      )}

      {showTiers && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', margin: '14px 0 6px' }}>
            Layer widths
          </div>
          {part.tierScales!.map((v, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 2 }}>{spec!.layerLabels[i]}</div>
              <input
                type="range"
                min={0.4}
                max={1.8}
                step={0.02}
                value={v}
                onChange={(e) => setTier(i, parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brand)' }}
              />
            </div>
          ))}
        </>
      )}

      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', margin: '14px 0 6px' }}>Overall size</div>
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
        <button className="tbtn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => duplicatePart(part.id)}>
          ⧉ Copy
        </button>
        <button className="tbtn tbtn-stop" style={{ flex: 1, justifyContent: 'center' }} onClick={() => removePart(part.id)}>
          🗑 Delete
        </button>
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 8, textAlign: 'center' }}>
        Backspace to delete · ⌘Z to undo
      </div>
    </div>
  );
}
