"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LanguageSelector } from "./LanguageSelector";

export const Header = () => {
  const pathname = usePathname();
  const isFormPage = pathname.startsWith("/form");
  const isWishPage = pathname === "/wish";
  const isMyPage = pathname === "/my";
  const isMyEditPage = pathname === "/my/edit";

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
        {!isFormPage && !isWishPage && !isMyEditPage && !isMyPage && (
          <Image src="/main-logo.png" alt="Main Logo" width={66} height={18} />
        )}
        <LanguageSelector />
      </div>
    </header>
  );
};
