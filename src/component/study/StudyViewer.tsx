"use client";

import { useEffect, useMemo, useState, useCallback, memo } from "react";
import type { RefObject } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import colors from "@/styles/constant/colors";
import StudyContentModal from "@/component/study/StudyContentModal";
import AssemblyControls from "@/component/study/AssemblyControls";
import EditToolbar from "@/component/study/EditToolbar";
import SimulatorControls from "@/component/study/SimulatorControls";
import SimulatorSettingsPanel, {
  SimulatorPanel,
} from "@/component/study/SimulatorSettingsPanel";
import { EngineeringPart, fetchEngineeringParts } from "@/apis/engineering";
import { ViewInfo } from "@/apis/study";
import { getAssemblyInstances } from "@/data/assemblyInstances";
import { StudyTab } from "@/component/study/StudyTabBar";
import { useEditStore } from "@/store/useEditStore";
import { useModelStore } from "@/store/useModelStore";

const ThreeCanvas = dynamic(() => import("@/component/study/ThreeCanvas"), {
  ssr: false,
});

const normalizeProductType = (value: string) =>
  value.toLowerCase().replace(/[\s-_]/g, "");

interface StudyViewerProps {
  productType: string;
  objectName: string;
  activeTab: StudyTab;
  viewerRef?: RefObject<HTMLDivElement | null>;
  viewInfo?: ViewInfo;
}

const StudyViewer = ({
  productType,
  objectName,
  activeTab,
  viewerRef,
  viewInfo,
}: StudyViewerProps) => {
  const [parts, setParts] = useState<EngineeringPart[]>([]);
  const [simPanel, setSimPanel] = useState<SimulatorPanel | null>(null);
  const resetEditState = useEditStore((s) => s.resetEditState);
  const setExplodeLevel = useModelStore((s) => s.setExplodeLevel);

  // 탭 변경 시 편집 상태 초기화
  useEffect(() => {
    if (activeTab !== "편집") {
      resetEditState();
    }
  }, [activeTab, resetEditState]);

  // 탭 변경 시 분해도 초기화 (조립도 진입/이탈 모두)
  useEffect(() => {
    setExplodeLevel(0);
  }, [activeTab, productType, parts.length, setExplodeLevel]);

  useEffect(() => {
    if (!productType) return;
    fetchEngineeringParts(productType)
      .then(setParts)
      .catch(() => { });
  }, [productType]);

  // API 응답 → 3D 뷰어용 컴포넌트 변환
  const components = useMemo(() => {
    return parts.map((part, i) => ({
      componentId: `part-${i}`,
      componentName: part.partName,
      glbUrl: part.assetUrl,
    }));
  }, [parts]);

  const assemblyInstances = useMemo(() => {
    return getAssemblyInstances(productType, components);
  }, [productType, components]);

  return (
    <ViewerContainer ref={viewerRef}>
      <ThreeCanvas
        components={components}
        viewInfo={viewInfo}
        productType={productType}
        activeTab={activeTab}
        assemblyInstances={assemblyInstances}
      />

      {/* 단일 부품 탭: 오른쪽 모달 */}
      {activeTab === "단일 부품" && (
        <OverlayRight>
          <StudyContentModal objectName={objectName} parts={parts} />
        </OverlayRight>
      )}

      {/* 조립도 탭: 하단 중앙 컨트롤 */}
      {activeTab === "조립도" && (
        <OverlayBottom>
          <AssemblyControls />
        </OverlayBottom>
      )}

      {/* 편집 탭: 하단 중앙 편집 툴바 */}
      {activeTab === "편집" && (
        <OverlayBottom>
          <EditToolbar />
        </OverlayBottom>
      )}

      {/* 좌측 상단 설정 패널: 항상 표시 */}
      <OverlayTopLeft>
        <SimulatorSettingsPanel
          activePanel={simPanel}
          onPanelChange={setSimPanel}
          components={components}
        />
      </OverlayTopLeft>

      {/* 시뮬레이터 탭: 하단 중앙 타임라인 */}
      {activeTab === "시뮬레이터" && (
        <OverlayBottom>
          <SimulatorControls />
        </OverlayBottom>
      )}

      {/* 우측 하단 조작 도움말 */}
      <OverlayBottomRight>
        <ViewerHelpTooltip />
      </OverlayBottomRight>
    </ViewerContainer>
  );
};

