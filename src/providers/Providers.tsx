"use client";

import QueryProvider from "@/providers/QueryProvider";
import colors from "@/styles/constant/colors";
import { ThemeProvider } from "styled-components";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={{ colors }}>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
