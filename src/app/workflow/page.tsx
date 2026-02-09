"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { ReactFlowProvider } from "@xyflow/react";
import WorkflowList from "@/component/workflow/WorkflowList";
import WorkflowCanvas from "@/component/workflow/WorkflowCanvas";
import { getDefaultNodeInfo } from "@/component/workflow/utils/workflowConversion";
import { useFetchWorkflowsQuery } from "@/queries/workflow/useFetchWorkflowsQuery";
import { useCreateWorkflowMutation } from "@/queries/workflow/useCreateWorkflowMutation";
import { useDeleteWorkflowMutation } from "@/queries/workflow/useDeleteWorkflowMutation";
import { Div } from "@/styles/base/BaseStyledTags";
import colors from "@/styles/constant/colors";
import type { Workflow } from "@/apis/workflow";

export default function WorkflowPage() {
  const { data: workflows = [], isLoading } = useFetchWorkflowsQuery();
  const createMutation = useCreateWorkflowMutation();
  const deleteMutation = useDeleteWorkflowMutation();

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const selectedWorkflow = workflows.find((w) => w.id === selectedWorkflowId);

  const handleSelect = useCallback((workflow: Workflow) => {
    setSelectedWorkflowId(workflow.id);
  }, []);

  const handleCreate = useCallback(() => {
    const defaultNodeInfo = getDefaultNodeInfo();
    createMutation.mutate(
      { title: "제목 없음", nodeInfo: defaultNodeInfo },
      {
        onSuccess: (data) => {
          setSelectedWorkflowId(data.id);
        },
      },
    );
  }, [createMutation]);

  const handleDelete = useCallback(
    (workflowId: number) => {
      setDeletingId(workflowId);
      deleteMutation.mutate(
        { workflowId },
        {
          onSuccess: () => {
            if (selectedWorkflowId === workflowId) {
              setSelectedWorkflowId(null);
            }
          },
          onSettled: () => {
            setDeletingId(null);
          },
        },
      );
    },
    [deleteMutation, selectedWorkflowId],
  );

  return (
    <PageLayout>
      <ReactFlowProvider>
        <WorkflowList
          workflows={workflows}
          selectedId={selectedWorkflowId}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onDelete={handleDelete}
          isCreating={createMutation.isPending}
          isDeletingId={deletingId}
        />
        <MainArea>
          {isLoading ? (
            <EmptyMessage>로딩 중...</EmptyMessage>
          ) : selectedWorkflow ? (
            <WorkflowCanvas workflow={selectedWorkflow} />
          ) : (
            <EmptyMessage>
              왼쪽에서 워크플로우를 선택하거나 새 워크플로우를 만들어 보세요.
            </EmptyMessage>
          )}
        </MainArea>
      </ReactFlowProvider>
    </PageLayout>
  );
}

const PageLayout = styled(Div)`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
`;

const MainArea = styled.div`
  flex: 1;
  min-width: 0;
  height: 100%;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
  text-align: center;
  color: ${colors.alpha_light_50};
  font-size: 14px;
`;
