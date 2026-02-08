import { create } from "zustand";

interface ModelState {
  explodeLevel: number;
  setExplodeLevel: (level: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isTransforming: boolean;
  setIsTransforming: (value: boolean) => void;

  // 파트별 가시성
  hiddenParts: Set<number>;
  togglePartVisibility: (index: number) => void;
  setAllPartsVisible: () => void;
}

export const useModelStore = create<ModelState>((set) => ({
  explodeLevel: 0,
  setExplodeLevel: (level: number) => set({ explodeLevel: level }),
  isLoading: true,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  isTransforming: false,
  setIsTransforming: (value: boolean) => set({ isTransforming: value }),

  hiddenParts: new Set<number>(),
  togglePartVisibility: (index) =>
    set((s) => {
      const next = new Set(s.hiddenParts);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return { hiddenParts: next };
    }),
  setAllPartsVisible: () => set({ hiddenParts: new Set() }),
}));
