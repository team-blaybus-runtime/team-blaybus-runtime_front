"use client";

import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import { Button, Img } from "@/styles/base/BaseStyledTags";

export default function StudySidebar() {
  return (
    <SidebarContainer>
      <MenuContainer>
        <PrimaryMenu>
          <Img src="/icons/study/tool.svg" alt="tool" width="40px" height="40px" />
          <MemoButton>
            <Img src="/icons/study/memo.svg" alt="memo" width="20px" height="20px" />
          </MemoButton>
        </PrimaryMenu>
      </MenuContainer>
      <FooterMenu>
        <MenuButton>
          <Img src="/icons/study/info.svg" alt="info" width="24px" height="24px" />
        </MenuButton>
        <MenuButton>
          <Img src="/icons/study/settings.svg" alt="settings" width="24px" height="24px" />
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

const MemoButton = styled(Button)`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
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
