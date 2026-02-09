import { create } from "zustand";

interface SimulatorState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  reset: () => void;
}

export const useSimulatorStore = create<SimulatorState>((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 30,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  reset: () => set({ isPlaying: false, currentTime: 0 }),
}));
