"use client";
import Image from "next/image";

export const Header = () => {
  return (
    <header>
      <div className="container mx-auto px-4 py-3">
        <Image src="/main-logo.png" alt="Main Logo" width={66} height={18} />
      </div>
    </header>
  );
};
