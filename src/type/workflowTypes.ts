/**
 * 워크플로우 전용 타입 정의 모음입니다.
 */

import type { Edge, Node, Viewport } from "@xyflow/react";

export type Attachment =
  | { type: "link"; url: string; title?: string }
  | { type: "file"; name: string; size?: number }
  | { type: "image"; name: string; dataUrl: string; size?: number };

export type WorkflowNodeData = {
  title: string;
  content: string;
  attachments: Attachment[];
  updatedAt: number;
};

export type WorkflowNode = Node<WorkflowNodeData>;

export type WorkflowDocV1 = {
  version: 1;
  nodes: WorkflowNode[];
  edges: Edge[];
  viewport: Viewport;
  updatedAt: number;
};
