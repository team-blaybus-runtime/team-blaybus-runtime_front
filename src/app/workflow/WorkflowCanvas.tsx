"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  type Viewport,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

type Attachment =
  | { type: "link"; url: string; title?: string }
  | { type: "file"; name: string; size?: number };

type WorkflowNodeData = {
  title: string;
  content: string;
  attachments: Attachment[];
  updatedAt: number;
};

type WorkflowNode = Node<WorkflowNodeData>;

type WorkflowDocV1 = {
  version: 1;
  nodes: WorkflowNode[];
  edges: Edge[];
  viewport: Viewport;
  updatedAt: number;
};

const STORAGE_KEY = "workflowDoc:v1";

function now() {
  return Date.now();
}

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function makeId() {
  return `${now()}-${Math.random().toString(16).slice(2)}`;
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

function TextNode({ data, selected }: NodeProps<WorkflowNode>) {
  return (
    <div
      style={{
        width: 260,
        borderRadius: 12,
        border: selected ? "2px solid #60a5fa" : "1px solid rgba(255,255,255,0.14)",
        background: "#0f172a",
        padding: 12,
        boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
        position: "relative",
        color: "rgba(255,255,255,0.92)",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 10,
          height: 10,
          background: "#93c5fd",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 10,
          height: 10,
          background: "#93c5fd",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      />

      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
        {data.title || "제목 없음"}
      </div>
      <div
        style={{
          fontSize: 12,
          lineHeight: 1.4,
          color: "rgba(255,255,255,0.65)",
          whiteSpace: "pre-wrap",
        }}
      >
        {(data.content || "").slice(0, 220)}
        {(data.content || "").length > 220 ? "…" : ""}
      </div>
      {data.attachments?.length ? (
        <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
          첨부 {data.attachments.length}개
        </div>
      ) : null}
    </div>
  );
}

function WorkflowCanvasInner() {
  const nodeTypes = useMemo(() => ({ textNode: TextNode }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const selectedNode = useMemo(
    () => (selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null),
    [nodes, selectedNodeId]
  );

  const selectedEdge = useMemo(
    () => (selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null),
    [edges, selectedEdgeId]
  );

  const updateSelectedNode = useCallback(
    (patch: Partial<WorkflowNodeData>) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNodeId
            ? { ...n, data: { ...n.data, ...patch, updatedAt: now() } }
            : n
        )
      );
    },
    [selectedNodeId, setNodes]
  );

  const updateSelectedEdge = useCallback(
    (patch: Partial<Edge>) => {
      if (!selectedEdgeId) return;
      setEdges((eds) => eds.map((e) => (e.id === selectedEdgeId ? { ...e, ...patch } : e)));
    },
    [selectedEdgeId, setEdges]
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
          eds
        )
      ),
    [setEdges]
  );

  const addNode = useCallback(() => {
    const id = makeId();
    const newNode: WorkflowNode = {
      id,
      type: "textNode",
      position: { x: 80, y: 80 },
      data: { title: "새 노드", content: "", attachments: [], updatedAt: now() },
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
      updatedAt: now(),
    };
    downloadJson(`workflow-${doc.updatedAt}.json`, doc);
  }, [nodes, edges, viewport]);

  const importJsonFromFile = useCallback(
    async (file: File) => {
      const text = await file.text();
      const parsed = safeJsonParse<WorkflowDocV1>(text);
      if (!parsed || parsed.version !== 1) return;
      if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return;
      setNodes(parsed.nodes);
      setEdges(parsed.edges);
      setViewport(parsed.viewport ?? { x: 0, y: 0, zoom: 1 });
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
    },
    [setEdges, setNodes]
  );

  // 초기 복원 + 기본 노드 생성
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialNode: WorkflowNode = {
        id: makeId(),
        type: "textNode",
        position: { x: 140, y: 140 },
        data: {
          title: "시작",
          content: "오른쪽 Inspector에서 텍스트를 편집해보세요.",
          attachments: [],
          updatedAt: now(),
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
  /* eslint-enable react-hooks/set-state-in-effect */

  // 자동 저장 (0.8s 디바운스)
  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => {
      const doc: WorkflowDocV1 = {
        version: 1,
        nodes,
        edges,
        viewport,
        updatedAt: now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
    }, 800);
    return () => window.clearTimeout(t);
  }, [nodes, edges, viewport, hydrated]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b1220" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 10,
            display: "flex",
            gap: 8,
            padding: 10,
            borderRadius: 12,
            background: "rgba(17,24,39,0.92)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(6px)",
          }}
        >
          <button
            onClick={addNode}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "#0b1220",
              color: "rgba(255,255,255,0.9)",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            + 노드
          </button>
          <button
            onClick={exportJson}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "#0b1220",
              color: "rgba(255,255,255,0.9)",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Export JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "#0b1220",
              color: "rgba(255,255,255,0.9)",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Import JSON
          </button>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", padding: 8 }}>
            자동 저장됨
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importJsonFromFile(f);
              e.currentTarget.value = "";
            }}
          />
        </div>

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
          <Background gap={18} size={1} color="rgba(255,255,255,0.08)" />
          <MiniMap zoomable pannable />
          <Controls />
        </ReactFlow>
      </div>

      <div
        style={{
          width: 360,
          borderLeft: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(17,24,39,0.92)",
          padding: 16,
          overflow: "auto",
          color: "rgba(255,255,255,0.92)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 12 }}>
          Inspector
        </div>

        {!selectedNode && !selectedEdge ? (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            노드/선을 선택하면 편집할 수 있어요.
          </div>
        ) : selectedEdge ? (
          <>
            <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
              선 라벨
            </div>
            <input
              value={(selectedEdge.label as string) ?? ""}
              onChange={(e) => updateSelectedEdge({ label: e.target.value })}
              placeholder="예: 다음 단계"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)",
                outline: 0,
                marginBottom: 12,
                fontSize: 13,
                background: "#0b1220",
                color: "rgba(255,255,255,0.9)",
              }}
            />
            <button
              onClick={() => {
                setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
                setSelectedEdgeId(null);
              }}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "#0b1220",
                color: "rgba(255,255,255,0.9)",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              선 삭제
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
              제목
            </div>
            <input
              value={selectedNode?.data.title ?? ""}
              onChange={(e) => updateSelectedNode({ title: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)",
                outline: 0,
                marginBottom: 12,
                fontSize: 13,
                background: "#0b1220",
                color: "rgba(255,255,255,0.9)",
              }}
            />

            <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
              내용
            </div>
            <textarea
              value={selectedNode?.data.content ?? ""}
              onChange={(e) => updateSelectedNode({ content: e.target.value })}
              rows={10}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)",
                outline: 0,
                marginBottom: 14,
                fontSize: 13,
                resize: "vertical",
                background: "#0b1220",
                color: "rgba(255,255,255,0.9)",
              }}
            />

            <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 8 }}>
              첨부(메타)
            </div>

            {selectedNode?.data.attachments?.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(selectedNode?.data.attachments ?? []).map((a, idx) => (
                  <div
                    key={`${a.type}-${idx}`}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.14)",
                      fontSize: 12,
                    }}
                  >
                    <div style={{ fontWeight: 900, marginBottom: 4 }}>
                      {a.type === "link" ? "링크" : "파일"}
                    </div>
                    {a.type === "link" ? (
                      <div style={{ color: "rgba(255,255,255,0.65)" }}>
                        {(a.title ? `${a.title} · ` : "") + a.url}
                      </div>
                    ) : (
                      <div style={{ color: "rgba(255,255,255,0.65)" }}>
                        {a.name}
                        {typeof a.size === "number" ? ` (${a.size}B)` : ""}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        const next = (selectedNode?.data.attachments ?? []).filter(
                          (_, i) => i !== idx
                        );
                        updateSelectedNode({ attachments: next });
                      }}
                      style={{
                        marginTop: 8,
                        padding: "6px 8px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "#0b1220",
                        color: "rgba(255,255,255,0.9)",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      제거
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                아직 첨부가 없어요.
              </div>
            )}

            <div style={{ height: 14 }} />

            <AddLinkForm
              onAdd={(link) => {
                const next = [...(selectedNode?.data.attachments ?? []), link];
                updateSelectedNode({ attachments: next });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

function AddLinkForm({ onAdd }: { onAdd: (a: Attachment) => void }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.14)",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 8 }}>
        링크 추가
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목(선택)"
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.14)",
          outline: 0,
          marginBottom: 8,
          fontSize: 13,
          background: "rgba(0,0,0,0)",
          color: "rgba(255,255,255,0.9)",
        }}
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.14)",
          outline: 0,
          marginBottom: 10,
          fontSize: 13,
          background: "rgba(0,0,0,0)",
          color: "rgba(255,255,255,0.9)",
        }}
      />
      <button
        onClick={() => {
          const trimmed = url.trim();
          if (!trimmed) return;
          onAdd({ type: "link", url: trimmed, title: title.trim() || undefined });
          setTitle("");
          setUrl("");
        }}
        style={{
          padding: "8px 10px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(0,0,0,0)",
          color: "rgba(255,255,255,0.9)",
          cursor: "pointer",
          fontSize: 12,
        }}
      >
        추가
      </button>
    </div>
  );
}

export default function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
}

