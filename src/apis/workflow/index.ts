import { Api } from "@/apis/baseApi";

// ===== 타입 =====

export interface NodeInfo {
  version: number;
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: { title: string; content: string; attachments: unknown[]; updatedAt: number };
    measured: { width: number; height: number };
    selected: boolean;
    dragging: boolean;
  }>;
  edges: Array<{
    type: string;
    style: { stroke: string; strokeWidth: number };
    markerEnd: { type: string };
    source: string;
    target: string;
    label: string;
    id: string;
  }>;
  viewport: { x: number; y: number; zoom: number };
  updatedAt: number;
}

export interface Workflow {
  id: number;
  title: string;
  nodeInfo: NodeInfo;
}

export interface CreateOrUpdateWorkflowRequest {
  title: string;
  nodeInfo: NodeInfo;
}

// ===== API =====

// 워크플로우 목록 조회 API
export const fetchWorkflows = async () => {
  const response = await Api.get<Workflow[]>("/workflows");
  return response.data;
};

// 워크플로우 생성 API
export const createWorkflow = async (
  payload: CreateOrUpdateWorkflowRequest,
) => {
  const response = await Api.post<Workflow>("/workflows", payload);
  return response.data;
};

// 워크플로우 수정 API
export const updateWorkflow = async (
  workflowId: number,
  payload: CreateOrUpdateWorkflowRequest,
) => {
  const response = await Api.put<Workflow>(`/workflows/${workflowId}`, payload);
  return response.data;
};

// 워크플로우 삭제 API
export const deleteWorkflow = async (workflowId: number) => {
  const response = await Api.delete(`/workflows/${workflowId}`);
  return response.data;
};
