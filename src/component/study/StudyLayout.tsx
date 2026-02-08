"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Button, Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import { C } from "@/constant";
import StudyHeader from "@/component/study/StudyHeader";
import StudySidebar from "@/component/study/StudySidebar";
import StudyTabBar, { StudyTab } from "@/component/study/StudyTabBar";
import StudyViewer from "@/component/study/StudyViewer";
import StudyAIChat from "@/component/study/aiChat/StudyAIChat";
import useStudyAIChat from "@/providers/useStudyAIChat";
import { fetchStudyObject, StudyObjectDetail } from "@/apis/studyApi";
import StudyMemo from "@/component/study/memo/StudyMemo";
import StudyQuiz from "@/component/study/quiz/StudyQuiz";
import useStudyPdfExport from "@/hooks/study/useStudyPdfExport";
import { useFetchUserMemosQuery } from "@/queries/users/memos/useFetchUserMemos";

interface StudyLayoutProps {
  id: string;
}

export default function StudyLayout({ id }: StudyLayoutProps) {
  const [data, setData] = useState<StudyObjectDetail | null>(null);
  const { data: memoData } = useFetchUserMemosQuery(data?.object.objectName);

  const [sideBarContent, setSideBarContent] = useState<
    "memo" | "aiChat" | "quiz"
  >(
    "aiChat",
  );
  const [activeTab, setActiveTab] = useState<StudyTab>("단일 부품");
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const aiChat = useStudyAIChat({
    productType: data?.object.objectName ?? id,
    chatHistoryId: 1,
  });
  const { exportPdf, isExporting } = useStudyPdfExport({
    viewerRef,
    memos: memoData ?? [],
    messages: aiChat.messages,
    title: data?.object.objectName ?? "학습 정리",
  });

  useEffect(() => {
    fetchStudyObject(id).then(setData);
  }, [id]);

  // 새로고침 시 페이지별 사이드바 선택된 옵션을 유지하기 위해 로컬스토리지 사용
  useEffect(() => {
    const storageKey = `${C.STUDY_SIDEBAR_CONTENT_KEY_PREFIX}${id}`;
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "memo" || stored === "aiChat" || stored === "quiz") {
      setSideBarContent(stored);
    }
  }, [id]);

  useEffect(() => {
    const storageKey = `${C.STUDY_SIDEBAR_CONTENT_KEY_PREFIX}${id}`;
    window.localStorage.setItem(storageKey, sideBarContent);
  }, [id, sideBarContent]);

  return (
    <LayoutRoot>
      <StudyHeader />
      <Section>
        <StudySidebar
          sideBarContent={sideBarContent}
          setSideBarContent={setSideBarContent}
          onPdfExport={exportPdf}
          isPdfExporting={isExporting}
        />
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
                <StudyTabBar activeTab={activeTab} onTabChange={setActiveTab} />
              </TabCenter>
              <StudyViewer
                objectName={data?.object.objectName ?? ""}
                components={data?.components ?? []}
                activeTab={activeTab}
                viewerRef={viewerRef}
              />
            </ViewerColumn>
            {sideBarContent === "aiChat" ? (
              <StudyAIChat chat={aiChat ?? []} />
            ) : sideBarContent === "memo" ? (
              <StudyMemo
                memos={memoData ?? []}
                productType={data?.object.objectName ?? id}
              />
            ) : (
              <StudyQuiz
                objectId={id}
                objectName={data?.object.objectName ?? id}
              />
            )}
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
