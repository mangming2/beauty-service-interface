import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/common";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DOKI",
  description: "A modern beauty service interface built with Next.js",
  openGraph: {
    title: "DOKI - 뷰티 서비스 인터페이스",
    description: "모던한 뷰티 서비스를 위한 인터페이스",
    type: "website",
    locale: "ko_KR",
    siteName: "DOKI",
    url: "https://your-domain.com", // 실제 도메인으로 변경하세요
    images: [
      {
        url: "/main-logo.png", // public 폴더의 이미지 경로
        width: 1200,
        height: 630,
        alt: "DOKI 로고",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DOKI - 뷰티 서비스 인터페이스",
    description: "모던한 뷰티 서비스를 위한 인터페이스",
    images: ["/main-logo.png"],
  },
  other: {
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/png",
    "og:image:alt": "DOKI 로고",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
