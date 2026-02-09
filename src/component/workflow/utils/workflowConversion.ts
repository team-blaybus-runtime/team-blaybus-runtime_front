import type { Edge, Viewport } from "@xyflow/react";
import type { NodeInfo } from "@/apis/workflow";
import type { WorkflowNode } from "@/type/workflowTypes";

const DEFAULT_MEASURED = { width: 260, height: 50 };

/** API NodeInfo → React Flow nodes, edges, viewport */
export function nodeInfoToFlow(nodeInfo: NodeInfo): {
  nodes: WorkflowNode[];
  edges: Edge[];
  viewport: Viewport;
} {
  const nodes: WorkflowNode[] = (nodeInfo.nodes ?? []).map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: {
      title: n.data.title,
      content: n.data.content,
      attachments: n.data.attachments ?? [],
      updatedAt: n.data.updatedAt,
    },
  }));

  const edges: Edge[] = (nodeInfo.edges ?? []).map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.type,
    style: e.style,
    markerEnd: e.markerEnd,
    label: e.label,
  }));

  const viewport: Viewport = nodeInfo.viewport
    ? {
        x: nodeInfo.viewport.x,
        y: nodeInfo.viewport.y,
        zoom: nodeInfo.viewport.zoom,
      }
    : { x: 0, y: 0, zoom: 1 };

  return { nodes, edges, viewport };
}

/** React Flow nodes, edges, viewport → API NodeInfo */
export function flowToNodeInfo(
  nodes: WorkflowNode[],
  edges: Edge[],
  viewport: Viewport,
): NodeInfo {
  return {
    version: 1,
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type ?? "textNode",
      position: n.position,
      data: {
        title: n.data.title,
        content: n.data.content,
        attachments: n.data.attachments ?? [],
        updatedAt: n.data.updatedAt ?? Date.now(),
      },
      measured:
        "measured" in n && n.measured
          ? { width: n.measured.width, height: n.measured.height }
          : DEFAULT_MEASURED,
      selected: false,
      dragging: false,
    })),
    edges: edges.map((e) => ({
      type: e.type ?? "smoothstep",
      style: (e.style as { stroke: string; strokeWidth: number }) ?? {
        stroke: "rgba(255,255,255,0.55)",
        strokeWidth: 2,
      },
      markerEnd: (e.markerEnd as { type: string }) ?? { type: "arrowclosed" },
      source: e.source,
      target: e.target,
      label: (e as { label?: string }).label ?? "",
      id: e.id,
    })),
    viewport: { x: viewport.x, y: viewport.y, zoom: viewport.zoom },
    updatedAt: Date.now(),
  };
}

/** 새 워크플로우 생성 시 사용할 기본 NodeInfo */
export function getDefaultNodeInfo(): NodeInfo {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return {
    version: 1,
    nodes: [
      {
        id,
        type: "textNode",
        position: { x: 140, y: 140 },
        data: {
          title: "시작",
          content: "오른쪽 Inspector에서 텍스트를 편집해보세요.",
          attachments: [],
          updatedAt: Date.now(),
        },
        measured: { width: 260, height: 81 },
        selected: false,
        dragging: false,
      },
    ],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    updatedAt: Date.now(),
  };
}
