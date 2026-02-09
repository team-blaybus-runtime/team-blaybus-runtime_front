/**
 * 워크플로우 Inspector: 선택된 노드/엣지의 속성을 편집합니다.
 * 다크 테마 사이드바 (이미지 참고 디자인)
 */

import React from "react";
import styled from "styled-components";
import type { Edge } from "@xyflow/react";
import colors from "@/styles/constant/colors";
import { Button, Div, Input, TextArea } from "@/styles/base/BaseStyledTags";
import AddImageForm from "@/component/workflow/inspectorPanel/AddImageForm";
import AddLinkForm from "@/component/workflow/inspectorPanel/AddLinkForm";
import type { WorkflowNode, WorkflowNodeData } from "@/type/workflowTypes";
import type { Attachment } from "@/type/workflowTypes";
import { Column } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";

const SIDEBAR_BG_TOP = "#151515";
const SIDEBAR_BG_BOTTOM = "#101010";

const FIELD_BG = "#2A2A2A"; // 제목/내용 input 배경
const CARD_BG = "#262626"; // 사진/링크 섹션 카드 배경
const CONTROL_BG = "#3A3A3A"; // 버튼(이미지 선택/추가) 배경
const BORDER = "rgba(255,255,255,0.08)";

type WorkflowInspectorProps = {
  selectedNode: WorkflowNode | null;
  selectedEdge: Edge | null;
  onUpdateNode: (patch: Partial<WorkflowNodeData>) => void;
  onUpdateEdge: (patch: Partial<Edge>) => void;
  onDeleteEdge: () => void;
  onSave?: () => void;
  isSaving?: boolean;
};

export default function WorkflowInspector({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  onDeleteEdge,
  onSave,
  isSaving = false,
}: WorkflowInspectorProps) {
  const attachments = selectedNode?.data.attachments ?? [];
  const imageAttachments = attachments.filter(
    (a): a is Attachment & { type: "image" } => a.type === "image",
  );
  const linkAttachments = attachments.filter(
    (a): a is Attachment & { type: "link" } => a.type === "link",
  );

  const removeImageAt = (imageIndex: number) => {
    let n = 0;
    const globalIdx = attachments.findIndex((a) => {
      if (a.type !== "image") return false;
      if (n === imageIndex) return true;
      n++;
      return false;
    });
    if (globalIdx === -1) return;
    const next = attachments.filter((_, i) => i !== globalIdx);
    onUpdateNode({ attachments: next });
  };

  const removeLinkAt = (linkIndex: number) => {
    let n = 0;
    const globalIdx = attachments.findIndex((a) => {
      if (a.type !== "link") return false;
      if (n === linkIndex) return true;
      n++;
      return false;
    });
    if (globalIdx === -1) return;
    const next = attachments.filter((_, i) => i !== globalIdx);
    onUpdateNode({ attachments: next });
  };

  const showSaveInPanel = selectedNode && !selectedEdge && onSave;

  return (
    <Panel>
      <ScrollContent>
        <Font typo="title_3" color="neutral_0">
          Inspector
        </Font>

        {!selectedNode && !selectedEdge ? (
          <Font typo="label_s" color="neutral_500">
            노드/선을 선택하면 편집할 수 있어요.
          </Font>
        ) : selectedEdge ? (
          <Column width="100%" gridGap="14px">
            <Font typo="label_s" color="neutral_500">
              선 라벨
            </Font>
            <StyledInput
              value={(selectedEdge.label as string) ?? ""}
              onChange={(e) => onUpdateEdge({ label: e.target.value })}
              placeholder="예: 다음 단계"
            />
            <DangerButton type="button" onClick={onDeleteEdge}>
              선 삭제
            </DangerButton>
          </Column>
        ) : (
          <Column width="100%" gridGap="20px">
            <Section>
              <Font typo="label_s" color="neutral_500">
                제목
              </Font>
              <StyledInput
                value={selectedNode?.data.title ?? ""}
                onChange={(e) => onUpdateNode({ title: e.target.value })}
                placeholder="새 노드"
              />
            </Section>

            <Section>
              <Font typo="label_s" color="neutral_500">
                내용
              </Font>
              <StyledTextarea
                value={selectedNode?.data.content ?? ""}
                onChange={(e) => onUpdateNode({ content: e.target.value })}
                placeholder="내용을 입력하세요."
                rows={7}
              />
            </Section>

            <Section>
              <Font typo="label_s" color="neutral_0">
                이미지
              </Font>
              <CardStack>
                <Column width="100%" gridGap="15px">
                  {imageAttachments.length > 0 && (
                    <Card>
                      <Column width="100%" gridGap="12px">
                        {imageAttachments.map((a, idx) => (
                          <AttachmentItem key={`img-${idx}`}>
                            <ImagePreview src={a.dataUrl} alt={a.name} />
                            <MetaText>
                              {a.name}
                              {typeof a.size === "number"
                                ? ` (${(a.size / 1024).toFixed(1)}KB)`
                                : ""}
                            </MetaText>
                            <FullWidthButton
                              type="button"
                              onClick={() => removeImageAt(idx)}
                            >
                              제거
                            </FullWidthButton>
                          </AttachmentItem>
                        ))}
                      </Column>
                    </Card>
                  )}
                </Column>
                <Card>
                  <AddImageForm
                    onAdd={(img) => {
                      const next = [
                        ...(selectedNode?.data.attachments ?? []),
                        img,
                      ];
                      onUpdateNode({ attachments: next });
                    }}
                  />
                </Card>
              </CardStack>
            </Section>

            <Section>
              <Font typo="label_s" color="neutral_0">
                링크
              </Font>
              <CardStack>
                <Column width="100%" gridGap="15px">
                  {linkAttachments.length > 0 && (
                    <Card>
                      <Column width="100%" gridGap="12px">
                        {linkAttachments.map((a, idx) => (
                          <LinkItem key={`link-${idx}`}>
                            <Font typo="caption_s" color="neutral_500" p="14px">
                              {a.title ? `${a.title} · ` : ""}
                              {a.url}
                            </Font>
                            <FullWidthButton
                              type="button"
                              onClick={() => removeLinkAt(idx)}
                            >
                              제거
                            </FullWidthButton>
                          </LinkItem>
                        ))}
                      </Column>
                    </Card>
                  )}
                </Column>
                <Card>
                  <AddLinkForm
                    onAdd={(link) => {
                      const next = [
                        ...(selectedNode?.data.attachments ?? []),
                        link,
                      ];
                      onUpdateNode({ attachments: next });
                    }}
                  />
                </Card>
              </CardStack>
            </Section>
          </Column>
        )}
      </ScrollContent>

      {showSaveInPanel && (
        <SaveFooter>
          <InspectorSaveButton
            type="button"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? "저장 중..." : "저장하기"}
          </InspectorSaveButton>
        </SaveFooter>
      )}
    </Panel>
  );
}

