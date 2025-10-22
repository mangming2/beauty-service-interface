"use client";

import { usePathname } from "next/navigation";
import { HomeIcon, WishIcon, MyIcon } from "./Icons";
import { IconButton } from "./IconButton";

export const Footer = () => {
  const pathname = usePathname();

  return (
    <footer
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 w-[412px] max-w-screen flex h-16 py-2 items-start flex-shrink-0 bg-[#1F2125]"
      style={{ boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)" }}
    >
      <div className="flex justify-between items-center w-full h-full">
        <div className="flex items-center justify-center w-[129px] p-[4px]">
          <IconButton
            icon={<HomeIcon color={pathname === "/" ? "#f92595" : "white"} />}
            text="Home"
            href="/"
            isActive={pathname === "/"}
          />
        </div>
        <div className="flex items-center justify-center w-[129px] p-[4px]">
          <IconButton
            icon={
              <WishIcon color={pathname === "/wish" ? "#f92595" : "white"} />
            }
            text="Wish"
            href="/wish"
            isActive={pathname === "/wish"}
          />
        </div>
        <div className="flex items-center justify-center w-[129px] p-[4px]">
          <IconButton
            icon={<MyIcon color={pathname === "/my" ? "#f92595" : "white"} />}
            text="My"
            href="/my"
            isActive={pathname === "/my"}
          />
        </div>
      </div>
    </footer>
  );
};
