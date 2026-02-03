"use client";
import React from "react";

// 공통 레이아웃을 작성할 부분입니다.
// ex. Header, Footer, Sidebar 등

export function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