const Panel = styled(Column)`
  width: 360px;
  min-width: 360px;
  max-height: 100vh;
  overflow: hidden;
  overscroll-behavior-y: contain;
`;

const ScrollContent = styled(Column)`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  gap: 24px;
`;

const SaveFooter = styled.div`
  flex-shrink: 0;
  padding: 16px 20px;
  border-top: 1px solid ${BORDER};
  background: ${SIDEBAR_BG_BOTTOM};
`;

const InspectorSaveButton = styled(Button)`
  width: 100%;
  height: 48px;
  border-radius: 10px;
  border: none;
  background: ${colors.blue_600};
  color: ${colors.white};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${colors.blue_500};
    filter: brightness(1.05);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Section = styled(Column)`
  gap: 6px;
  padding: 9px 0px;
`;

const StyledInput = styled(Input).attrs({ typo: "caption_s" })`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border-radius: 8px;
  background: ${colors.neutral_900};
  color: ${colors.neutral_0};

  outline: none;

  &::placeholder {
    color: ${colors.neutral_500};
  }
`;

const StyledTextarea = styled(TextArea)`
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${BORDER};
  background: ${FIELD_BG};
  color: ${colors.white};
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  min-height: 170px;
  outline: none;

  &::placeholder {
    color: ${colors.alpha_light_50};
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.16);
  }
`;

const CardStack = styled(Column)`
  width: 100%;
  gap: 15px;
`;

const Card = styled(Div)`
  width: 100%;
  background: ${colors.neutral_900};
  border-radius: 8px;
  padding: 8px 22px;
`;

const AttachmentItem = styled(Column)`
  gap: 10px;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: 12px;
  border: 1px solid ${BORDER};
  background: rgba(0, 0, 0, 0.18);
`;

const MetaText = styled.span`
  font-size: 12px;
  color: ${colors.alpha_light_80};
  word-break: break-word;
`;

const LinkItem = styled(Column)`
  gap: 12px;
`;

const FullWidthButton = styled(Button)`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: ${colors.neutral_800};
  color: ${colors.neutral_0};
`;

const DangerButton = styled(Button)`
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 1px solid ${BORDER};
  background: ${CONTROL_BG};
  color: ${colors.alpha_light_90};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    filter: brightness(1.05);
  }
`;
