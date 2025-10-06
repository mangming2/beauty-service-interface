"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser, useUpdateProfile } from "@/hooks/useAuthQueries";
import { PageLoading } from "@/components/common";
import { LanguageSelector } from "@/components/common";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useUser();
  const updateProfileMutation = useUpdateProfile();

  // 사용자 정보에서 닉네임 초기값 계산
  const getInitialNickname = () => {
    if (!user) return "";
    return (
      user.user_metadata?.full_name ||
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      "Doki01"
    );
  };

  const [nickname, setNickname] = useState("");

  // 닉네임 유효성 검사
  const validateNickname = (value: string) => {
    const regex = /^[a-zA-Z0-9가-힣]{2,10}$/;
    return regex.test(value);
  };

  // 완료 버튼 클릭
  const handleComplete = async () => {
    if (!user || !validateNickname(currentNickname)) {
      return;
    }

    try {
      const profileData: Record<string, unknown> = {
        full_name: currentNickname,
      };

      await updateProfileMutation.mutateAsync({
        userId: user.id,
        profileData,
      });

      // 성공 시 My Page로 이동
      router.push("/my");
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  // 사용자 정보 로딩 중일 때
  if (userLoading) {
    return <PageLoading message="사용자 정보를 불러오는 중..." />;
  }

  // user 데이터가 로드된 후 nickname이 비어있으면 초기값 설정
  const currentNickname = nickname || getInitialNickname();

  const isNicknameValid = validateNickname(currentNickname);
  const isFormValid = isNicknameValid && !updateProfileMutation.isPending;

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-6">
        <h1 className="text-xl font-bold">My Page</h1>
        <LanguageSelector />
      </div>

      {/* Profile Image Section */}
      <div className="flex flex-col items-center px-4 py-8">
        <div className="relative w-32 h-32 rounded-full border border-gray-300 overflow-hidden">
          {user?.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-pink-500 flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Nickname Input Section */}
      <div className="px-4 py-4">
        <div className="max-w-sm mx-auto">
          <Input
            type="text"
            value={currentNickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Doki01"
            className="w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          />
          <p className="text-gray-400 text-sm mt-2 text-center">
            Please enter 2-10 letters or numbers.
          </p>
        </div>
      </div>

      {/* Complete Button */}
      <div className="px-4 py-8">
        <div className="max-w-sm mx-auto">
          <Button
            onClick={handleComplete}
            disabled={!isFormValid}
            className={`w-full h-12 rounded-lg font-medium transition-colors ${
              isFormValid
                ? "bg-pink-500 hover:bg-pink-600 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {updateProfileMutation.isPending ? "Updating..." : "Complete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
