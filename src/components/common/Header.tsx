"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSelector } from "./LanguageSelector";
import { SearchIcon } from "./Icons";

export const Header = () => {
  const pathname = usePathname();
  const isMainPage = pathname === "/";
  const isFormPage = pathname.startsWith("/form");
  const isWishPage = pathname === "/wish";
  const isMyPage = pathname === "/my";
  const isBoardPage = pathname === "/board";
  const isSearchPage = pathname === "/search";
  const isMyEditPage = pathname === "/my/edit";
  const isPackageReviewsPage = /^\/package\/[^/]+\/reviews$/.test(pathname);
  const isMyReviewsPage = /^\/my\/reviews(\/[^/]+)?$/.test(pathname);
  return (
    <header>
      <div
        className="container mx-auto px-5 py-[14px] flex justify-between items-center"
        style={{
          boxShadow: "0 4px 7px -2px rgba(0,0,0,0.15)",
        }}
      >
        {isFormPage && (
          <h1 className="text-white h-6 title-md">My Idol Form</h1>
        )}
        {isWishPage && <h1 className="text-white h-6 title-md">Wish list</h1>}
        {(isMyEditPage || isMyPage) && (
          <h1 className="text-white h-6 title-md">My Page</h1>
        )}
        {isBoardPage && <h1 className="text-white h-6 title-md">게시판</h1>}
        {isPackageReviewsPage && (
          <h1 className="text-white h-6 title-md">Package Reviews</h1>
        )}
        {isMyReviewsPage && (
          <h1 className="text-white h-6 title-md">My Reviews</h1>
        )}
        {isSearchPage && <h1 className="text-white h-6 title-md">검색</h1>}
        {!isFormPage &&
          !isWishPage &&
          !isMyEditPage &&
          !isMyPage &&
          !isBoardPage &&
          !isPackageReviewsPage &&
          !isMyReviewsPage &&
          !isSearchPage && (
            <Image
              src="/main-logo.png"
              alt="Main Logo"
              width={66}
              height={18}
            />
          )}
        <div className="flex items-center gap-3">
          {(isMainPage || isBoardPage || isSearchPage) && (
            <Link
              href="/search"
              aria-label="검색"
              className="cursor-pointer inline-flex"
            >
              <SearchIcon color="white" />
            </Link>
          )}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};
