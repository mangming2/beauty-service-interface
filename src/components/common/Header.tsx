"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

export const Header = () => {
  const pathname = usePathname();
  const isFormPage = pathname.startsWith("/form");
  const isWishPage = pathname === "/wish";
  const isMyPage = pathname === "/my";
  const isBoardPage = pathname === "/board";
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
        {!isFormPage &&
          !isWishPage &&
          !isMyEditPage &&
          !isMyPage &&
          !isBoardPage &&
          !isPackageReviewsPage &&
          !isMyReviewsPage && (
            <Image
              src="/main-logo.png"
              alt="Main Logo"
              width={66}
              height={18}
            />
          )}
        <div className="flex items-center gap-3">
          {isBoardPage && (
            <button type="button" aria-label="검색" className="text-gray-font">
              <Search className="w-5 h-5" />
            </button>
          )}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};
