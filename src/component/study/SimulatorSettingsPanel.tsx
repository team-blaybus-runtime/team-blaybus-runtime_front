"use client";

import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import colors from "@/styles/constant/colors";
import { ShaderSettingsPanel, MeshListPanel, AssetUploadPanel } from "@/component/study/SettingsSubPanels";
import { StudyComponent } from "@/apis/studyApi";

export type SimulatorPanel = "쉐이더 설정" | "메쉬 목록" | "에셋 업로드";

const PANELS: SimulatorPanel[] = ["쉐이더 설정", "메쉬 목록", "에셋 업로드"];

interface SimulatorSettingsPanelProps {
  activePanel: SimulatorPanel | null;
  onPanelChange: (panel: SimulatorPanel | null) => void;
  components: StudyComponent[];
}

export default function SimulatorSettingsPanel({
  activePanel,
  onPanelChange,
  components,
}: SimulatorSettingsPanelProps) {
  return (
    <Wrapper>
      <MenuContainer>
        {PANELS.map((panel) => (
          <PanelButton
            key={panel}
            $active={activePanel === panel}
            onClick={() => onPanelChange(activePanel === panel ? null : panel)}
          >
            {panel}
          </PanelButton>
        ))}
      </MenuContainer>

      {activePanel === "쉐이더 설정" && <ShaderSettingsPanel />}
      {activePanel === "메쉬 목록" && <MeshListPanel components={components} />}
      {activePanel === "에셋 업로드" && <AssetUploadPanel />}
    </Wrapper>
  );
}

const Wrapper = styled(Column)`
  gap: 8px;
`;

const MenuContainer = styled(Column)`
  background-color: ${colors.neutral_900};
  border-radius: 16px;
  padding: 9px 10px;
  gap: 16px;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
`;

const PanelButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? colors.blue_700 : "transparent")};
  color: ${({ $active }) => ($active ? colors.neutral_0 : colors.neutral_500)};
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  white-space: nowrap;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    color: ${colors.neutral_0};
  }
`;
