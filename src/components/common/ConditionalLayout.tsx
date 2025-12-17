"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ProtectedLayout } from "./ProtectedLayout";
import { PageLayout } from "./PageLayout";
import { Header } from "./Header";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Header/Footer가 필요한 일반 페이지 목록
const NORMAL_PAGES = [
  "/",
  "/my",
  "/wish",
  "/recommend",
  "/package",
  "/booking",
  "/form/complete",
];

// Header만 필요한 페이지 목록
const HEADER_ONLY_PAGES = [
  "/form/loading",
  "/my/reviews/[id]",
  "/form/step1",
  "/form/step2",
  "/form/step3",
  "/form/step4",
  "/form/step5",
  "/my/edit",
  "/my/booking/[id]",
  "/booking/[id]/booking-link",
  "/booking/[id]/check",
  "/my/reviews",
];

// Header/Footer가 필요 없는 특수 페이지
const SPECIAL_PAGES = ["/login", "/auth/callback"];

function isNormalPage(pathname: string): boolean {
  // 정확히 일치하는 페이지
  if (NORMAL_PAGES.includes(pathname)) return true;

  // 동적 라우트 체크 (예: /package/[id], /booking/[id] 등)
  return NORMAL_PAGES.some(page => pathname.startsWith(page + "/"));
}

function isHeaderOnlyPage(pathname: string): boolean {
  // 정확히 일치하는 페이지
  if (HEADER_ONLY_PAGES.includes(pathname)) return true;

  // 동적 라우트 체크 (예: /my/reviews/[id])
  return HEADER_ONLY_PAGES.some(page => {
    const pattern = page.replace(/\[.*?\]/g, "[^/]+");
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  });
}

function isSpecialPage(pathname: string): boolean {
  return SPECIAL_PAGES.includes(pathname);
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);
  const isLoginPage = pathname === "/login";
  const isNormal = isNormalPage(pathname);
  const isHeaderOnly = isHeaderOnlyPage(pathname);
  const isSpecial = isSpecialPage(pathname);

  // 404 페이지 감지
  useEffect(() => {
    if (containerRef.current) {
      const notFoundElement = containerRef.current.querySelector(
        '[data-page="not-found"]'
      );
      setIsNotFoundPage(!!notFoundElement);
    }
  }, [children, pathname]);

  // 404 페이지는 특수 페이지처럼 처리 (헤더/푸터 없음)
  if (isSpecial || isNotFoundPage) {
    return (
      <div
        className={`max-w-[412px] mx-auto min-h-screen relative flex flex-col`}
        ref={containerRef}
      >
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    );
  }

  // Header만 필요한 페이지 처리
  if (isHeaderOnly) {
    const content = <ProtectedLayout>{children}</ProtectedLayout>;
    return (
      <div
        className={`max-w-[412px] mx-auto min-h-screen relative flex flex-col`}
      >
        <div className="flex-1 flex flex-col">
          <Header />
          {content}
        </div>
      </div>
    );
  }

  // 일반 페이지는 Header/Footer 포함
  const content = isLoginPage ? (
    children
  ) : (
    <ProtectedLayout>{children}</ProtectedLayout>
  );

  return (
    <div
      className={`max-w-[412px] mx-auto ${isNormal ? "pb-[64px]" : ""} min-h-screen relative flex flex-col`}
      ref={containerRef}
    >
      <div className="flex-1 flex flex-col">
        {isNormal ? <PageLayout>{content}</PageLayout> : content}
      </div>
    </div>
  );
}
