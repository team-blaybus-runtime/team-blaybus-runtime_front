import { create } from "zustand";

export type EditTool = "select" | "transform" | "pan" | "zoomIn" | "zoomOut" | "focus" | "undo" | "redo";
export type TransformMode = "translate" | "rotate";

export interface TransformData {
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface HistoryEntry {
  type: "transform";
  partIndex: number;
  before: TransformData;
  after: TransformData;
}

interface EditState {
  activeTool: EditTool;
  setActiveTool: (tool: EditTool) => void;

  // transform 도구의 하위 모드 (이동 ↔ 회전 토글)
  transformMode: TransformMode;

  selectedPartIndex: number | null;
  setSelectedPartIndex: (index: number | null) => void;

  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;

  // 오브젝트 변환 히스토리 (undo/redo)
  history: HistoryEntry[];
  future: HistoryEntry[];
  pushHistory: (entry: HistoryEntry) => void;
  undo: () => HistoryEntry | null;
  redo: () => HistoryEntry | null;

  // 액션 트리거 (1회성 동작용)
  zoomAction: "in" | "out" | null;
  focusAction: boolean;
  resetTransformFlag: number;
  clearAction: () => void;
  triggerZoom: (dir: "in" | "out") => void;
  triggerFocus: () => void;
  resetEditState: () => void;
}

export const useEditStore = create<EditState>((set, get) => ({
  activeTool: "select",
  setActiveTool: (tool) => {
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
    // transform 버튼 재클릭 시 이동 ↔ 회전 토글
    if (tool === "transform" && get().activeTool === "transform") {
      set((s) => ({ transformMode: s.transformMode === "translate" ? "rotate" : "translate" }));
      return;
    }
    set({ activeTool: tool });
  },

  transformMode: "translate" as TransformMode,

  selectedPartIndex: null,
  setSelectedPartIndex: (index) => set({ selectedPartIndex: index }),

  selectedComponentId: null,
  setSelectedComponentId: (id) => set({ selectedComponentId: id, selectedPartIndex: null }),

  history: [],
  future: [],
  pushHistory: (entry) =>
    set((s) => ({
      history: [...s.history.slice(-49), entry],
      future: [],
    })),
  undo: () => {
    const { history, future } = get();
    if (history.length === 0) return null;
    const last = history[history.length - 1];
    set({
      history: history.slice(0, -1),
      future: [...future, last],
    });
    return last;
  },
  redo: () => {
    const { history, future } = get();
    if (future.length === 0) return null;
    const next = future[future.length - 1];
    set({
      history: [...history, next],
      future: future.slice(0, -1),
    });
    return next;
  },

  zoomAction: null,
  focusAction: false,
  resetTransformFlag: 0,
  clearAction: () => set({ zoomAction: null, focusAction: false }),
  triggerZoom: (dir) => set({ zoomAction: dir }),
  triggerFocus: () => set({ focusAction: true }),
  resetEditState: () =>
    set((s) => ({
      activeTool: "select",
      transformMode: "translate",
      selectedPartIndex: null,
      selectedComponentId: null,
      zoomAction: null,
      focusAction: false,
      history: [],
      future: [],
      resetTransformFlag: s.resetTransformFlag + 1,
    })),
}));
