"use client";

import { usePathname } from "next/navigation";
import { HomeIcon, WishIcon, MyIcon } from "./Icons";
import { IconButton } from "./IconButton";

export const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 bg-background/80 backdrop-blur-sm w-[412px] max-w-screen">
      <div className="h-[64px] px-4 py-3 flex justify-between items-center">
        <IconButton
          icon={<HomeIcon color={pathname === "/" ? "#f92595" : "white"} />}
          text="Home"
          href="/"
          isActive={pathname === "/"}
        />
        <IconButton
          icon={<WishIcon color={pathname === "/wish" ? "#f92595" : "white"} />}
          text="Wish"
          href="/wish"
          isActive={pathname === "/wish"}
        />
        <IconButton
          icon={<MyIcon color={pathname === "/my" ? "#f92595" : "white"} />}
          text="My"
          href="/my"
          isActive={pathname === "/my"}
        />
      </div>
    </footer>
  );
};
