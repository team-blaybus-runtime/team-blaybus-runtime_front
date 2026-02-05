"use client";
import React from "react";
import styled from "styled-components";
import Header from "@/component/common/header/Header";
import { Column } from "@/styles/base/BaseComponents";
import Footer from "@/component/common/Footer";
import colors from "@/styles/constant/colors";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutRoot>
      <HeaderWrapper>
        <PageContainer>
          <Header />
        </PageContainer>
      </HeaderWrapper>
      <Content>
        <PageContainer>{children}</PageContainer>
      </Content>
      <FooterWrapper>
        <PageContainer>
          <Footer />
        </PageContainer>
      </FooterWrapper>
    </LayoutRoot>
  );
}

const LayoutRoot = styled(Column)`
  width: 100%;
  height: 100dvh;
  overflow-x: auto;
  overflow-y: auto;
`;

const Content = styled.main`
  flex: 1 0 auto;
  display: flex;
  width: 100%;
  background-color: ${colors.neutral_1100};
  min-width: 1280px;
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
