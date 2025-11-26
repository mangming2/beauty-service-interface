"use client";

import { usePathname } from "next/navigation";
import { ProtectedLayout } from "./ProtectedLayout";
import { PageLayout } from "./PageLayout";

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
  "/my/reviews",
  "/booking",
  "/form/step1",
  "/form/step2",
  "/form/step3",
  "/form/step4",
  "/form/step5",
  "/my/edit",
];

// Header/Footer가 필요 없는 특수 페이지
const SPECIAL_PAGES = [
  "/login",
  "/auth/callback",
  "/form/loading",
  "/form/complete",
];

function isNormalPage(pathname: string): boolean {
  // 정확히 일치하는 페이지
  if (NORMAL_PAGES.includes(pathname)) return true;

  // 동적 라우트 체크 (예: /package/[id], /booking/[id] 등)
  return NORMAL_PAGES.some(page => pathname.startsWith(page + "/"));
}

function isSpecialPage(pathname: string): boolean {
  return SPECIAL_PAGES.includes(pathname);
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isNormal = isNormalPage(pathname);
  const isSpecial = isSpecialPage(pathname);

  // 특수 페이지는 레이아웃 없이 그대로 렌더링
  if (isSpecial) {
    return (
      <div
        className={`max-w-[412px] mx-auto min-h-screen relative flex flex-col`}
      >
        <div className="flex-1 flex flex-col">{children}</div>
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
    >
      <div className="flex-1 flex flex-col">
        {isNormal ? <PageLayout>{content}</PageLayout> : content}
      </div>
    </div>
  );
}
