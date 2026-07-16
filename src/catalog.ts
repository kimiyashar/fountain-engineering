// The full palette of parts. Fountain "bases" map to procedural models in
// fountainModels.ts by `variant`; jets/lights/decorations map to previews.ts.

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
const JT = '#2f93c0'; // jet tile
const LT = '#161b26'; // light tile (dark — glows read on it)
const DT = '#6b9a72'; // decoration tile

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

  // ---- Water jets (12) ----
  { id: 'vertical-jet', name: 'Tall Jet', category: 'jet', emoji: '⬆️', tile: JT, variant: 'vertical', color: '#5cc0ef' },
  { id: 'column-jet', name: 'Thick Column', category: 'jet', emoji: '🌊', tile: JT, variant: 'column', color: '#5cc0ef' },
  { id: 'geyser-jet', name: 'Geyser', category: 'jet', emoji: '⛲', tile: JT, variant: 'geyser', color: '#7fd0f4' },
  { id: 'arc-jet', name: 'Arc Spray', category: 'jet', emoji: '🌈', tile: JT, variant: 'arc', color: '#5cc0ef' },
  { id: 'spray-jet', name: 'Spray Fan', category: 'jet', emoji: '💨', tile: JT, variant: 'spray', color: '#5cc0ef' },
  { id: 'bell-jet', name: 'Bell Jet', category: 'jet', emoji: '🔔', tile: JT, variant: 'bell', color: '#6fcaf0' },
  { id: 'mist-jet', name: 'Fine Mist', category: 'jet', emoji: '🌫️', tile: JT, variant: 'mist', color: '#cfeeff' },
  { id: 'foam-jet', name: 'Foam Bubbler', category: 'jet', emoji: '🫧', tile: JT, variant: 'foam', color: '#bfeaff' },
  { id: 'spiral-jet', name: 'Spiral Jet', category: 'jet', emoji: '🌀', tile: JT, variant: 'spiral', color: '#5cc0ef' },
  { id: 'ring-jet', name: 'Jet Ring', category: 'jet', emoji: '⭕', tile: JT, variant: 'ring', color: '#7fd0f4' },
  { id: 'crown-jet', name: 'Crown Ring', category: 'jet', emoji: '👑', tile: JT, variant: 'crown', color: '#7fd0f4' },
  { id: 'fanwall-jet', name: 'Fan Wall', category: 'jet', emoji: '〰️', tile: JT, variant: 'fanwall', color: '#5cc0ef' },

  // ---- Lights (17) — intricate optical selection ----
  { id: 'warm-light', name: 'Warm White', category: 'light', emoji: '🔆', tile: LT, variant: 'bulb', color: '#ffcf7a' },
  { id: 'cool-light', name: 'Cool White', category: 'light', emoji: '❄️', tile: LT, variant: 'bulb', color: '#cfe6ff' },
  { id: 'amber-light', name: 'Amber', category: 'light', emoji: '🟠', tile: LT, variant: 'bulb', color: '#ffb14a' },
  { id: 'ruby-light', name: 'Ruby', category: 'light', emoji: '🔴', tile: LT, variant: 'bulb', color: '#ff5a4a' },
  { id: 'emerald-light', name: 'Emerald', category: 'light', emoji: '🟢', tile: LT, variant: 'bulb', color: '#5cff9a' },
  { id: 'sapphire-light', name: 'Sapphire', category: 'light', emoji: '🔵', tile: LT, variant: 'bulb', color: '#4f8bff' },
  { id: 'magenta-light', name: 'Magenta', category: 'light', emoji: '🟣', tile: LT, variant: 'bulb', color: '#ff4fd8' },
  { id: 'cyan-light', name: 'Cyan', category: 'light', emoji: '🩵', tile: LT, variant: 'bulb', color: '#4ff0ff' },
  { id: 'rgb-light', name: 'RGB Color-Cycle', category: 'light', emoji: '🌈', tile: LT, variant: 'cycle', color: '#ff4fd8' },
  { id: 'beam-spot', name: 'Beam Uplight', category: 'light', emoji: '🔦', tile: LT, variant: 'beam', color: '#fff2c4' },
  { id: 'gobo', name: 'Gobo Projector', category: 'light', emoji: '🎞️', tile: LT, variant: 'gobo', color: '#bfe0ff' },
  { id: 'led-ring', name: 'LED Ring', category: 'light', emoji: '💿', tile: LT, variant: 'ledring', color: '#7f5cff' },
  { id: 'wash-bar', name: 'Wash Bar', category: 'light', emoji: '📊', tile: LT, variant: 'washbar', color: '#ffd36b' },
  { id: 'uplight-wash', name: 'Wash Dome', category: 'light', emoji: '🌗', tile: LT, variant: 'wash', color: '#6fd0ff' },
  { id: 'fiber', name: 'Fiber Starfield', category: 'light', emoji: '✨', tile: LT, variant: 'fiber', color: '#ffffff' },
  { id: 'laser', name: 'Laser Beam', category: 'light', emoji: '📡', tile: LT, variant: 'laser', color: '#38ff8a' },
  { id: 'flame', name: 'Flame Flicker', category: 'light', emoji: '🔥', tile: LT, variant: 'flame', color: '#ff8a2c' },

  // ---- Decorations (16) ----
  { id: 'stone', name: 'Stone', category: 'decoration', emoji: '🪨', tile: DT, variant: 'stone', color: '#8f887e' },
  { id: 'rock', name: 'Rock Cluster', category: 'decoration', emoji: '🪨', tile: DT, variant: 'rock', color: '#8a8378' },
  { id: 'plant', name: 'Plant', category: 'decoration', emoji: '🌿', tile: DT, variant: 'plant', color: '#3f9e57' },
  { id: 'grass', name: 'Grass Tuft', category: 'decoration', emoji: '🌱', tile: DT, variant: 'grass', color: '#4faa5a' },
  { id: 'topiary', name: 'Topiary', category: 'decoration', emoji: '🌳', tile: DT, variant: 'topiary', color: '#3c8a4e' },
  { id: 'hedge', name: 'Hedge', category: 'decoration', emoji: '🟩', tile: DT, variant: 'hedge', color: '#3c8a4e' },
  { id: 'statue', name: 'Statue', category: 'decoration', emoji: '🗿', tile: DT, variant: 'statue', color: '#d7d2c8' },
  { id: 'dolphin', name: 'Dolphin', category: 'decoration', emoji: '🐬', tile: DT, variant: 'dolphin', color: '#b8c4cc' },
  { id: 'koi', name: 'Koi Fish', category: 'decoration', emoji: '🐟', tile: DT, variant: 'koi', color: '#ff8f4d' },
  { id: 'lilypad', name: 'Lily Pad', category: 'decoration', emoji: '🪷', tile: DT, variant: 'lilypad', color: '#4faa74' },
  { id: 'lantern', name: 'Lantern', category: 'decoration', emoji: '🏮', tile: DT, variant: 'lantern', color: '#ffb45c' },
  { id: 'torch', name: 'Torch', category: 'decoration', emoji: '🔥', tile: DT, variant: 'torch', color: '#5a4030' },
  { id: 'urn', name: 'Urn Planter', category: 'decoration', emoji: '🏺', tile: DT, variant: 'urn', color: '#d8c9a8' },
  { id: 'bench', name: 'Bench', category: 'decoration', emoji: '🪑', tile: DT, variant: 'bench', color: '#c8bfa8' },
  { id: 'arch', name: 'Arch', category: 'decoration', emoji: '🏛️', tile: DT, variant: 'arch', color: '#e4ddcc' },
  { id: 'column', name: 'Column', category: 'decoration', emoji: '🏛️', tile: DT, variant: 'column', color: '#e4ddcc' },
];

export const CATALOG_BY_ID: Record<string, CatalogItem> = Object.fromEntries(
  CATALOG.map((c) => [c.id, c])
);
