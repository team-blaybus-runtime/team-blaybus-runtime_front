"use client";

import { useEffect, useMemo, useState, memo } from "react";
import type { RefObject } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
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

  // 조립도 탭 기본은 조립 상태(0)로 시작 (제품/부품 변경 시에도 리셋)
  useEffect(() => {
    if (activeTab === "조립도") {
      setExplodeLevel(0);
    }
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
    </ViewerContainer>
  );
};

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
