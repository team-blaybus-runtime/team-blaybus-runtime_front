import type { Metadata } from "next";
import "@/styles/globals.css";
import "@xyflow/react/dist/style.css";
import { Layout } from "@/component/common/Layout";
import { Providers } from "@/providers/Providers";
import StyledComponentsRegistry from "@/providers/StyledComponentsRegistry";

export const metadata: Metadata = {
  title: "simvex runtime",
  description:
    "차세대 공학자들의 기계 학습의 어려움을 해결하는 3D 물리 시뮬레이션 웹 서비스, SIMVEX를 소개합니다.",
  openGraph: {
    title: "simvex runtime",
    description:
      "차세대 공학자들의 기계 학습의 어려움을 해결하는 3D 물리 시뮬레이션 웹 서비스, SIMVEX를 소개합니다.",
    images: [
      {
        url: "/images/seoImg.png",
        width: 1200,
        height: 630,
        alt: "simvex runtime preview",
      },
    ],
    url: "https://blaybus-runtime-front.vercel.app",
    siteName: "simvex runtime",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "simvex runtime",
    description:
      "차세대 공학자들의 기계 학습의 어려움을 해결하는 3D 물리 시뮬레이션 웹 서비스, SIMVEX를 소개합니다.",
    images: ["/images/seoImg.png"],
  },
  icons: {
    icon: "/images/metaImg.png",
    apple: "/images/metaImg.png",
  },
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
