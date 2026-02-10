"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import Header from "@/component/common/header/Header";
import { Column } from "@/styles/base/BaseComponents";
import Footer from "@/component/common/Footer";
import colors from "@/styles/constant/colors";
import ProfileSetupModal from "@/component/common/modal/ProfileSetupModal";
import { ProfileSetup } from "@/type/user";
import { useAuthPageRedirect } from "@/hooks/auth/useAuthPageRedirect";

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const { userInfo } = useAuthPageRedirect(isAuthPage);

  const [profileSetupOpen, setProfileSetupOpen] = useState(true);

  const handleProfileSubmit = (_values: ProfileSetup) => {
    setProfileSetupOpen(false);
  };
  const handleProfileClose = () => {
    setProfileSetupOpen(false);
  };

  const isWideScreen = pathname === "/" || pathname.startsWith("/workflow");
  const noFooterScreen =
    pathname === "/" || isAuthPage || pathname.startsWith("/workflow");
  const isWorkflowPage = pathname.startsWith("/workflow");

  if (pathname.startsWith("/study")) {
    return (
      <LayoutRoot>
        {children}
        {userInfo?.role === "GUEST" && (
          <ProfileSetupModal
            open={profileSetupOpen}
            onSubmit={handleProfileSubmit}
            onClose={handleProfileClose}
          />
        )}
      </LayoutRoot>
    );
  }

  return (
    <LayoutRoot>
      <HeaderWrapper>
        <PageContainer $isWideScreen={isWideScreen}>
          <Header userInfo={userInfo} />
        </PageContainer>
      </HeaderWrapper>
      <Content $isWideScreen={isWideScreen} $fillViewport={isWorkflowPage}>
        <ContentContainer
          $isWideScreen={isWideScreen}
        >
          {children}
        </ContentContainer>
      </Content>
      {!noFooterScreen && (
        <FooterWrapper>
          <PageContainer $isWideScreen={isWideScreen}>
            <Footer />
          </PageContainer>
        </FooterWrapper>
      )}
      {userInfo?.role === "GUEST" && (
        <ProfileSetupModal
          open={profileSetupOpen}
          onSubmit={handleProfileSubmit}
          onClose={handleProfileClose}
        />
      )}
    </LayoutRoot>
  );
}

const LayoutRoot = styled(Column)`
  width: 100%;
  height: 100dvh;
  overflow-x: auto;
  overflow-y: auto;
`;

const Content = styled.main<{
  $isWideScreen: boolean;
  $fillViewport?: boolean;
}>`
  flex: ${({ $fillViewport }) => ($fillViewport ? "1 1 0" : "1 0 auto")};
  display: flex;
  width: 100%;
  min-height: ${({ $fillViewport }) => ($fillViewport ? "0" : "800px")};
  background-color: ${colors.neutral_1100};
  min-width: 1280px;
  overflow: ${({ $fillViewport }) => ($fillViewport ? "hidden" : "visible")};
`;

const PageContainer = styled.div<{ $isWideScreen: boolean }>`
  width: 100%;
  max-width: ${({ $isWideScreen }) => ($isWideScreen ? "100vw" : "1280px")} ;
  margin: 0 auto;
  background-color: ${colors.neutral_1100};
  padding: 0 24px;
`;

const ContentContainer = styled.div<{
  $isWideScreen: boolean;
}>`
  width: 100%;
  max-width: ${({ $isWideScreen }) => ($isWideScreen ? "100vw" : "1280px")};
  min-width: 1280px;
  margin: 0 auto;
  padding: ${({ $isWideScreen }) => ($isWideScreen ? "0" : "0 24px")};
  ${({ $isWideScreen }) =>
    $isWideScreen &&
    `
    min-height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `}
`;

const HeaderWrapper = styled.header`
  width: 100%;
  background-color: ${colors.neutral_1100};
  min-width: 1280px;
`;

const FooterWrapper = styled.footer`
  width: 100%;
  background-color: ${colors.neutral_1100};
  min-width: 1280px;
`;
