"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { PageLoading } from "@/components/common";
import { useTranslation } from "@/hooks/useTranslation";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();
  const { t } = useTranslation();

  // hydration 완료 체크
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 비로그인 시 리다이렉트
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    return <PageLoading message={t("auth.verifying")} />;
  }

  if (!isAuthenticated) {
    return fallback || <PageLoading message={t("auth.redirectingToLogin")} />;
  }

  return <>{children}</>;
}
