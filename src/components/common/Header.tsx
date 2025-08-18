"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const isFormPage = pathname.startsWith("/form");

  return (
    <header>
      <div className="container mx-auto px-4 py-3">
        {isFormPage ? (
          <h1 className="text-white title-md">My Idol Form</h1>
        ) : (
          <Image src="/main-logo.png" alt="Main Logo" width={66} height={18} />
        )}
      </div>
    </header>
  );
};
