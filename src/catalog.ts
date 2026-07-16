// The full palette of parts a builder can drag onto the workplane. Fountain
// "bases" map to the procedural models in fountainModels.ts by `variant`.

export type PartCategory = 'base' | 'jet' | 'light' | 'decoration';

export interface CatalogItem {
  id: string;
  name: string;
  category: PartCategory;
  emoji: string;
  tile: string;
  variant: string;
  color?: string;
  scale?: [number, number, number];
}

export const CATEGORIES: { key: PartCategory; label: string; emoji: string }[] = [
  { key: 'base', label: 'Fountains', emoji: '⛲' },
  { key: 'jet', label: 'Water Jets', emoji: '💦' },
  { key: 'light', label: 'Lights', emoji: '💡' },
  { key: 'decoration', label: 'Decorations', emoji: '🌿' },
];

const STONE = '#e9e2d2';
const STONE_WARM = '#eadfc8';
const STONE_COOL = '#e4e6ea';

export const CATALOG: CatalogItem[] = [
  // ---- 16 procedurally-carved fountains ----
  { id: 'round-basin', name: 'Roman Bowl', category: 'base', emoji: '⛲', tile: '#8fb8dd', variant: 'round-basin', color: STONE },
  { id: 'two-tier', name: 'Two-Tier Fountain', category: 'base', emoji: '⛲', tile: '#84aed7', variant: 'two-tier', color: STONE },
  { id: 'three-tier', name: 'Three-Tier Fountain', category: 'base', emoji: '⛲', tile: '#799fce', variant: 'three-tier', color: STONE },
  { id: 'grand-roman', name: 'Grand Roman', category: 'base', emoji: '🏛️', tile: '#6f97c8', variant: 'grand-roman', color: STONE_WARM },
  { id: 'tall-tier', name: 'Tall Cascade', category: 'base', emoji: '⛲', tile: '#6ea6c9', variant: 'tall-tier', color: STONE },
  { id: 'octagon-basin', name: 'Octagon Basin', category: 'base', emoji: '🛑', tile: '#7fb0c6', variant: 'octagon-basin', color: STONE_COOL },
  { id: 'octagon-two-tier', name: 'Octagon Tiers', category: 'base', emoji: '🛑', tile: '#74a6bf', variant: 'octagon-two-tier', color: STONE_COOL },
  { id: 'scalloped-bowl', name: 'Scalloped Bowl', category: 'base', emoji: '🐚', tile: '#8ab4c9', variant: 'scalloped-bowl', color: STONE_WARM },
  { id: 'lion-basin', name: 'Lion Basin', category: 'base', emoji: '🦁', tile: '#c79a5c', variant: 'lion-basin', color: STONE_WARM },
  { id: 'statue-fountain', name: 'Statue Fountain', category: 'base', emoji: '🗽', tile: '#9aa6b0', variant: 'statue-fountain', color: STONE_COOL },
  { id: 'urn-fountain', name: 'Classical Urn', category: 'base', emoji: '🏺', tile: '#c08a63', variant: 'urn-fountain', color: STONE_WARM },
  { id: 'square-basin', name: 'Square Basin', category: 'base', emoji: '⬛', tile: '#7fa9d4', variant: 'square-basin', color: STONE },
  { id: 'grand-pool', name: 'Grand Pool', category: 'base', emoji: '💠', tile: '#6ec2d8', variant: 'grand-pool', color: STONE },
  { id: 'wall-fountain', name: 'Wall Fountain', category: 'base', emoji: '🧱', tile: '#b08f74', variant: 'wall-fountain', color: STONE_WARM },
  { id: 'obelisk', name: 'Obelisk Fountain', category: 'base', emoji: '🗼', tile: '#8a94a0', variant: 'obelisk', color: STONE_COOL },
  { id: 'cascade', name: 'Cascade Steps', category: 'base', emoji: '🪜', tile: '#6fb0c2', variant: 'cascade', color: STONE },

  // ---- Water jets ----
  { id: 'vertical-jet', name: 'Tall Jet', category: 'jet', emoji: '⬆️', tile: '#37b6d6', variant: 'vertical', color: '#5cc0ef' },
  { id: 'arc-jet', name: 'Arc Spray', category: 'jet', emoji: '🌈', tile: '#33a7cf', variant: 'arc', color: '#5cc0ef' },
  { id: 'spray-jet', name: 'Spray Fan', category: 'jet', emoji: '💨', tile: '#3ec0dd', variant: 'spray', color: '#5cc0ef' },
  { id: 'bell-jet', name: 'Bell Jet', category: 'jet', emoji: '🔔', tile: '#2f9ec6', variant: 'bell', color: '#6fcaf0' },
  { id: 'foam-jet', name: 'Foam Bubbler', category: 'jet', emoji: '🫧', tile: '#49c8e0', variant: 'foam', color: '#bfeaff' },
  { id: 'ring-jet', name: 'Jet Ring', category: 'jet', emoji: '⭕', tile: '#2f93c0', variant: 'ring', color: '#7fd0f4' },

  // ---- Lights ----
  { id: 'rgb-light', name: 'Color LED', category: 'light', emoji: '🌈', tile: '#c65cc6', variant: 'bulb', color: '#ff4fd8' },
  { id: 'warm-light', name: 'Warm Glow', category: 'light', emoji: '🔆', tile: '#f4b93e', variant: 'bulb', color: '#ffcf7a' },
  { id: 'cool-light', name: 'Cool White', category: 'light', emoji: '❄️', tile: '#7fc7e8', variant: 'bulb', color: '#cfe6ff' },
  { id: 'red-light', name: 'Ruby Light', category: 'light', emoji: '🔴', tile: '#e0604f', variant: 'bulb', color: '#ff5a4a' },
  { id: 'green-light', name: 'Emerald Light', category: 'light', emoji: '🟢', tile: '#5cb87a', variant: 'bulb', color: '#5cff9a' },
  { id: 'blue-light', name: 'Sapphire Light', category: 'light', emoji: '🔵', tile: '#4f7fe0', variant: 'bulb', color: '#4f8bff' },
  { id: 'spotlight', name: 'Beam Spotlight', category: 'light', emoji: '🔦', tile: '#f0c14b', variant: 'beam', color: '#fff2c4' },
  { id: 'led-ring', name: 'LED Ring', category: 'light', emoji: '💿', tile: '#8a5cd6', variant: 'ledring', color: '#7f5cff' },

  // ---- Decorations ----
  { id: 'stone', name: 'Stone', category: 'decoration', emoji: '🪨', tile: '#9c9488', variant: 'stone', color: '#8f887e' },
  { id: 'plant', name: 'Plant', category: 'decoration', emoji: '🌿', tile: '#6bbf7a', variant: 'plant', color: '#3f9e57' },
  { id: 'statue', name: 'Statue', category: 'decoration', emoji: '🗿', tile: '#98a0a6', variant: 'statue', color: '#d7d2c8' },
  { id: 'lantern', name: 'Lantern', category: 'decoration', emoji: '🏮', tile: '#e0705a', variant: 'lantern', color: '#ff8a5c' },
  { id: 'koi', name: 'Koi Fish', category: 'decoration', emoji: '🐟', tile: '#f0925a', variant: 'koi', color: '#ff8f4d' },
  { id: 'lilypad', name: 'Lily Pad', category: 'decoration', emoji: '🪷', tile: '#7cc6a0', variant: 'lilypad', color: '#4faa74' },
  { id: 'hedge', name: 'Hedge', category: 'decoration', emoji: '🌳', tile: '#5ca86a', variant: 'hedge', color: '#3c8a4e' },
  { id: 'column', name: 'Column', category: 'decoration', emoji: '🏛️', tile: '#b7b0a2', variant: 'column', color: '#e4ddcc' },
];

export const CATALOG_BY_ID: Record<string, CatalogItem> = Object.fromEntries(
  CATALOG.map((c) => [c.id, c])
);
