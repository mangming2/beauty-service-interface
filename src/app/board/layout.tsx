"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TranslatedText } from "@/components/main/TranslatedText";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isNotice = pathname === "/board/notice";
  const isCommunity = pathname === "/board/community";

  return (
    <div className="min-h-screen text-white bg-background">
      <div className="pt-6 border-b border-gray-outline px-4">
        <nav className="flex gap-6">
          <Link
            href="/board/notice"
            className={`relative title-sm flex-initial pb-3 pt-0 px-0 rounded-none transition-colors duration-200 after:absolute after:left-0 after:right-0 after:h-px after:bottom-0 after:bg-gray-outline ${
              isNotice
                ? "text-pink-font after:bg-pink-font"
                : "text-gray-400 hover:text-white after:bg-gray-outline"
            }`}
          >
            <span className="relative z-[1]">
              <TranslatedText translationKey="notice" />
            </span>
          </Link>
          <Link
            href="/board/community"
            className={`relative title-sm flex-initial pb-3 pt-0 px-0 rounded-none transition-colors duration-200 after:absolute after:left-0 after:right-0 after:h-px after:bottom-0 after:bg-gray-outline ${
              isCommunity
                ? "text-pink-font after:bg-pink-font"
                : "text-gray-400 hover:text-white after:bg-gray-outline"
            }`}
          >
            <span className="relative z-[1]">
              <TranslatedText translationKey="community" />
            </span>
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
