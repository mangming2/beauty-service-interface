"use client";

import { usePathname } from "next/navigation";
import { HomeIcon, WishIcon, MyIcon } from "./Icons";
import { IconButton } from "./IconButton";

export const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-1/2 bg-background transform -translate-x-1/2 z-50 w-[412px] max-w-screen">
      <div className="py-[8px] flex justify-between items-center">
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
