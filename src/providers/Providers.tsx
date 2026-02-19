"use client";

import QueryProvider from "@/providers/QueryProvider";
import { MSWProvider } from "@/component/providers/MSWProvider";
import colors from "@/styles/constant/colors";
import { ThemeProvider } from "styled-components";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <ThemeProvider theme={{ colors }}>
        <QueryProvider>
          {children}
          <Toaster position="top-right" duration={2000} richColors />
        </QueryProvider>
      </ThemeProvider>
    </MSWProvider>
  );
}