function ViewerHelpTooltip() {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <HelpWrapper>
      {open && (
        <HelpPanel>
          <HelpRow>
            <Kbd>좌클릭</Kbd><span>드래그</span>
            <HelpDesc>시야 회전</HelpDesc>
          </HelpRow>
          <HelpRow>
            <Kbd>휠클릭</Kbd><span>드래그</span>
            <HelpDesc>위치 이동</HelpDesc>
          </HelpRow>
          <HelpRow>
            <Kbd>우클릭</Kbd><span>드래그</span>
            <HelpDesc>위치 이동</HelpDesc>
          </HelpRow>
          <HelpDivider />
          <HelpRow>
            <Kbd>휠</Kbd><span>스크롤</span>
            <HelpDesc>줌 인 / 아웃</HelpDesc>
          </HelpRow>
          <HelpRow>
            <Kbd>Shift</Kbd><span>+</span><Kbd>휠</Kbd>
            <HelpDesc>분해도 조절 (조립도)</HelpDesc>
          </HelpRow>
        </HelpPanel>
      )}
      <HelpButton onClick={toggle} title="조작법 도움말">
        ?
      </HelpButton>
    </HelpWrapper>
  );
}

export default memo(StudyViewer);

const ViewerContainer = styled(Column)`
  flex: 1;
  min-height: 0;
  position: relative;
  background-color: #2b2b2b;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
`;

const OverlayRight = styled(Column)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 12px;
  align-items: flex-end;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;

  & > * {
    pointer-events: auto;
  }
`;

const OverlayTopLeft = styled(Column)`
  position: absolute;
  top: 12px;
  left: 12px;
  pointer-events: none;
  z-index: 1;

  & > * {
    pointer-events: auto;
  }
`;

const OverlayBottom = styled(Column)`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 1;

  & > * {
    pointer-events: auto;
  }
`;

const OverlayBottomRight = styled(Column)`
  position: absolute;
  bottom: 12px;
  right: 12px;
  pointer-events: none;
  z-index: 1;
  align-items: flex-end;

  & > * {
    pointer-events: auto;
  }
`;

/* ─── Help Tooltip ─── */

const HelpWrapper = styled(Column)`
  align-items: flex-end;
  gap: 8px;
`;

const HelpButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${colors.neutral_700};
  background: ${colors.neutral_1000};
  color: ${colors.neutral_400};
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.15s, border-color 0.15s, color 0.15s;

  &:hover {
    opacity: 1;
    border-color: ${colors.neutral_500};
    color: ${colors.neutral_0};
  }
`;

const HelpPanel = styled(Column)`
  background: ${colors.neutral_1000};
  border: 1px solid ${colors.neutral_800};
  border-radius: 12px;
  padding: 14px 16px;
  gap: 8px;
  min-width: 240px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
`;

const HelpRow = styled(Row)`
  align-items: center;
  gap: 6px;
  font-family: "Pretendard", sans-serif;
  font-size: 12px;
  color: ${colors.neutral_500};
  white-space: nowrap;
`;

const HelpDesc = styled.span`
  margin-left: auto;
  color: ${colors.neutral_300};
  font-weight: 500;
`;

const Kbd = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  min-width: 22px;
  height: 20px;
  background: ${colors.neutral_900};
  border: 1px solid ${colors.neutral_700};
  border-radius: 4px;
  font-family: "Pretendard", sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: ${colors.neutral_200};
  line-height: 1;
`;

const HelpDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${colors.neutral_800};
`;
