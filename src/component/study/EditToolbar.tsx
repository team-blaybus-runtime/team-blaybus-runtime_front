"use client";

import styled from "styled-components";
import { Row } from "@/styles/base/BaseComponents";
import colors from "@/styles/constant/colors";
import { useEditStore, EditTool } from "@/store/useEditStore";

const TOOLS: { id: EditTool; icon: React.ReactNode }[] = [
  { id: "select", icon: <SelectIcon /> },
  { id: "pan", icon: <PanIcon /> },
  { id: "zoomIn", icon: <ZoomInIcon /> },
  { id: "zoomOut", icon: <ZoomOutIcon /> },
  { id: "focus", icon: <FocusIcon /> },
  { id: "undo", icon: <UndoIcon /> },
  { id: "redo", icon: <RedoIcon /> },
];

const PERSISTENT_TOOLS: EditTool[] = ["select", "pan"];

export default function EditToolbar() {
  const { activeTool, setActiveTool } = useEditStore();

  return (
    <ToolbarContainer>
      {TOOLS.map((tool) => (
        <ToolButton
          key={tool.id}
          $active={PERSISTENT_TOOLS.includes(tool.id) && activeTool === tool.id}
          onClick={() => setActiveTool(tool.id)}
        >
          {tool.icon}
        </ToolButton>
      ))}
    </ToolbarContainer>
  );
}

function SelectIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 2L4 15L8 11L12 18L14 17L10 10L15 10L4 2Z" fill="currentColor" />
    </svg>
  );
}

function PanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2V6M10 14V18M2 10H6M14 10H18M10 2L8 4M10 2L12 4M10 18L8 16M10 18L12 16M2 10L4 8M2 10L4 12M18 10L16 8M18 10L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ZoomInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 6.5V11.5M6.5 9H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ZoomOutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 9H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FocusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2V5M10 15V18M2 10H5M15 10H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 8H13C15.2091 8 17 9.79086 17 12C17 14.2091 15.2091 16 13 16H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 5L4 8L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16 8H7C4.79086 8 3 9.79086 3 12C3 14.2091 4.79086 16 7 16H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 5L16 8L13 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ToolbarContainer = styled(Row)`
  background-color: ${colors.neutral_1000};
  border-radius: 14px;
  padding: 6px;
  gap: 4px;
`;

const ToolButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: ${({ $active }) => ($active ? colors.neutral_0 : colors.neutral_400)};
  background-color: ${({ $active }) => ($active ? colors.blue_700 : colors.neutral_900)};
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? colors.blue_700 : colors.neutral_800};
    color: ${colors.neutral_0};
  }
`;
