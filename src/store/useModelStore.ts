import { create } from "zustand";

interface ModelState {
  explodeLevel: number;
  setExplodeLevel: (level: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isTransforming: boolean;
  setIsTransforming: (value: boolean) => void;

  // 파트별 가시성 (componentId 기반 — 1:N 인스턴스도 함께 숨김)
  hiddenParts: Set<string>;
  togglePartVisibility: (id: string) => void;
  setAllPartsVisible: () => void;
}

export const useModelStore = create<ModelState>((set) => ({
  explodeLevel: 0,
  setExplodeLevel: (level: number) => set({ explodeLevel: level }),
  isLoading: true,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  isTransforming: false,
  setIsTransforming: (value: boolean) => set({ isTransforming: value }),

  hiddenParts: new Set<string>(),
  togglePartVisibility: (id) =>
    set((s) => {
      const next = new Set(s.hiddenParts);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { hiddenParts: next };
    }),
  setAllPartsVisible: () => set({ hiddenParts: new Set() }),
}));
