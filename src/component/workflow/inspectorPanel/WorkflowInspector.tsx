/**
 * 워크플로우 Inspector: 선택된 노드/엣지의 속성을 편집합니다.
 */

import React from "react";
import styled from "styled-components";
import type { Edge } from "@xyflow/react";
import colors from "@/styles/constant/colors";
import { Button, Div, Input, TextArea } from "@/styles/base/BaseStyledTags";
import AddImageForm from "@/component/workflow/inspectorPanel/AddImageForm";
import AddLinkForm from "@/component/workflow/inspectorPanel/AddLinkForm";
import WorkflowAttachmentList from "./WorkflowAttachmentList";
import type { WorkflowNode, WorkflowNodeData } from "@/type/workflowTypes";
import { Font } from "@/styles/typo/typography";
import { Column } from "@/styles/base/BaseComponents";

type WorkflowInspectorProps = {
  selectedNode: WorkflowNode | null;
  selectedEdge: Edge | null;
  onUpdateNode: (patch: Partial<WorkflowNodeData>) => void;
  onUpdateEdge: (patch: Partial<Edge>) => void;
  onDeleteEdge: () => void;
};

export default function WorkflowInspector({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  onDeleteEdge,
}: WorkflowInspectorProps) {
  return (
    <Panel>
      <Font typo="label_l" color="alpha_light_90">
        Inspector
      </Font>

      {!selectedNode && !selectedEdge ? (
        <Font typo="caption_s" color="alpha_light_60">
          노드/선을 선택하면 편집할 수 있어요.
        </Font>
      ) : selectedEdge ? (
        <Column width="100%" gridGap="10px">
          <Font typo="caption_s" color="alpha_light_60">
            선 라벨
          </Font>
          <LabelInput
            value={(selectedEdge.label as string) ?? ""}
            onChange={(e) => onUpdateEdge({ label: e.target.value })}
            placeholder="예: 다음 단계"
          />
          <ActionButton type="button" onClick={onDeleteEdge}>
            선 삭제
          </ActionButton>
        </Column>
      ) : (
        <Column width="100%" gridGap="10px">
          <Font typo="caption_s" color="alpha_light_60">
            제목
          </Font>
          <LabelInput
            value={selectedNode?.data.title ?? ""}
            onChange={(e) => onUpdateNode({ title: e.target.value })}
          />

          <Font typo="caption_s" color="alpha_light_60">
            내용
          </Font>
          <ContentArea
            value={selectedNode?.data.content ?? ""}
            onChange={(e) => onUpdateNode({ content: e.target.value })}
            rows={10}
          />

          <Font typo="caption_s" color="alpha_light_60">
            첨부(메타)
          </Font>

          <Column width="100%" gridGap="15px">
            <WorkflowAttachmentList
              attachments={selectedNode?.data.attachments ?? []}
              onRemoveAttachment={(idx) => {
                const next = (selectedNode?.data.attachments ?? []).filter(
                  (_, i) => i !== idx,
                );
                onUpdateNode({ attachments: next });
              }}
            />

            <AddImageForm
              onAdd={(img) => {
                const next = [...(selectedNode?.data.attachments ?? []), img];
                onUpdateNode({ attachments: next });
              }}
            />

            <AddLinkForm
              onAdd={(link) => {
                const next = [...(selectedNode?.data.attachments ?? []), link];
                onUpdateNode({ attachments: next });
              }}
            />
          </Column>
        </Column>
      )}
    </Panel>
  );
}

const Panel = styled(Div)`
  width: 360px;
  border-left: 1px solid ${colors.alpha_light_10};
  background: ${colors.neutral_1000};
  padding: 16px;
  overflow: auto;
  color: ${colors.alpha_light_90};
`;

const LabelInput = styled(Input).attrs({ typo: "body_2" })`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${colors.alpha_light_10};
  margin-bottom: 12px;
  background: ${colors.neutral_1000};
  color: ${colors.alpha_light_90};
`;

const ContentArea = styled(TextArea).attrs({ typo: "body_2" })`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${colors.alpha_light_10};
  margin-bottom: 14px;
  background: ${colors.neutral_1000};
  color: ${colors.alpha_light_90};
`;

const ActionButton = styled(Button).attrs({ typo: "button_3" })`
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid ${colors.alpha_light_10};
  background: ${colors.neutral_1000};
  color: ${colors.alpha_light_90};
`;
