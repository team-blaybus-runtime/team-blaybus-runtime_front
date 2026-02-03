import type { Metadata } from "next";
import "@/styles/globals.css";
import StyledComponentsRegistry from "@/lib/styled-components-registry";

export const metadata: Metadata = {
  title: "runtime-front",
  description: "runtime-front",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
