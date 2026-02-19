import type { Workflow } from "@/apis/workflow";

export let mockWorkflows: Workflow[] = [
  {
    id: 1,
    title: "드론 조립 워크플로우",
    nodeInfo: {
      version: 1,
      nodes: [
        {
          id: "node-1",
          type: "custom",
          position: { x: 100, y: 100 },
          data: {
            title: "메인 프레임 준비",
            content: "메인 프레임을 작업대에 고정합니다.",
            attachments: [],
            updatedAt: Date.now(),
          },
          measured: { width: 200, height: 100 },
          selected: false,
          dragging: false,
        },
        {
          id: "node-2",
          type: "custom",
          position: { x: 400, y: 100 },
          data: {
            title: "암 기어 결합",
            content: "암 기어를 프레임에 결합합니다.",
            attachments: [],
            updatedAt: Date.now(),
          },
          measured: { width: 200, height: 100 },
          selected: false,
          dragging: false,
        },
      ],
      edges: [
        {
          type: "default",
          style: { stroke: "#555", strokeWidth: 2 },
          markerEnd: { type: "arrowclosed" },
          source: "node-1",
          target: "node-2",
          label: "다음 단계",
          id: "edge-1",
        },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
      updatedAt: Date.now(),
    },
  },
];

let nextWorkflowId = 2;

export function getNextWorkflowId() {
  return nextWorkflowId++;
}

export function resetWorkflows() {
  mockWorkflows = [
    {
      id: 1,
      title: "드론 조립 워크플로우",
      nodeInfo: {
        version: 1,
        nodes: [
          {
            id: "node-1",
            type: "custom",
            position: { x: 100, y: 100 },
            data: {
              title: "메인 프레임 준비",
              content: "메인 프레임을 작업대에 고정합니다.",
              attachments: [],
              updatedAt: Date.now(),
            },
            measured: { width: 200, height: 100 },
            selected: false,
            dragging: false,
          },
          {
            id: "node-2",
            type: "custom",
            position: { x: 400, y: 100 },
            data: {
              title: "암 기어 결합",
              content: "암 기어를 프레임에 결합합니다.",
              attachments: [],
              updatedAt: Date.now(),
            },
            measured: { width: 200, height: 100 },
            selected: false,
            dragging: false,
          },
        ],
        edges: [
          {
            type: "default",
            style: { stroke: "#555", strokeWidth: 2 },
            markerEnd: { type: "arrowclosed" },
            source: "node-1",
            target: "node-2",
            label: "다음 단계",
            id: "edge-1",
          },
        ],
        viewport: { x: 0, y: 0, zoom: 1 },
        updatedAt: Date.now(),
      },
    },
  ];
  nextWorkflowId = 2;
}
