"use client";

/**
 * 워크플로우 캔버스: 노드/엣지 편집, 저장/복원, Inspector 연동을 담당합니다.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MarkerType,
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
import type {
  WorkflowDocV1,
  WorkflowNode,
  WorkflowNodeData,
} from "@/type/workflowTypes";
import colors from "@/styles/constant/colors";

const STORAGE_KEY = "workflowDoc:v1";

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function WorkflowCanvas() {
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
            markerEnd: { type: MarkerType.ArrowClosed },
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

  const exportJson = useCallback(() => {
    const doc: WorkflowDocV1 = {
      version: 1,
      nodes,
      edges,
      viewport,
      updatedAt: Date.now(),
    };
    downloadJson(`workflow-${doc.updatedAt}.json`, doc);
  }, [nodes, edges, viewport]);

  // 초기 복원 + 기본 노드 생성
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialNode: WorkflowNode = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: "textNode",
        position: { x: 140, y: 140 },
        data: {
          title: "시작",
          content: "오른쪽 Inspector에서 텍스트를 편집해보세요.",
          attachments: [],
          updatedAt: Date.now(),
        },
      };
      setNodes([initialNode]);
      setEdges([]);
      setViewport({ x: 0, y: 0, zoom: 1 });
      setHydrated(true);
      return;
    }

    const parsed = safeJsonParse<WorkflowDocV1>(raw);
    if (!parsed || parsed.version !== 1) {
      setHydrated(true);
      return;
    }
    setNodes(parsed.nodes ?? []);
    setEdges(parsed.edges ?? []);
    setViewport(parsed.viewport ?? { x: 0, y: 0, zoom: 1 });
    setHydrated(true);
  }, [setEdges, setNodes]);

  // 자동 저장 (0.8s 디바운스)
  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => {
      const doc: WorkflowDocV1 = {
        version: 1,
        nodes,
        edges,
        viewport,
        updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
    }, 800);
    return () => window.clearTimeout(t);
  }, [nodes, edges, viewport, hydrated]);

  return (
    // <ReactFlowProvider>
    <CanvasLayout width="100%" height="100%" bg="alpha_dark_80">
      <CanvasArea>
        <ToolbarWrapper>
          <WorkflowToolbar onAddNode={addNode} onExportJson={exportJson} />
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
            style: { stroke: "rgba(255,255,255,0.55)", strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed },
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
        >
          <Background gap={18} size={3} color={colors.alpha_light_10} />
          <MiniMap zoomable pannable />
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
      />
    </CanvasLayout>
    // </ReactFlowProvider>
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
