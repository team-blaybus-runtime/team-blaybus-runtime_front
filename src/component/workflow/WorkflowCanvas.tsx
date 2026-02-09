"use client";

/**
 * 워크플로우 캔버스: 노드/엣지 편집, API 저장, Inspector 연동을 담당합니다.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
  type Viewport,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { Div } from "@/styles/base/BaseStyledTags";
import TextNode from "./canvas/TextNode";
import WorkflowInspector from "./inspectorPanel/WorkflowInspector";
import WorkflowToolbar from "./canvas/WorkflowToolbar";
import type { WorkflowNode, WorkflowNodeData } from "@/type/workflowTypes";
import type { Workflow } from "@/apis/workflow";
import { flowToNodeInfo, nodeInfoToFlow } from "./utils/workflowConversion";
import { useUpdateWorkflowMutation } from "@/queries/workflow/useUpdateWorkflowMutation";
import colors from "@/styles/constant/colors";

interface WorkflowCanvasProps {
  workflow: Workflow;
}

export default function WorkflowCanvas({ workflow }: WorkflowCanvasProps) {
  const updateMutation = useUpdateWorkflowMutation();
  const nodeTypes = useMemo(() => ({ textNode: TextNode }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId) ?? null;
  }, [nodes, selectedNodeId]);

  const selectedEdge = useMemo(() => {
    if (!selectedEdgeId) return null;
    return edges.find((e) => e.id === selectedEdgeId) ?? null;
  }, [edges, selectedEdgeId]);

  const updateSelectedNode = useCallback(
    (patch: Partial<WorkflowNodeData>) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNodeId
            ? { ...n, data: { ...n.data, ...patch, updatedAt: Date.now() } }
            : n,
        ),
      );
    },
    [selectedNodeId, setNodes],
  );

  const updateSelectedEdge = useCallback(
    (patch: Partial<Edge>) => {
      if (!selectedEdgeId) return;
      setEdges((eds) =>
        eds.map((e) => (e.id === selectedEdgeId ? { ...e, ...patch } : e)),
      );
    },
    [selectedEdgeId, setEdges],
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            label: "",
            type: "smoothstep",
            style: { stroke: "rgba(255,255,255,0.4)", strokeWidth: 3 },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const addNode = useCallback(() => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const newNode: WorkflowNode = {
      id,
      type: "textNode",
      position: { x: 80, y: 80 },
      data: {
        title: "새 노드",
        content: "",
        attachments: [],
        updatedAt: Date.now(),
      },
    };
    setNodes((nds) => [newNode, ...nds]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  }, [setNodes]);

  const handleSave = useCallback(() => {
    const nodeInfo = flowToNodeInfo(nodes, edges, viewport);
    updateMutation.mutate({
      workflowId: workflow.id,
      title: workflow.title,
      nodeInfo,
    });
  }, [nodes, edges, viewport, workflow.id, workflow.title, updateMutation]);

  // 선택한 워크플로우 데이터 → 캔버스 반영 (워크플로우 전환 시에만)
  useEffect(() => {
    const {
      nodes: n,
      edges: e,
      viewport: v,
    } = nodeInfoToFlow(workflow.nodeInfo);
    setNodes(n);
    setEdges(e);
    setViewport(v);
    setHydrated(true);
  }, [workflow.id, setNodes, setEdges]);

  return (
    <CanvasLayout width="100%" height="100%" bg="alpha_dark_80">
      <CanvasArea>
        <ToolbarWrapper>
          <WorkflowToolbar
            onAddNode={addNode}
            onSave={handleSave}
            isSaving={updateMutation.isPending}
          />
        </ToolbarWrapper>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          defaultEdgeOptions={{
            type: "smoothstep",
            style: { stroke: "rgba(255,255,255,0.4)", strokeWidth: 3 },
          }}
          deleteKeyCode={["Backspace", "Delete"]}
          onNodeClick={(_, node) => {
            setSelectedNodeId(node.id);
            setSelectedEdgeId(null);
          }}
          onEdgeClick={(_, edge) => {
            setSelectedEdgeId(edge.id);
            setSelectedNodeId(null);
          }}
          onPaneClick={() => {
            setSelectedNodeId(null);
            setSelectedEdgeId(null);
          }}
          onMoveEnd={(_, vp) => setViewport(vp)}
          defaultViewport={viewport}
          fitView
          fitViewOptions={{ maxZoom: 0.65, padding: 0.15 }}
        >
          <Background gap={18} size={3} color={colors.alpha_light_10} />
          <MiniMap zoomable pannable style={{ width: 120, height: 90 }} />
          <Controls />
        </ReactFlow>
      </CanvasArea>

      <WorkflowInspector
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onUpdateNode={updateSelectedNode}
        onUpdateEdge={updateSelectedEdge}
        onDeleteEdge={() => {
          if (!selectedEdge) return;
          setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
          setSelectedEdgeId(null);
        }}
        onSave={handleSave}
        isSaving={updateMutation.isPending}
      />
    </CanvasLayout>
  );
}

const CanvasLayout = styled(Div)`
  display: flex;
  height: 100%;
`;

const CanvasArea = styled(Div)`
  flex: 1;
  position: relative;
  height: 100%;
  min-height: 0;
`;

const ToolbarWrapper = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
`;
