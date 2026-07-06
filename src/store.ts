import { create } from 'zustand';

export interface FountainPart {
  id: string;
  type: 'base' | 'jet' | 'light' | 'decoration';
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  intensity?: number;
}

export interface FountainDesign {
  parts: FountainPart[];
  background: 'day' | 'night' | 'rain' | 'autumn' | 'forest' | 'whitehouse';
  isPlaying: boolean;
}

interface FountainStore {
  design: FountainDesign;
  selectedPartId: string | null;
  addPart: (part: FountainPart) => void;
  removePart: (id: string) => void;
  updatePart: (id: string, updates: Partial<FountainPart>) => void;
  selectPart: (id: string | null) => void;
  setBackground: (bg: FountainDesign['background']) => void;
  togglePlay: () => void;
  reset: () => void;
}

const initialDesign: FountainDesign = {
  parts: [
    {
      id: 'base-1',
      type: 'base',
      name: 'Round Pedestal',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
  ],
  background: 'day',
  isPlaying: false,
};

export const useFountainStore = create<FountainStore>((set) => ({
  design: initialDesign,
  selectedPartId: null,

  addPart: (part) =>
    set((state) => ({
      design: {
        ...state.design,
        parts: [...state.design.parts, part],
      },
    })),

  removePart: (id) =>
    set((state) => ({
      design: {
        ...state.design,
        parts: state.design.parts.filter((p) => p.id !== id),
      },
      selectedPartId: state.selectedPartId === id ? null : state.selectedPartId,
    })),

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
    set((state) => ({
      design: { ...state.design, background: bg },
    })),

  togglePlay: () =>
    set((state) => ({
      design: { ...state.design, isPlaying: !state.design.isPlaying },
    })),

  reset: () => set({ design: initialDesign, selectedPartId: null }),
}));
