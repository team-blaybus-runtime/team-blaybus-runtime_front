/**
 * 워크플로우 툴바: 노드 추가, 저장하기(강조)
 */

import styled from "styled-components";
import colors from "@/styles/constant/colors";
import { Button } from "@/styles/base/BaseStyledTags";
import { CenterRow } from "@/styles/base/BaseComponents";

interface WorkflowToolbarProps {
  onAddNode: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function WorkflowToolbar({
  onAddNode,
  onSave,
  isSaving = false,
}: WorkflowToolbarProps) {
  return (
    <CenterRow
      gridGap="10px"
      p="10px"
      borderRadius="12px"
      border="1px solid"
      borderColor="alpha_light_10"
      bg="alpha_dark_80"
    >
      <ToolbarButton type="button" onClick={onAddNode}>
        + 노드
      </ToolbarButton>
      <SaveButton type="button" onClick={onSave} disabled={isSaving}>
        {isSaving ? "저장 중..." : "저장하기"}
      </SaveButton>
    </CenterRow>
  );
}

const ToolbarButton = styled(Button).attrs({ typo: "button_3" })`
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid ${colors.alpha_light_10};
  background: ${colors.neutral_1000};
  color: ${colors.alpha_light_90};
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button).attrs({ typo: "button_3" })`
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: ${colors.blue_600};
  color: ${colors.white};
  font-weight: 600;
  &:hover:not(:disabled) {
    background: ${colors.blue_500};
    filter: brightness(1.05);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
