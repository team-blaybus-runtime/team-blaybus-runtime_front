"use client";

import Image from "next/image";
import styled from "styled-components";
import { Row } from "@/styles/base/BaseComponents";
import colors from "@/styles/constant/colors";
import { useEditStore, EditTool } from "@/store/useEditStore";
import { Font } from "@/styles/typo/typography";

const TOOLS: { id: EditTool; icon: string }[] = [
  { id: "select", icon: "/icons/study/Select.svg" },
  { id: "transform", icon: "/icons/study/Transform.svg" },
  { id: "zoomIn", icon: "/icons/study/ZoomIn.svg" },
  { id: "zoomOut", icon: "/icons/study/ZoomOut.svg" },
  { id: "focus", icon: "/icons/study/Focus.svg" },
  { id: "undo", icon: "/icons/study/Undo.svg" },
  { id: "redo", icon: "/icons/study/Redo.svg" },
];

const PERSISTENT_TOOLS: EditTool[] = ["select", "transform"];

export default function EditToolbar() {
  const { activeTool, setActiveTool, transformMode } = useEditStore();

  return (
    <ToolbarContainer>
      {TOOLS.map((tool) => {
        const isActive = PERSISTENT_TOOLS.includes(tool.id) && activeTool === tool.id;
        return (
          <ToolButton
            key={tool.id}
            $active={isActive}
            onClick={() => setActiveTool(tool.id)}
          >
            <Image src={tool.icon} alt={tool.id} width={20} height={20} />
            {tool.id === "transform" && isActive && (
              <ModeBadge>
                <Font typo="caption_m" color={colors.neutral_0}>
                  {transformMode === "translate" ? "이동" : "회전"}
                </Font>
              </ModeBadge>
            )}
          </ToolButton>
        );
      })}
    </ToolbarContainer>
  );
}

const ToolbarContainer = styled(Row)`
  background-color: ${colors.neutral_1000};
  border-radius: 14px;
  padding: 6px;
  gap: 4px;
`;

const ModeBadge = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  background-color: ${colors.blue_500};
  border-radius: 4px;
  padding: 0 3px;
  line-height: 14px;
  pointer-events: none;
`;

const ToolButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${({ $active }) => ($active ? colors.blue_700 : colors.neutral_900)};
  transition: background-color 0.15s;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? colors.blue_700 : colors.neutral_800};
  }
`;
