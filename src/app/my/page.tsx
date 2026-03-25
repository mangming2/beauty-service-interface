"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";

import { useUser, useLogout, useAuthStatus } from "@/queries/useAuthQueries";
import { useMyPageUser } from "@/queries/useMyPageQueries";
import BookingHistory from "@/components/my/booking-history";
import { EditIcon, SettingIcon } from "@/components/common/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GapY } from "../../components/ui/gap";
import { useTranslation } from "@/hooks/useTranslation";

export default function MyPage() {
  const { user } = useUser();
  const { data: myPageUser, isLoading: myPageUserLoading } = useMyPageUser();
  const { data: authStatus } = useAuthStatus();
  const signOutMutation = useLogout();
  const router = useRouter();
  const { t } = useTranslation();
  const isAdmin = authStatus?.admin === true || authStatus?.role === "ADMIN";

  // 개발 시 콘솔에서 유저 정보 확인용
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (myPageUserLoading) return;
    console.log("[My 페이지] 유저 정보 출처 정리:");
    console.log(
      "  1) Auth Store (useUser) — 로그인 시 저장된 값:",
      user ?? null
    );
    console.log(
      "  2) GET /mypage/user (useMyPageUser) — 마이페이지 API 응답:",
      myPageUser ?? null
    );
    console.log(
      "  3) GET /auth/status (useAuthStatus) — 인증·권한:",
      authStatus ?? null
    );
  }, [user, myPageUser, myPageUserLoading, authStatus]);
  // 사용자 정보가 있으면 사용하고, 없으면 기본값 사용
  const userProfile = {
    name:
      myPageUser?.nickname ||
      user?.name ||
      user?.email?.split("@")[0] ||
      t("my.defaultName"),
    email: user?.email || "fan@example.com",
    avatar: user?.profileImage || "/dummy-profile.png",
  };

  // 사용자 정보 로딩 중일 때
  // if (isLoading) {
  //   return <PageLoading message="사용자 정보를 불러오는 중..." />;
  // }

  return (
    <div className="min-h-screen text-white bg-background">
      {/* Header with Profile */}
      <div className="px-4 pt-6 pb-3">
        <div className="flex gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={userProfile.avatar}
              alt={t("common.profile")}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 flex-wrap">
              <h1 className="text-xl font-bold">{userProfile.name}</h1>
              {isAdmin && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {t("my.admin")}
                </span>
              )}
              <Link href="/my/edit">
                <EditIcon className="cursor-pointer" width={20} height={20} />
              </Link>
            </div>
            <p className="text-gray-400 text-sm">{userProfile.email}</p>
          </div>
          <SettingIcon className="cursor-pointer" width={16} height={16} />
        </div>
      </div>

      <div className="flex px-3 gap-2 flex-wrap">
        <Button
          variant="graySmall"
          onClick={() => router.push("/my/reviews")}
          width={80}
          height={32}
        >
          {t("my.myReviews")}
        </Button>
        {isAdmin && (
          <Button
            variant="graySmall"
            onClick={() => router.push("/admin")}
            width={100}
            height={32}
          >
            {t("my.adminPage")}
          </Button>
        )}
        <Button
          variant="graySmall"
          onClick={() => signOutMutation.mutate()}
          disabled={signOutMutation.isPending}
          width={80}
          height={32}
        >
          {signOutMutation.isPending ? "..." : t("my.logout")}
        </Button>
      </div>

      <GapY size={20} />

      {/* Tabs Navigation */}
      <div className="px-4">
        <Tabs defaultValue="booking-history" className="w-full">
          <TabsList className="bg-transparent p-0 gap-3 border-b border-gray-700 rounded-none">
            <TabsTrigger
              value="booking-history"
              className="relative title-sm bg-transparent border-0 text-gray-400 data-[state=active]:text-pink-font data-[state=active]:bg-transparent hover:text-white transition-colors duration-200 pb-3 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-transparent data-[state=active]:after:bg-pink-font"
            >
              {t("my.bookingHistory")}
            </TabsTrigger>
            {/* 이번 배포 미포함
            <TabsTrigger
              value="schedule"
              className="relative title-sm bg-transparent border-0 text-gray-400 data-[state=active]:text-pink-font data-[state=active]:bg-transparent hover:text-white transition-colors duration-200 pb-3 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-pink-font"
            >
              {t("my.schedule")}
            </TabsTrigger>
            */}
          </TabsList>

          {/* Booking History Tab */}
          <TabsContent value="booking-history" className="mt-6">
            <BookingHistory />
          </TabsContent>

          {/* Schedule Tab - 이번 배포 미포함
          <TabsContent value="schedule" className="mt-6">
            <Schedule />
          </TabsContent>
          */}
        </Tabs>
      </div>
    </div>
  );
}
