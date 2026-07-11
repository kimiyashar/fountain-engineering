'use client';

import { useState } from 'react';
import { CATALOG, CATEGORIES, CatalogItem, PartCategory } from '@/catalog';
import { useFountainStore } from '@/store';

export default function PartsBin() {
  const [active, setActive] = useState<PartCategory | 'all'>('all');
  const addPart = useFountainStore((s) => s.addPart);

  const items =
    active === 'all' ? CATALOG : CATALOG.filter((c) => c.category === active);

  return (
    <aside
      style={{
        width: 300,
        background: 'var(--panel)',
        borderLeft: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>
          Parts
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
          Drag a part onto the workplane
        </div>
      </div>

      {/* Category pills */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          padding: '4px 16px 12px',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <button
          className={`cat-pill ${active === 'all' ? 'active' : ''}`}
          onClick={() => setActive('all')}
        >
          ✨ All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`cat-pill ${active === c.key ? 'active' : ''}`}
            onClick={() => setActive(c.key)}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Tile grid */}
      <div
        className="bin-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          alignContent: 'start',
        }}
      >
        {items.map((item) => (
          <Tile key={item.id} item={item} onAdd={() => addPart(item.id)} />
        ))}
      </div>
    </aside>
  );
}

function Tile({ item, onAdd }: { item: CatalogItem; onAdd: () => void }) {
  return (
    <div
      className="tile"
      role="button"
      tabIndex={0}
      aria-label={`Add ${item.name}`}
      style={{ background: item.tile }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', item.id);
        e.dataTransfer.effectAllowed = 'copy';
      }}
      onClick={onAdd}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onAdd();
        }
      }}
      title={`${item.name} — drag onto the workplane or click to add`}
    >
      <span className="tile-emoji">{item.emoji}</span>
      <span className="tile-label">{item.name}</span>
    </div>
  );
}
