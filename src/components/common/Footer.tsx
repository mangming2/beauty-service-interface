"use client";

import { usePathname } from "next/navigation";
import { HomeIcon, WishIcon, MyIcon } from "./Icons";
import { IconButton } from "./IconButton";

export const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container h-[64px] mx-auto px-4 py-3 flex justify-between items-center">
        <IconButton
          icon={<HomeIcon />}
          text="Home"
          href="/"
          isActive={pathname === "/"}
        />
        <IconButton
          icon={<WishIcon />}
          text="Wish"
          href="/wish"
          isActive={pathname === "/wish"}
        />
        <IconButton
          icon={<MyIcon />}
          text="My"
          href="/my"
          isActive={pathname === "/my"}
        />
      </div>
    </footer>
  );
};
