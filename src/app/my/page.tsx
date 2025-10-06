"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";

import { useUser, useSignOut, useUserProfile } from "@/hooks/useAuthQueries";
import BookingHistory from "@/components/my/BookingHistory";
import Schedule from "@/components/my/Schedule";
import { PageLoading } from "@/components/common";
import { EditIcon } from "@/components/common/Icons";
import Link from "next/link";

export default function MyPage() {
  // React Query hooks 사용
  const { data: user, isLoading: userLoading } = useUser();
  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.id);
  const signOutMutation = useSignOut();

  // 사용자 정보가 있으면 사용하고, 없으면 기본값 사용
  // profiles 테이블 데이터를 우선적으로 사용하고, 없으면 auth.users 데이터 사용
  const userProfile = {
    name:
      profile?.full_name ||
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      "K-pop Fan",
    email: user?.email || "fan@example.com",
    avatar:
      profile?.avatar_src ||
      user?.user_metadata?.avatar_url ||
      "/dummy-profile.png",
  };

  // 사용자 정보 로딩 중일 때
  if (userLoading || profileLoading) {
    return <PageLoading message="사용자 정보를 불러오는 중..." />;
  }

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Header with Profile */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={userProfile.avatar}
              alt="Profile"
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOutMutation.mutate()}
            disabled={signOutMutation.isPending}
            className="text-gray-400 hover:text-white"
          >
            {signOutMutation.isPending ? "..." : "로그아웃"}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-4">
        <Tabs defaultValue="booking-history" className="w-full">
          <TabsList className="bg-transparent p-0 gap-3 border-b border-gray-700 rounded-none">
            <TabsTrigger
              value="booking-history"
              className="relative bg-transparent border-0 text-gray-400 data-[state=active]:text-pink-font data-[state=active]:bg-transparent hover:text-white transition-colors duration-200 pb-3 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-transparent data-[state=active]:after:bg-pink-font"
            >
              Booking History
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="relative bg-transparent border-0 text-gray-400 data-[state=active]:text-pink-font data-[state=active]:bg-transparent hover:text-white transition-colors duration-200 pb-3 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-pink-font"
            >
              Schedule
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
