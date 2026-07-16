import { create } from 'zustand';
import { CATALOG_BY_ID, PartCategory } from './catalog';
import { getFountainSpec } from './fountainModels';

export interface FountainPart {
  id: string;
  catalogId: string;
  type: PartCategory;
  name: string;
  variant: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  tierScales?: number[]; // per-layer width multipliers for fountains
}

export type Background =
  | 'day'
  | 'sunset'
  | 'night'
  | 'rain'
  | 'autumn'
  | 'forest'
  | 'whitehouse';

export interface FountainDesign {
  parts: FountainPart[];
  background: Background;
  isPlaying: boolean;
}

interface FountainStore {
  design: FountainDesign;
  selectedPartId: string | null;
  past: FountainPart[][];
  // actions
  addPart: (catalogId: string, xz?: [number, number]) => void;
  removePart: (id: string) => void;
  duplicatePart: (id: string) => void;
  updatePart: (id: string, updates: Partial<FountainPart>) => void;
  selectPart: (id: string | null) => void;
  setBackground: (bg: Background) => void;
  togglePlay: () => void;
  clearAll: () => void;
  undo: () => void;
}

let counter = 0;
const uid = (prefix: string) => `${prefix}-${counter++}`;

// Where a freshly placed part sits vertically, so nothing floats or sinks.
function yForType(type: PartCategory): number {
  switch (type) {
    case 'base':
      return 0;
    case 'jet':
      return 0.75;
    case 'light':
      return 0.55;
    case 'decoration':
      return 0.3;
    default:
      return 0;
  }
}

// A pleasant starting design so the canvas is never empty and boring.
function makeInitialParts(): FountainPart[] {
  counter = 0;
  const base = CATALOG_BY_ID['three-tier'];
  return [
    {
      id: uid('p'),
      catalogId: base.id,
      type: base.category,
      name: base.name,
      variant: base.variant,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: base.color,
      tierScales: new Array(getFountainSpec(base.variant).tierCount).fill(1),
    },
  ];
}

const initialDesign = (): FountainDesign => ({
  parts: makeInitialParts(),
  background: 'day',
  isPlaying: false,
});

export const useFountainStore = create<FountainStore>((set, get) => ({
  design: initialDesign(),
  selectedPartId: null,
  past: [],

  addPart: (catalogId, xz) => {
    const item = CATALOG_BY_ID[catalogId];
    if (!item) return;
    const [x, z] = xz ?? [
      (Math.random() - 0.5) * 2.4,
      (Math.random() - 0.5) * 2.4,
    ];
    const id = uid('p');
    const part: FountainPart = {
      id,
      catalogId: item.id,
      type: item.category,
      name: item.name,
      variant: item.variant,
      position: [x, yForType(item.category), z],
      rotation: [0, 0, 0],
      scale: item.scale ?? [1, 1, 1],
      color: item.color,
      tierScales:
        item.category === 'base'
          ? new Array(getFountainSpec(item.variant).tierCount).fill(1)
          : undefined,
    };
    set((state) => ({
      past: [...state.past, state.design.parts],
      design: { ...state.design, parts: [...state.design.parts, part] },
      selectedPartId: id,
    }));
  },

  removePart: (id) =>
    set((state) => ({
      past: [...state.past, state.design.parts],
      design: {
        ...state.design,
        parts: state.design.parts.filter((p) => p.id !== id),
      },
      selectedPartId: state.selectedPartId === id ? null : state.selectedPartId,
    })),

  duplicatePart: (id) => {
    const src = get().design.parts.find((p) => p.id === id);
    if (!src) return;
    const nid = uid('p');
    const copy: FountainPart = {
      ...src,
      id: nid,
      position: [src.position[0] + 0.8, src.position[1], src.position[2] + 0.8],
    };
    set((state) => ({
      past: [...state.past, state.design.parts],
      design: { ...state.design, parts: [...state.design.parts, copy] },
      selectedPartId: nid,
    }));
  },

  updatePart: (id, updates) =>
    set((state) => ({
      design: {
        ...state.design,
        parts: state.design.parts.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      },
    })),

  selectPart: (id) => set({ selectedPartId: id }),

  setBackground: (bg) =>
    set((state) => ({ design: { ...state.design, background: bg } })),

  togglePlay: () =>
    set((state) => ({
      design: { ...state.design, isPlaying: !state.design.isPlaying },
    })),

  clearAll: () =>
    set((state) => ({
      past: [...state.past, state.design.parts],
      design: { ...state.design, parts: [] },
      selectedPartId: null,
    })),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return {} as any;
      const prev = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        design: { ...state.design, parts: prev },
        selectedPartId: null,
      };
    }),
}));
