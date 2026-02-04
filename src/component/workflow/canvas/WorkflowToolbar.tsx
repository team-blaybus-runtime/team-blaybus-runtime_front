/**
 * 워크플로우 툴바: 노드 추가와 JSON 내보내기/가져오기를 제공합니다.
 */

import styled from "styled-components";
import colors from "@/styles/constant/colors";
import { Button } from "@/styles/base/BaseStyledTags";
import { CenterRow } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";

interface WorkflowToolbarProps {
  onAddNode: () => void;
  onExportJson: () => void;
}

export default function WorkflowToolbar({
  onAddNode,
  onExportJson,
}: WorkflowToolbarProps) {
  return (
    <CenterRow
      gridGap="8px"
      p="10px"
      borderRadius="12px"
      border="1px solid"
      borderColor="alpha_light_10"
      bg="alpha_dark_80"
    >
      <ToolbarButton type="button" onClick={onAddNode}>
        + 노드
      </ToolbarButton>
      <ToolbarButton type="button" onClick={onExportJson}>
        Export JSON
      </ToolbarButton>

      <Font typo="caption_s" color="alpha_light_50" p="8px">
        자동 저장됨
      </Font>
    </CenterRow>
  );
}

const ToolbarButton = styled(Button).attrs({ typo: "button_3" })`
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid ${colors.alpha_light_10};
  background: ${colors.neutral_1000};
  color: ${colors.alpha_light_90};
`;
