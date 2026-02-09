"use client";

import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import { Button, Div } from "@/styles/base/BaseStyledTags";
import colors from "@/styles/constant/colors";
import { Font } from "@/styles/typo/typography";
import type { Workflow } from "@/apis/workflow";

interface WorkflowListProps {
  workflows: Workflow[];
  selectedId: number | null;
  onSelect: (workflow: Workflow) => void;
  onCreate: () => void;
  onDelete: (workflowId: number) => void;
  isCreating?: boolean;
  isDeletingId?: number | null;
}

export default function WorkflowList({
  workflows,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  isCreating = false,
  isDeletingId = null,
}: WorkflowListProps) {
  return (
    <ListLayout>
      <ListHeader>
        <Font typo="title_3" color="alpha_light_90">
          워크플로우
        </Font>
        <CreateButton type="button" onClick={onCreate} disabled={isCreating}>
          + 새 워크플로우
        </CreateButton>
      </ListHeader>
      <ListScroll>
        {workflows.length === 0 ? (
          <EmptyState>
            <Font typo="body_2" color="alpha_light_50">
              워크플로우가 없습니다.
            </Font>
            <Font typo="caption_s" color="alpha_light_40">
              새 워크플로우를 만들어 보세요.
            </Font>
          </EmptyState>
        ) : (
          workflows.map((w) => (
            <ListItem
              key={w.id}
              $selected={selectedId === w.id}
              onClick={() => onSelect(w)}
            >
              <ItemTitle title={w.title}>{w.title || "제목 없음"}</ItemTitle>
              <DeleteBtn
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(w.id);
                }}
                disabled={isDeletingId === w.id}
                aria-label="삭제"
              >
                ×
              </DeleteBtn>
            </ListItem>
          ))
        )}
      </ListScroll>
    </ListLayout>
  );
}

const ListLayout = styled(Column)`
  width: 240px;
  min-width: 240px;
  height: 100%;
  border-right: 1px solid ${colors.alpha_light_10};
  background: ${colors.neutral_1000};
`;

const ListHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid ${colors.alpha_light_10};
`;

const CreateButton = styled(Button)`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${colors.alpha_light_20};
  background: ${colors.alpha_dark_80};
  color: ${colors.alpha_light_90};
  font-size: 14px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${colors.alpha_light_10};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ListScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

const EmptyState = styled(Column).attrs({ gridGap: "4px", p: "24px 16px" })`
  align-items: center;
  text-align: center;
`;

const ListItem = styled(Div)<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 16px;
  margin: 0 8px 4px;
  border-radius: 10px;
  cursor: pointer;
  background: ${(p) => (p.$selected ? colors.alpha_light_10 : "transparent")};
`;

const ItemTitle = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: ${colors.alpha_light_80};
`;

const DeleteBtn = styled.button`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: ${colors.alpha_light_50};
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${colors.alpha_light_10};
    color: ${colors.alpha_light_90};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
