"use client";

import { usePathname } from "next/navigation";
import { HomeIcon, WishIcon, MyIcon, CommunityIcon } from "./Icons";
import { IconButton } from "./IconButton";
import { useTranslation } from "@/hooks/useTranslation";

export const Footer = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <footer
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 w-[412px] max-w-screen flex h-16 py-2 items-start flex-shrink-0 bg-[#1F2125]"
      style={{ boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)" }}
    >
      <div className="flex justify-between items-center w-full h-full">
        <div className="flex items-center justify-center w-[95px] p-[4px]">
          <IconButton
            icon={<HomeIcon color={pathname === "/" ? "#f92595" : "white"} />}
            text={t("footer.home")}
            href="/"
            isActive={pathname === "/"}
          />
        </div>
        <div className="flex items-center justify-center w-[95px] p-[4px]">
          <IconButton
            icon={
              <WishIcon color={pathname === "/wish" ? "#f92595" : "white"} />
            }
            text={t("footer.wish")}
            href="/wish"
            isActive={pathname === "/wish"}
          />
        </div>
        <div className="flex items-center justify-center w-[95px] p-[4px]">
          <IconButton
            icon={
              <CommunityIcon
                color={pathname.startsWith("/board") ? "#f92595" : "white"}
              />
            }
            text={t("footer.community")}
            href="/board/community"
            isActive={pathname.startsWith("/board")}
          />
        </div>
        <div className="flex items-center justify-center w-[95px] p-[4px]">
          <IconButton
            icon={<MyIcon color={pathname === "/my" ? "#f92595" : "white"} />}
            text={t("footer.my")}
            href="/my"
            isActive={pathname === "/my"}
          />
        </div>
      </div>
    </footer>
  );
};
