"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Button, Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import StudyHeader from "@/component/study/StudyHeader";
import StudySidebar from "@/component/study/StudySidebar";
import StudyTabBar from "@/component/study/StudyTabBar";
import StudyViewer from "@/component/study/StudyViewer";
import StudyAIChat from "@/component/study/StudyAIChat";
import {
  fetchStudyObject,
  StudyObjectDetail,
} from "@/apis/studyApi";

interface StudyLayoutProps {
  id: string;
}

export default function StudyLayout({ id }: StudyLayoutProps) {
  const [data, setData] = useState<StudyObjectDetail | null>(null);

  useEffect(() => {
    fetchStudyObject(id).then(setData);
  }, [id]);

  return (
    <LayoutRoot>
      <StudyHeader />
      <Section>
        <StudySidebar />
        <MainContent>
          <PageHeader>
            <HeaderLeft>
              <FileNameContainer>
                <Font typo="label_m" color="#ffffff">
                  {data?.object.objectName ?? "로딩 중..."}
                </Font>
                <Img
                  src="/icons/study/edit.svg"
                  alt="edit"
                  width="24px"
                  height="24px"
                />
              </FileNameContainer>
            </HeaderLeft>
            <IconBtn>
              <Img
                src="/icons/study/kebab.svg"
                alt="menu"
                width="20px"
                height="20px"
              />
            </IconBtn>
          </PageHeader>
          <ContentRow>
            <ViewerColumn>
              <TabCenter>
                <StudyTabBar />
              </TabCenter>
              <StudyViewer components={data?.components ?? []} />
            </ViewerColumn>
            <StudyAIChat />
          </ContentRow>
        </MainContent>
      </Section>
    </LayoutRoot>
  );
}

const LayoutRoot = styled(Column)`
  width: 100%;
  height: 100dvh;
  background-color: #000000;
  overflow: hidden;
`;

const Section = styled(Row)`
  flex: 1;
  overflow: hidden;
`;

const MainContent = styled(Column)`
  flex: 1;
  padding: 24px;
  gap: 16px;
  overflow: hidden;
`;

const PageHeader = styled(Row)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-shrink: 0;
`;

const HeaderLeft = styled(Row)`
  flex: 1;
  align-items: flex-start;
`;

const FileNameContainer = styled(Row)`
  align-items: center;
  gap: 20px;
  overflow: hidden;
`;

const ContentRow = styled(Row)`
  flex: 1;
  gap: 16px;
  overflow: hidden;
`;

const ViewerColumn = styled(Column)`
  flex: 1;
  gap: 16px;
  overflow: hidden;
`;

const TabCenter = styled(Column)`
  align-items: center;
  width: 100%;
  flex-shrink: 0;
`;

const IconBtn = styled(Button)`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 8px;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;
