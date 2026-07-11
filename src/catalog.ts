// The full palette of parts a kid can drag onto the workplane. Each entry is a
// "toy" with a friendly name, an emoji for its tile, a bright tile color, and
// the info the 3D scene needs to render it. Keeping this in one place makes it
// trivial to add dozens more parts later.

export type PartCategory = 'base' | 'jet' | 'light' | 'decoration';

export interface CatalogItem {
  id: string;
  name: string;
  category: PartCategory;
  emoji: string;
  tile: string; // tile background color
  variant: string; // which 3D shape to draw
  color?: string; // 3D material / light color
  scale?: [number, number, number];
}

export const CATEGORIES: { key: PartCategory; label: string; emoji: string }[] = [
  { key: 'base', label: 'Fountains', emoji: '⛲' },
  { key: 'jet', label: 'Water Jets', emoji: '💦' },
  { key: 'light', label: 'Lights', emoji: '💡' },
  { key: 'decoration', label: 'Decorations', emoji: '🌿' },
];

export const CATALOG: CatalogItem[] = [
  // ---- Fountain bases ----
  { id: 'round-bowl', name: 'Round Bowl', category: 'base', emoji: '⛲', tile: '#8fb8dd', variant: 'round', color: '#d8d2c7' },
  { id: 'square-basin', name: 'Square Basin', category: 'base', emoji: '🟦', tile: '#7fa9d4', variant: 'square', color: '#d8d2c7' },
  { id: 'tiered', name: 'Tiered Fountain', category: 'base', emoji: '🎂', tile: '#6f9fce', variant: 'tiered', color: '#e0dacf' },
  { id: 'ground-pool', name: 'Ground Pool', category: 'base', emoji: '💠', tile: '#6ec2d8', variant: 'pool', color: '#cfcabf' },
  { id: 'pedestal', name: 'Tall Pedestal', category: 'base', emoji: '🏛️', tile: '#8aa9c9', variant: 'pedestal', color: '#e4ddd0' },

  // ---- Water jets ----
  { id: 'vertical-jet', name: 'Tall Jet', category: 'jet', emoji: '⬆️', tile: '#37b6d6', variant: 'vertical', color: '#5cc0ef' },
  { id: 'arc-jet', name: 'Arc Spray', category: 'jet', emoji: '🌈', tile: '#33a7cf', variant: 'arc', color: '#5cc0ef' },
  { id: 'spray-jet', name: 'Spray Fan', category: 'jet', emoji: '💨', tile: '#3ec0dd', variant: 'spray', color: '#5cc0ef' },
  { id: 'bell-jet', name: 'Bell Jet', category: 'jet', emoji: '🔔', tile: '#2f9ec6', variant: 'bell', color: '#6fcaf0' },
  { id: 'foam-jet', name: 'Foam Bubbler', category: 'jet', emoji: '🫧', tile: '#49c8e0', variant: 'foam', color: '#bfeaff' },

  // ---- Lights ----
  { id: 'rgb-light', name: 'Color LED', category: 'light', emoji: '🌈', tile: '#c65cc6', variant: 'bulb', color: '#ff4fd8' },
  { id: 'warm-light', name: 'Warm Glow', category: 'light', emoji: '🔆', tile: '#f4b93e', variant: 'bulb', color: '#ffcf7a' },
  { id: 'cool-light', name: 'Cool White', category: 'light', emoji: '❄️', tile: '#7fc7e8', variant: 'bulb', color: '#cfe6ff' },
  { id: 'red-light', name: 'Ruby Light', category: 'light', emoji: '🔴', tile: '#e0604f', variant: 'bulb', color: '#ff5a4a' },
  { id: 'green-light', name: 'Emerald Light', category: 'light', emoji: '🟢', tile: '#5cb87a', variant: 'bulb', color: '#5cff9a' },
  { id: 'spotlight', name: 'Spotlight', category: 'light', emoji: '🔦', tile: '#f0c14b', variant: 'spot', color: '#fff2c4' },

  // ---- Decorations ----
  { id: 'stone', name: 'Stone', category: 'decoration', emoji: '🪨', tile: '#9c9488', variant: 'stone', color: '#8f887e' },
  { id: 'plant', name: 'Plant', category: 'decoration', emoji: '🌿', tile: '#6bbf7a', variant: 'plant', color: '#3f9e57' },
  { id: 'statue', name: 'Statue', category: 'decoration', emoji: '🗿', tile: '#98a0a6', variant: 'statue', color: '#d7d2c8' },
  { id: 'lantern', name: 'Lantern', category: 'decoration', emoji: '🏮', tile: '#e0705a', variant: 'lantern', color: '#ff8a5c' },
  { id: 'koi', name: 'Koi Fish', category: 'decoration', emoji: '🐟', tile: '#f0925a', variant: 'koi', color: '#ff8f4d' },
  { id: 'lilypad', name: 'Lily Pad', category: 'decoration', emoji: '🪷', tile: '#7cc6a0', variant: 'lilypad', color: '#4faa74' },
];

export const CATALOG_BY_ID: Record<string, CatalogItem> = Object.fromEntries(
  CATALOG.map((c) => [c.id, c])
);
