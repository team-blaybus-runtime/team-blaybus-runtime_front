import { http, HttpResponse } from "msw";
import { mockWorkflows, getNextWorkflowId } from "@/mocks/data/workflow";
import type { CreateOrUpdateWorkflowRequest } from "@/apis/workflow";

export const workflowHandlers = [
  http.get("*/workflows", () => {
    return HttpResponse.json(mockWorkflows);
  }),

  http.post("*/workflows", async ({ request }) => {
    const body = (await request.json()) as CreateOrUpdateWorkflowRequest;

    const newWorkflow = {
      id: getNextWorkflowId(),
      title: body.title,
      nodeInfo: body.nodeInfo,
    };

    mockWorkflows.push(newWorkflow);
    return HttpResponse.json(newWorkflow, { status: 201 });
  }),

  http.put("*/workflows/:workflowId", async ({ params, request }) => {
    const workflowId = Number(params.workflowId);
    const body = (await request.json()) as CreateOrUpdateWorkflowRequest;
    const workflow = mockWorkflows.find((w) => w.id === workflowId);

    if (!workflow) {
      return new HttpResponse(null, { status: 404 });
    }

    workflow.title = body.title;
    workflow.nodeInfo = body.nodeInfo;

    return HttpResponse.json(workflow);
  }),

  http.delete("*/workflows/:workflowId", ({ params }) => {
    const workflowId = Number(params.workflowId);
    const index = mockWorkflows.findIndex((w) => w.id === workflowId);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockWorkflows.splice(index, 1);
    return new HttpResponse(null, { status: 200 });
  }),
];
