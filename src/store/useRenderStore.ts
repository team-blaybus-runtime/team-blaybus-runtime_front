import { create } from "zustand";

interface RenderSettings {
  bloom: {
    intensity: number;
    threshold: number;
    smoothing: number;
  };
  ao: {
    radius: number;
    intensity: number;
  };
  lighting: {
    keyLightIntensity: number;
    ambientIntensity: number;
  };
}

interface RenderState extends RenderSettings {
  setBloom: (bloom: Partial<RenderSettings["bloom"]>) => void;
  setAO: (ao: Partial<RenderSettings["ao"]>) => void;
  setLighting: (lighting: Partial<RenderSettings["lighting"]>) => void;
  reset: () => void;
}

const defaultSettings: RenderSettings = {
  bloom: {
    intensity: 0.5,
    threshold: 0.8,
    smoothing: 0.9,
  },
  ao: {
    radius: 0.5,
    intensity: 1.5,
  },
  lighting: {
    keyLightIntensity: 2.0,
    ambientIntensity: 0.2,
  },
};

export const useRenderStore = create<RenderState>((set) => ({
  ...defaultSettings,
  setBloom: (bloom) =>
    set((state) => ({
      bloom: { ...state.bloom, ...bloom },
    })),
  setAO: (ao) =>
    set((state) => ({
      ao: { ...state.ao, ...ao },
    })),
  setLighting: (lighting) =>
    set((state) => ({
      lighting: { ...state.lighting, ...lighting },
    })),
  reset: () => set(defaultSettings),
}));
