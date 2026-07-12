import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  AuthValidator,
  ConditionalLayout,
  WebVitals,
} from "@/components/common";
import { QueryProvider } from "@/providers";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://www.dayofkidol.shop"
  ),
  title: "DOKI",
  description: "A modern beauty service interface built with Next.js",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "DOKI - 뷰티 서비스 인터페이스",
    description: "모던한 뷰티 서비스를 위한 인터페이스",
    type: "website",
    locale: "ko_KR",
    siteName: "DOKI",
    url: "https://your-domain.com",
    images: [
      {
        url: "/thumbnail.png",
        width: 588,
        height: 162,
        alt: "DOKI 로고",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DOKI - 뷰티 서비스 인터페이스",
    description: "모던한 뷰티 서비스를 위한 인터페이스",
    images: ["/thumbnail.png"],
  },
  other: {
    "og:image:width": "588",
    "og:image:height": "162",
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
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MPZ24D7D');`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MPZ24D7D"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <WebVitals />
        <QueryProvider>
          <AuthValidator>
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthValidator>
        </QueryProvider>
      </body>
    </html>
  );
}
