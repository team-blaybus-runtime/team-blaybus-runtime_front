"use client";

import { Suspense, useCallback, useState } from "react";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactFlowProvider } from "@xyflow/react";
import WorkflowList from "@/component/workflow/WorkflowList";
import WorkflowCanvas from "@/component/workflow/WorkflowCanvas";
import CreateWorkflowModal from "@/component/workflow/CreateWorkflowModal";
import { getDefaultNodeInfo } from "@/utils/workflowConversion";
import { useFetchWorkflowsQuery } from "@/queries/workflow/useFetchWorkflowsQuery";
import { useCreateWorkflowMutation } from "@/queries/workflow/useCreateWorkflowMutation";
import { useDeleteWorkflowMutation } from "@/queries/workflow/useDeleteWorkflowMutation";
import { Div } from "@/styles/base/BaseStyledTags";
import colors from "@/styles/constant/colors";
import type { Workflow } from "@/apis/workflow";

function getInitialSelectedId(
  searchParams: ReturnType<typeof useSearchParams>,
) {
  const id = searchParams.get("id");
  if (id == null) return null;
  const num = parseInt(id, 10);
  return Number.isNaN(num) ? null : num;
}

function WorkflowPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: workflows = [], isLoading } = useFetchWorkflowsQuery();
  const createMutation = useCreateWorkflowMutation();
  const deleteMutation = useDeleteWorkflowMutation();

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(
    () => getInitialSelectedId(searchParams),
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const selectedWorkflow = workflows.find((w) => w.id === selectedWorkflowId);

  const handleSelect = useCallback(
    (workflow: Workflow) => {
      setSelectedWorkflowId(workflow.id);
      router.replace(`/workflow?id=${workflow.id}`, { scroll: false });
    },
    [router],
  );

  const handleOpenCreateModal = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleCreateWithTitle = useCallback(
    (title: string) => {
      const defaultNodeInfo = getDefaultNodeInfo();
      createMutation.mutate(
        { title, nodeInfo: defaultNodeInfo },
        {
          onSuccess: (data) => {
            setCreateModalOpen(false);
            setSelectedWorkflowId(data.id);
            router.replace(`/workflow?id=${data.id}`, { scroll: false });
          },
        },
      );
    },
    [createMutation, router],
  );

  const handleDelete = useCallback(
    (workflowId: number) => {
      setDeletingId(workflowId);
      deleteMutation.mutate(
        { workflowId },
        {
          onSuccess: () => {
            if (selectedWorkflowId === workflowId) {
              setSelectedWorkflowId(null);
              router.replace("/workflow", { scroll: false });
            }
          },
          onSettled: () => {
            setDeletingId(null);
          },
        },
      );
    },
    [deleteMutation, router, selectedWorkflowId],
  );

  return (
    <ScrollWrapper>
      <PageLayout>
        <ReactFlowProvider>
          <CreateWorkflowModal
            open={createModalOpen}
            isCreating={createMutation.isPending}
            onCreate={handleCreateWithTitle}
            onClose={() => setCreateModalOpen(false)}
          />
          <WorkflowList
            workflows={workflows}
            selectedId={selectedWorkflowId}
            onSelect={handleSelect}
            onCreate={handleOpenCreateModal}
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
    </ScrollWrapper>
  );
}

export default function WorkflowPage() {
  return (
    <Suspense fallback={<WorkflowPageFallback />}>
      <WorkflowPageContent />
    </Suspense>
  );
}

function WorkflowPageFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: colors.alpha_light_50,
        fontSize: 14,
      }}
    >
      로딩 중...
    </div>
  );
}

const ScrollWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  overflow-y: hidden;
`;

const PageLayout = styled(Div)`
  display: flex;
  min-width: 1280px;
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1;
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
