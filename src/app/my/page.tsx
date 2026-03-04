"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";

import { useUser, useLogout } from "@/queries/useAuthQueries";
import BookingHistory from "@/components/my/booking-history";
import Schedule from "@/components/my/Schedule";
import { EditIcon, SettingIcon } from "@/components/common/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GapY } from "../../components/ui/gap";
import { useTranslation } from "@/hooks/useTranslation";

export default function MyPage() {
  const { user } = useUser();
  const signOutMutation = useLogout();
  const router = useRouter();
  const { t } = useTranslation();
  // 사용자 정보가 있으면 사용하고, 없으면 기본값 사용
  // profiles 테이블 데이터를 우선적으로 사용하고, 없으면 auth.users 데이터 사용
  const userProfile = {
    name: user?.name || user?.email?.split("@")[0] || t("my.defaultName"),
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
            <div className="flex items-center gap-1">
              <h1 className="text-xl font-bold">{userProfile.name}</h1>
              <Link href="/my/edit">
                <EditIcon className="cursor-pointer" width={20} height={20} />
              </Link>
            </div>
            <p className="text-gray-400 text-sm">{userProfile.email}</p>
          </div>
          <SettingIcon className="cursor-pointer" width={16} height={16} />
        </div>
      </div>

      <div className="flex px-3 gap-2">
        <Button
          variant="graySmall"
          onClick={() => router.push("/my/reviews")}
          width={80}
          height={32}
        >
          {t("my.myReviews")}
        </Button>
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
            <TabsTrigger
              value="schedule"
              className="relative title-sm bg-transparent border-0 text-gray-400 data-[state=active]:text-pink-font data-[state=active]:bg-transparent hover:text-white transition-colors duration-200 pb-3 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-pink-font"
            >
              {t("my.schedule")}
            </TabsTrigger>
          </TabsList>

          {/* Booking History Tab */}
          <TabsContent value="booking-history" className="mt-6">
            <BookingHistory />
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="mt-6">
            <Schedule />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
