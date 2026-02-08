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

  const isWideScreen = pathname === "/";
  const noFooterScreen = pathname === "/" || isAuthPage;

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
        <PageContainer>
          <Header userInfo={userInfo} />
        </PageContainer>
      </HeaderWrapper>
      <Content $isWideScreen={isWideScreen}>
        <PageContainer>{children}</PageContainer>
      </Content>
      {!noFooterScreen && (
        <FooterWrapper>
          <PageContainer>
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

const Content = styled.main<{ $isWideScreen: boolean }>`
  flex: 1 0 auto;
  display: flex;
  width: 100%;
  background-color: ${colors.neutral_1100};
  min-width: ${({ $isWideScreen }) => ($isWideScreen ? "100vw" : "1280px")};
  min-height: 800px;
`;

const PageContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
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
