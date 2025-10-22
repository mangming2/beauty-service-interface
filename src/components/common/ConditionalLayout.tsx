"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ProtectedLayout } from "./ProtectedLayout";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className="max-w-[412px] mx-auto pb-[64px] min-h-screen relative flex flex-col">
      {!isLoginPage && <Header />}
      <div className="flex-1 flex flex-col">
        {isLoginPage ? children : <ProtectedLayout>{children}</ProtectedLayout>}
      </div>
      {!isLoginPage && <Footer />}
    </div>
  );
}
