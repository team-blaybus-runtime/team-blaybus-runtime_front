import { create } from "zustand";

export type EditTool = "select" | "pan" | "zoomIn" | "zoomOut" | "focus" | "undo" | "redo";

interface CameraSnapshot {
  position: [number, number, number];
  target: [number, number, number];
}

interface EditState {
  activeTool: EditTool;
  setActiveTool: (tool: EditTool) => void;

  selectedPartIndex: number | null;
  setSelectedPartIndex: (index: number | null) => void;

  // 카메라 히스토리 (undo/redo)
  cameraHistory: CameraSnapshot[];
  cameraFuture: CameraSnapshot[];
  pushCameraSnapshot: (snapshot: CameraSnapshot) => void;
  undo: () => CameraSnapshot | null;
  redo: () => CameraSnapshot | null;

  // 액션 트리거 (1회성 동작용)
  zoomAction: "in" | "out" | null;
  focusAction: boolean;
  clearAction: () => void;
  triggerZoom: (dir: "in" | "out") => void;
  triggerFocus: () => void;
}

export const useEditStore = create<EditState>((set, get) => ({
  activeTool: "select",
  setActiveTool: (tool) => {
    // zoomIn/zoomOut/focus/undo/redo는 1회성 액션
    if (tool === "zoomIn" || tool === "zoomOut") {
      set({ zoomAction: tool === "zoomIn" ? "in" : "out" });
      return;
    }
    if (tool === "focus") {
      set({ focusAction: true });
      return;
    }
    if (tool === "undo") {
      get().undo();
      return;
    }
    if (tool === "redo") {
      get().redo();
      return;
    }
    set({ activeTool: tool });
  },

  selectedPartIndex: null,
  setSelectedPartIndex: (index) => set({ selectedPartIndex: index }),

  cameraHistory: [],
  cameraFuture: [],
  pushCameraSnapshot: (snapshot) =>
    set((s) => ({
      cameraHistory: [...s.cameraHistory.slice(-19), snapshot],
      cameraFuture: [],
    })),
  undo: () => {
    const { cameraHistory, cameraFuture } = get();
    if (cameraHistory.length === 0) return null;
    const prev = cameraHistory[cameraHistory.length - 1];
    set({
      cameraHistory: cameraHistory.slice(0, -1),
      cameraFuture: [...cameraFuture, prev],
    });
    return prev;
  },
  redo: () => {
    const { cameraHistory, cameraFuture } = get();
    if (cameraFuture.length === 0) return null;
    const next = cameraFuture[cameraFuture.length - 1];
    set({
      cameraHistory: [...cameraHistory, next],
      cameraFuture: cameraFuture.slice(0, -1),
    });
    return next;
  },

  zoomAction: null,
  focusAction: false,
  clearAction: () => set({ zoomAction: null, focusAction: false }),
  triggerZoom: (dir) => set({ zoomAction: dir }),
  triggerFocus: () => set({ focusAction: true }),
}));
