"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationBell } from "./NotificationBell";
import { SearchIcon } from "./Icons";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/useAuthStore";

export const Header = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isMainPage = pathname === "/";
  const isFormPage = pathname.startsWith("/form");
  const isWishPage = pathname === "/wish";
  const isMyPage = pathname === "/my";
  const isBoardPage = pathname === "/board" || pathname.startsWith("/board/");
  const isNoticeDetailPage =
    pathname.startsWith("/board/notice/") && pathname !== "/board/notice";
  const isSearchPage = pathname === "/search";
  const isMyEditPage = pathname === "/my/edit";
  const isPackageReviewsPage = /^\/package\/[^/]+\/reviews$/.test(pathname);
  const isMyReviewsPage = /^\/my\/reviews(\/[^/]+)?$/.test(pathname);
  const isMyScrapsPage = pathname === "/my/community/scraps";
  return (
    <header>
      <div
        className="container mx-auto px-5 py-[14px] flex justify-between items-center"
        style={{
          boxShadow: "0 4px 7px -2px rgba(0,0,0,0.15)",
        }}
      >
        {isFormPage && (
          <h1 className="text-white h-6 title-md">{t("header.myIdolForm")}</h1>
        )}
        {isWishPage && (
          <h1 className="text-white h-6 title-md">{t("header.wishList")}</h1>
        )}
        {(isMyEditPage || isMyPage) && (
          <h1 className="text-white h-6 title-md">{t("header.myPage")}</h1>
        )}
        {isPackageReviewsPage && (
          <h1 className="text-white h-6 title-md">
            {t("header.packageReviews")}
          </h1>
        )}
        {isMyReviewsPage && (
          <h1 className="text-white h-6 title-md">{t("header.myReviews")}</h1>
        )}
        {isMyScrapsPage && (
          <h1 className="text-white h-6 title-md">{t("communityPage.myScraps")}</h1>
        )}
        {isSearchPage && (
          <h1 className="text-white h-6 title-md">{t("header.searchTitle")}</h1>
        )}
        {((!isFormPage &&
          !isWishPage &&
          !isMyEditPage &&
          !isMyPage &&
          !isPackageReviewsPage &&
          !isMyReviewsPage &&
          !isMyScrapsPage &&
          !isSearchPage) ||
          isNoticeDetailPage) && (
          <Link href="/" className="inline-block">
            <Image
              src="/main-logo.png"
              alt={t("common.mainLogo")}
              width={66}
              height={18}
            />
          </Link>
        )}
        <div className="flex items-center gap-3">
          {(isMainPage || isBoardPage || isSearchPage) && (
            <Link
              href="/search"
              aria-label={t("common.search")}
              className="cursor-pointer inline-flex"
            >
              <SearchIcon color="white" />
            </Link>
          )}
          {isAuthenticated && <NotificationBell />}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};
