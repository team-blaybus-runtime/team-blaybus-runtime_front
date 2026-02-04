import type { Metadata } from "next";
import "@/styles/globals.css";
import "@xyflow/react/dist/style.css";
import { Layout } from "@/component/common/Layout";
import { Providers } from "@/providers/Providers";
import StyledComponentsRegistry from "@/providers/StyledComponentsRegistry";

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
        <StyledComponentsRegistry>
          <Providers>
            <Layout>{children}</Layout>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
