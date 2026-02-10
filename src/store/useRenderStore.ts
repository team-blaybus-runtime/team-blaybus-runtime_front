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
  material: {
    roughness: number;
    metalness: number;
    envMapIntensity: number;
  };
}

interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

interface RenderState extends RenderSettings {
  cameraState: CameraState;
  setCameraState: (camera: CameraState) => void;
  setBloom: (bloom: Partial<RenderSettings["bloom"]>) => void;
  setAO: (ao: Partial<RenderSettings["ao"]>) => void;
  setLighting: (lighting: Partial<RenderSettings["lighting"]>) => void;
  setMaterial: (material: Partial<RenderSettings["material"]>) => void;
  reset: () => void;
}

const defaultCameraState: CameraState = {
  position: [3, 2, 3],
  target: [0, 0, 0],
  fov: 45,
};

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
  material: {
    roughness: 0.1,
    metalness: 0.9,
    envMapIntensity: 1.5,
  },
};

export const useRenderStore = create<RenderState>((set) => ({
  ...defaultSettings,
  cameraState: defaultCameraState,
  setCameraState: (camera) => set({ cameraState: camera }),
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
  setMaterial: (material) =>
    set((state) => ({
      material: { ...state.material, ...material },
    })),
  reset: () => set({ ...defaultSettings, cameraState: defaultCameraState }),
}));
