"use client";
import React from "react";
import styled from "styled-components";
import Header from "./header/Header";
import { Column } from "@/styles/base/BaseComponents";
import Footer from "@/component/common/Footer";
import colors from "@/styles/constant/colors";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutRoot>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </LayoutRoot>
  );
}

const LayoutRoot = styled(Column)`
  width: 100%;
  height: 100dvh;
  overflow-x: auto;
`;

const Content = styled.main`
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  display: flex;
  min-width: 1280px;
  background-color: ${colors.neutral_1100};
`;
