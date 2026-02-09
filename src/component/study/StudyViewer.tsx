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
import SimulatorSettingsPanel, { SimulatorPanel } from "@/component/study/SimulatorSettingsPanel";
import { EngineeringPart, fetchEngineeringParts } from "@/apis/engineering";
import { StudyTab } from "@/component/study/StudyTabBar";

const ThreeCanvas = dynamic(
  () => import("@/component/study/ThreeCanvas"),
  { ssr: false }
);

interface StudyViewerProps {
  productType: string;
  objectName: string;
  activeTab: StudyTab;
  viewerRef?: RefObject<HTMLDivElement | null>;
}

const StudyViewer = ({
  productType,
  objectName,
  activeTab,
  viewerRef,
}: StudyViewerProps) => {
  const [parts, setParts] = useState<EngineeringPart[]>([]);
  const [simPanel, setSimPanel] = useState<SimulatorPanel | null>(null);

  useEffect(() => {
    if (!productType) return;
    fetchEngineeringParts(productType)
      .then(setParts)
      .catch(() => {});
  }, [productType]);

  // API 응답 → 3D 뷰어용 컴포넌트 변환 (assetUrl = GLB URL)
  const components = useMemo(
    () =>
      parts.map((part, i) => ({
        componentId: `part-${i}`,
        componentName: part.partName,
        glbUrl: part.assetUrl,
      })),
    [parts]
  );

  return (
    <ViewerContainer ref={viewerRef}>
      <ThreeCanvas components={components} />

      {/* 단일 부품 탭: 오른쪽 모달 */}
      {activeTab === "단일 부품" && (
        <OverlayRight>
          <StudyContentModal
            objectName={objectName}
            parts={parts}
          />
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
