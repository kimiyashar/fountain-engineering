'use client';

import { useFountainStore, Background } from '@/store';

const BACKGROUNDS: { key: Background; label: string }[] = [
  { key: 'day', label: '☀️ Daytime' },
  { key: 'sunset', label: '🌅 Sunset' },
  { key: 'night', label: '🌙 Night' },
  { key: 'rain', label: '🌧️ Rainy' },
  { key: 'autumn', label: '🍂 Autumn' },
  { key: 'forest', label: '🌲 Forest' },
  { key: 'whitehouse', label: '🏛️ Grand Garden' },
];

export default function TopBar() {
  const isPlaying = useFountainStore((s) => s.design.isPlaying);
  const togglePlay = useFountainStore((s) => s.togglePlay);
  const undo = useFountainStore((s) => s.undo);
  const clearAll = useFountainStore((s) => s.clearAll);
  const canUndo = useFountainStore((s) => s.past.length > 0);
  const background = useFountainStore((s) => s.design.background);
  const setBackground = useFountainStore((s) => s.setBackground);
  const count = useFountainStore((s) => s.design.parts.length);

  return (
    <header
      style={{
        height: 60,
        flexShrink: 0,
        background: 'var(--panel)',
        borderBottom: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        zIndex: 20,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'linear-gradient(135deg,#37b6d6,#2f8fd8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            boxShadow: '0 2px 0 #1f6fb0',
          }}
        >
          ⛲
        </div>
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink)' }}>
            FountainCraft
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>
            {count} part{count === 1 ? '' : 's'} placed
          </div>
        </div>
      </div>

      <div style={{ width: 1, height: 30, background: 'var(--line)', margin: '0 4px' }} />

      {/* Undo / Clear */}
      <button
        className="tbtn tbtn-icon"
        onClick={undo}
        disabled={!canUndo}
        style={{ opacity: canUndo ? 1 : 0.4, cursor: canUndo ? 'pointer' : 'default' }}
        title="Undo"
      >
        ↶
      </button>
      <button className="tbtn" onClick={clearAll} title="Clear everything">
        🗑️ Clear
      </button>

      <div style={{ flex: 1 }} />

      {/* Background picker */}
      <select
        className="bg-select"
        value={background}
        onChange={(e) => setBackground(e.target.value as Background)}
        title="Change the scenery"
      >
        {BACKGROUNDS.map((b) => (
          <option key={b.key} value={b.key}>
            {b.label}
          </option>
        ))}
      </select>

      {/* Play */}
      <button
        className={`tbtn ${isPlaying ? 'tbtn-stop' : 'tbtn-primary'}`}
        onClick={togglePlay}
        style={{ minWidth: 128, justifyContent: 'center', fontSize: 15 }}
      >
        {isPlaying ? '⏸ Stop Water' : '▶ Turn On Water'}
      </button>
    </header>
  );
}
