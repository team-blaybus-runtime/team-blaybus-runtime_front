"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import StudyContentModal from "@/component/study/StudyContentModal";
import { StudyComponent } from "@/apis/studyApi";

const ThreeCanvas = dynamic(
  () => import("@/component/study/ThreeCanvas"),
  { ssr: false }
);

interface StudyViewerProps {
  components: StudyComponent[];
}

export default function StudyViewer({ components }: StudyViewerProps) {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <ViewerContainer>
      <ThreeCanvas components={components} />
      <OverlayContent>
        <StudyContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </OverlayContent>
    </ViewerContainer>
  );
}

const ViewerContainer = styled(Column)`
  flex: 1;
  position: relative;
  background-color: #2b2b2b;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
`;

const OverlayContent = styled(Column)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 12px;
  align-items: flex-end;
  pointer-events: none;
  z-index: 1;

  & > * {
    pointer-events: auto;
  }
`;
