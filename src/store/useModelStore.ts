import { create } from "zustand";

interface ModelState {
  explodeLevel: number;
  setExplodeLevel: (level: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isTransforming: boolean;
  setIsTransforming: (value: boolean) => void;
}

export const useModelStore = create<ModelState>((set) => ({
  explodeLevel: 0,
  setExplodeLevel: (level: number) => set({ explodeLevel: level }),
  isLoading: true,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  isTransforming: false,
  setIsTransforming: (value: boolean) => set({ isTransforming: value }),
}));
