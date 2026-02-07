"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import StudyContentModal from "@/component/study/StudyContentModal";
import AssemblyControls from "@/component/study/AssemblyControls";
import EditToolbar from "@/component/study/EditToolbar";
import { StudyComponent, UserStudyHistory, fetchUserStudyHistories } from "@/apis/studyApi";
import { StudyTab } from "@/component/study/StudyTabBar";

const ThreeCanvas = dynamic(
  () => import("@/component/study/ThreeCanvas"),
  { ssr: false }
);

// 드론 테스트용 하드코딩 데이터
const MOCK_DRONE_HISTORIES: UserStudyHistory[] = [
  {
    userStudyHisId: 1,
    title: "Main Frame",
    updatedAt: "2024-01-15T12:00:00",
    viewInfo: { partId: 1, position: [0, 0, 0], geometry: [1.2, 0.3, 1.2], color: "#6366f1", roughnessMultiplier: 1, metalnessMultiplier: 1, envMapMultiplier: 1, roughness: 0.4, metalness: 0.6, envMapIntensity: 1 },
    ProductTypeDesc: "Drone",
    productImageUrl: "/3D Asset/Drone/조립도1.png",
  },
  {
    userStudyHisId: 2,
    title: "Arm Gear",
    updatedAt: "2024-01-14T12:00:00",
    viewInfo: { partId: 2, position: [0.5, 0, 0], geometry: [0.4, 0.4, 0.2], color: "#ef4444", roughnessMultiplier: 1, metalnessMultiplier: 1, envMapMultiplier: 1, roughness: 0.3, metalness: 0.7, envMapIntensity: 1 },
    ProductTypeDesc: "Drone",
    productImageUrl: "/3D Asset/Drone/조립도1.png",
  },
  {
    userStudyHisId: 3,
    title: "Beater Disc",
    updatedAt: "2024-01-13T12:00:00",
    viewInfo: { partId: 3, position: [0, 0.5, 0], geometry: [0.8, 0.1, 0.8], color: "#f59e0b", roughnessMultiplier: 1, metalnessMultiplier: 1, envMapMultiplier: 1, roughness: 0.5, metalness: 0.5, envMapIntensity: 1 },
    ProductTypeDesc: "Drone",
    productImageUrl: "/3D Asset/Drone/조립도1.png",
  },
  {
    userStudyHisId: 4,
    title: "Gearing",
    updatedAt: "2024-01-12T12:00:00",
    viewInfo: { partId: 4, position: [0, -0.3, 0], geometry: [0.3, 0.6, 0.3], color: "#22c55e", roughnessMultiplier: 1, metalnessMultiplier: 1, envMapMultiplier: 1, roughness: 0.3, metalness: 0.8, envMapIntensity: 1 },
    ProductTypeDesc: "Drone",
    productImageUrl: "/3D Asset/Drone/조립도1.png",
  },
  {
    userStudyHisId: 5,
    title: "Impeller Blade",
    updatedAt: "2024-01-11T12:00:00",
    viewInfo: { partId: 5, position: [0, 0.8, 0], geometry: [1.0, 0.05, 0.3], color: "#3b82f6", roughnessMultiplier: 1, metalnessMultiplier: 1, envMapMultiplier: 1, roughness: 0.2, metalness: 0.9, envMapIntensity: 1 },
    ProductTypeDesc: "Drone",
    productImageUrl: "/3D Asset/Drone/조립도1.png",
  },
  {
    userStudyHisId: 6,
    title: "Leg",
    updatedAt: "2024-01-10T12:00:00",
    viewInfo: { partId: 6, position: [0.3, -0.5, 0.3], geometry: [0.15, 0.8, 0.15], color: "#8b5cf6", roughnessMultiplier: 1, metalnessMultiplier: 1, envMapMultiplier: 1, roughness: 0.4, metalness: 0.6, envMapIntensity: 1 },
    ProductTypeDesc: "Drone",
    productImageUrl: "/3D Asset/Drone/조립도1.png",
  },
  {
    userStudyHisId: 7,
    title: "Nut",
    updatedAt: "2024-01-09T12:00:00",
    viewInfo: { partId: 7, position: [0, 0, 0], geometry: [0.2, 0.1, 0.2], color: "#ec4899", roughnessMultiplier: 1, metalnessMultiplier: 1, envMapMultiplier: 1, roughness: 0.3, metalness: 0.9, envMapIntensity: 1 },
    ProductTypeDesc: "Drone",
    productImageUrl: "/3D Asset/Drone/조립도1.png",
  },
  {
    userStudyHisId: 8,
    title: "Screw",
    updatedAt: "2024-01-08T12:00:00",
    viewInfo: { partId: 8, position: [0, 0, 0], geometry: [0.08, 0.5, 0.08], color: "#14b8a6", roughnessMultiplier: 1, metalnessMultiplier: 1, envMapMultiplier: 1, roughness: 0.2, metalness: 0.95, envMapIntensity: 1 },
    ProductTypeDesc: "Drone",
    productImageUrl: "/3D Asset/Drone/조립도1.png",
  },
];

interface StudyViewerProps {
  objectName: string;
  components: StudyComponent[];
  activeTab: StudyTab;
}

export default function StudyViewer({ objectName, components, activeTab }: StudyViewerProps) {
  const [modalOpen, setModalOpen] = useState(true);
  const [histories, setHistories] = useState<UserStudyHistory[]>(MOCK_DRONE_HISTORIES);

  useEffect(() => {
    fetchUserStudyHistories()
      .then((data) => {
        if (data.length > 0) setHistories(data);
      })
      .catch(() => {});
  }, []);

  return (
    <ViewerContainer>
      <ThreeCanvas components={components} />

      {/* 단일 부품 탭: 오른쪽 모달 */}
      {activeTab === "단일 부품" && (
        <OverlayRight>
          <StudyContentModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            objectName={objectName}
            histories={histories}
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
    </ViewerContainer>
  );
}

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
