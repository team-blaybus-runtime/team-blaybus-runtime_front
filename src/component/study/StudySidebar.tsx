"use client";

import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import { Button, Img } from "@/styles/base/BaseStyledTags";
import { useRouter } from "next/navigation";

export default function StudySidebar({
  sideBarContent,
  setSideBarContent,
  onPdfExport,
  isPdfExporting = false,
}: {
  sideBarContent: "memo" | "aiChat" | "quiz";
  setSideBarContent: (sideBarContent: "memo" | "aiChat" | "quiz") => void;
  onPdfExport?: () => void;
  isPdfExporting?: boolean;
}) {
  const router = useRouter();

  return (
    <SidebarContainer>
      <MenuContainer>
        <PrimaryMenu>
          <Img
            src={
              sideBarContent === "aiChat"
                ? "/icons/study/activeTool.svg"
                : "/icons/study/tool.svg"
            }
            alt="tool"
            width="40px"
            height="40px"
            onClick={() => setSideBarContent("aiChat")}
            style={{ cursor: "pointer" }}
          />
          <Img
            src={
              sideBarContent === "memo"
                ? "/icons/study/activeMemo.svg"
                : "/icons/study/memo.svg"
            }
            alt="memo"
            width="40px"
            height="40px"
            onClick={() => setSideBarContent("memo")}
            style={{ cursor: "pointer" }}
          />
          <Img
            src={
              sideBarContent === "quiz"
                ? "/icons/study/activeQuiz.svg"
                : "/icons/study/quiz.svg"
            }
            alt="quiz"
            width="40px"
            height="40px"
            onClick={() => setSideBarContent("quiz")}
            style={{ cursor: "pointer" }}
          />
          <Img
            src={"/icons/study/pdf.svg"}
            alt="memo"
            width="40px"
            height="40px"
            onClick={isPdfExporting ? undefined : onPdfExport}
            style={{
              cursor: isPdfExporting ? "not-allowed" : "pointer",
              opacity: isPdfExporting ? 0.5 : 1,
            }}
          />
        </PrimaryMenu>
      </MenuContainer>
      <FooterMenu>
        <MenuButton>
          <Img
            src="/icons/study/info.svg"
            alt="info"
            width="24px"
            height="24px"
            onClick={() => router.push("/mypage")}
          />
        </MenuButton>
        <MenuButton>
          <Img
            src="/icons/study/settings.svg"
            alt="settings"
            width="24px"
            height="24px"
            onClick={() => router.push("/settings")}
          />
        </MenuButton>
      </FooterMenu>
    </SidebarContainer>
  );
}

const SidebarContainer = styled(Column)`
  width: 72px;
  height: 100%;
  background-color: #000000;
  flex-shrink: 0;
  overflow: hidden;
`;

const MenuContainer = styled(Column)`
  flex: 1;
  padding: 16px;
  width: 100%;
`;

const PrimaryMenu = styled(Column)`
  gap: 8px;
  align-items: flex-start;
  width: 100%;
`;

const FooterMenu = styled(Column)`
  gap: 8px;
  align-items: flex-start;
  border-top: 1px solid #303030;
  padding: 16px;
  width: 100%;
`;

const MenuButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;
