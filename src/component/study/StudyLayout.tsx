"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  UserStudyHistory,
  fetchUserStudyHistory,
  saveUserStudyHistory,
} from "@/apis/study";
import StudyMemo from "./memo/StudyMemo";
import useStudyPdfExport from "@/hooks/study/useStudyPdfExport";
import { useFetchUserMemosQuery } from "@/queries/users/memos/useFetchUserMemos";

interface StudyLayoutProps {
  id: string;
}

export default function StudyLayout({ id }: StudyLayoutProps) {
  const [history, setHistory] = useState<UserStudyHistory | null>(null);
  const { data: memoData } = useFetchUserMemosQuery();

  const [sideBarContent, setSideBarContent] = useState<"memo" | "aiChat">(
    "aiChat",
  );
  const [activeTab, setActiveTab] = useState<StudyTab>("단일 부품");
  const [isRenaming, setIsRenaming] = useState(false);
  const [customName, setCustomName] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  const title = history?.title ?? "";
  const productType = history?.ProductTypeDesc ?? "";

  const aiChat = useStudyAIChat({
    productType: productType || id,
    chatHistoryId: Number(id) || 1,
  });
  const { exportPdf, isExporting } = useStudyPdfExport({
    viewerRef,
    memos: memoData ?? [],
    messages: aiChat.messages,
    title: title || "학습 정리",
  });

  useEffect(() => {
    const historyId = Number(id);
    if (!historyId) return;
    fetchUserStudyHistory(historyId).then((h) => {
      if (h) setHistory(h);
    });
  }, [id]);

  const displayName = customName || title || "";

  const startRename = useCallback(() => {
    setCustomName(displayName);
    setIsRenaming(true);
    setTimeout(() => renameInputRef.current?.select(), 0);
  }, [displayName]);

  const confirmRename = useCallback(() => {
    const trimmed = customName.trim();
    if (trimmed && history) {
      setHistory({ ...history, title: trimmed });
      saveUserStudyHistory({
        productType: history.ProductTypeDesc,
        title: trimmed,
        viewInfo: history.viewInfo,
      }).catch(() => {});
    }
    setCustomName("");
    setIsRenaming(false);
  }, [customName, history]);

  const cancelRename = useCallback(() => {
    setCustomName("");
    setIsRenaming(false);
  }, []);

  // 새로고침 시 페이지별 사이드바 선택된 옵션을 유지하기 위해 로컬스토리지 사용
  useEffect(() => {
    const storageKey = `${C.STUDY_SIDEBAR_CONTENT_KEY_PREFIX}${id}`;
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "memo" || stored === "aiChat") {
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
                {isRenaming ? (
                  <RenameInput
                    ref={renameInputRef}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmRename();
                      if (e.key === "Escape") cancelRename();
                    }}
                    onBlur={confirmRename}
                  />
                ) : (
                  <Font typo="label_m" color="#ffffff">
                    {displayName || "로딩 중..."}
                  </Font>
                )}
                <EditIcon onClick={startRename}>
                  <Img
                    src="/icons/study/edit.svg"
                    alt="edit"
                    width="24px"
                    height="24px"
                  />
                </EditIcon>
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
                productType={productType}
                objectName={title}
                activeTab={activeTab}
                viewerRef={viewerRef}
              />
            </ViewerColumn>
            {sideBarContent === "aiChat" ? (
              <StudyAIChat chat={aiChat ?? []} />
            ) : (
              <StudyMemo
                memos={memoData ?? []}
                productType={productType || id}
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
  gap: 12px;
  overflow: hidden;
`;

const RenameInput = styled.input`
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  padding: 2px 0;
  outline: none;
  min-width: 100px;

  &:focus {
    border-bottom-color: #3b82f6;
  }
`;

const EditIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
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
