"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useUser,
  useUpdateProfile,
  useUserProfile,
} from "@/queries/useAuthQueries";
import { PageLoading } from "@/components/common";
import { GapY } from "../../../components/ui/gap";
import { UpdateProfileRequest } from "@/types/api";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.id);
  const updateProfileMutation = useUpdateProfile();

  // 사용자 정보에서 닉네임 초기값 계산
  // profiles 테이블 데이터를 우선적으로 사용하고, 없으면 auth.users 데이터 사용
  const getInitialNickname = () => {
    if (!user) return "";
    return (
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      "Doki01"
    );
  };

  const [nickname, setNickname] = useState<string | null>(null);
  const [hasTouched, setHasTouched] = useState(false);

  // 닉네임 유효성 검사 (영문과 숫자만 허용)
  const validateNickname = (value: string) => {
    const regex = /^[a-zA-Z0-9]{2,10}$/;
    return regex.test(value);
  };

  // 에러 메시지 생성
  const getErrorMessage = (value: string) => {
    if (!hasTouched || value === "") return null;

    // 영문과 숫자가 아닌 문자가 있는지 확인
    const hasInvalidChar = /[^a-zA-Z0-9]/.test(value);
    // 글자수 확인
    const length = value.length;

    if (hasInvalidChar) {
      return "Please enter English letters or numbers only.";
    }
    if (length < 2 || length > 10) {
      return "Please enter 2-10 characters.";
    }

    return null;
  };

  // 완료 버튼 클릭
  const handleComplete = async () => {
    if (!user || !validateNickname(currentNickname as string)) {
      return;
    }

    try {
      const profileData: Record<string, unknown> = {
        full_name: currentNickname,
      };

      await updateProfileMutation.mutateAsync({
        userId: user.id,
        profileData: profileData as UpdateProfileRequest,
      });

      // 성공 시 My Page로 이동
      router.push("/my");
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  // 사용자 정보 로딩 중일 때
  if (userLoading || profileLoading) {
    return <PageLoading message="사용자 정보를 불러오는 중..." />;
  }

  // user 데이터가 로드된 후 nickname이 null이면 초기값 설정, 그 외에는 nickname 사용
  const currentNickname = nickname !== null ? nickname : getInitialNickname();

  const isNicknameValid = validateNickname(currentNickname as string);
  const isFormValid = isNicknameValid && !updateProfileMutation.isPending;
  const errorMessage = getErrorMessage(currentNickname as string);
  const hasError = errorMessage !== null;

  return (
    <div className="text-white bg-transparent flex flex-col flex-1">
      <GapY size={100} />
      {/* Profile Image Section */}
      <div className="flex flex-col items-center">
        <div className="relative rounded-full border-solid border-[1.5px] border-gray overflow-hidden">
          {profile?.avatar_src || user?.user_metadata?.avatar_url ? (
            <Image
              src={
                (profile?.avatar_src as string) ||
                (user?.user_metadata?.avatar_url as string) ||
                ""
              }
              alt="Profile"
              width={120}
              height={120}
              className=" rounded-full"
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
      <GapY size={62} />
      {/* Nickname Input Section */}
      <div className="px-3 py-2">
        <div className="max-w-sm mx-auto">
          <Input
            type="text"
            value={currentNickname as string}
            onChange={e => {
              setNickname(e.target.value);
              if (!hasTouched) setHasTouched(true);
            }}
            onBlur={() => setHasTouched(true)}
            placeholder="Doki01"
            className={`w-full h-13 text-lg text-white border-none placeholder-gray-400 ${
              hasError
                ? "border-pink-dark focus-visible:ring-0 focus-visible:border-pink-dark"
                : ""
            }`}
            style={{
              border: hasError ? "1px solid #ec4899" : "none",
            }}
          />
          <p
            className={`text-sm mt-2 h-5 ${
              hasError ? "text-pink-dark" : "text-gray-400"
            }`}
          >
            {hasError
              ? errorMessage
              : "Please enter 2-10 English letters or numbers only."}
          </p>
        </div>
      </div>

      {/* Complete Button */}
      <div
        className="mt-auto py-4 px-5"
        style={{ boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)" }}
      >
        <Button
          onClick={handleComplete}
          disabled={!isFormValid}
          className={`w-full h-12 rounded-lg text-lg transition-colors ${
            isFormValid
              ? "bg-pink-500 hover:bg-pink-600 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          {updateProfileMutation.isPending ? "Updating..." : "Complete"}
        </Button>
      </div>
    </div>
  );
}
