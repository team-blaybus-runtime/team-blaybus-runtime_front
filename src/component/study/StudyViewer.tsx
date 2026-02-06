"use client";

import { useState } from "react";
import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import StudyContentModal from "@/component/study/StudyContentModal";

export default function StudyViewer() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <ViewerContainer>
      <StudyContentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </ViewerContainer>
  );
}

const ViewerContainer = styled(Column)`
  flex: 1;
  position: relative;
  background-color: #2b2b2b;
  border-radius: 16px;
  overflow: hidden;
  padding: 12px;
  align-items: flex-end;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
`;
