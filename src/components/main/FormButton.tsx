"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/common/Icons";
import { ButtonLoading } from "@/components/common";
import { TranslatedText } from "@/components/main/TranslatedText";
import { useUser } from "@/queries/useAuthQueries";
import { useSurveyForCurrentUser } from "@/queries/useSurveyQueries";

/**
 * 랜딩 페이지 CTA 버튼
 * - 비로그인: Discover your style → /form/step1
 * - 로그인 + 설문 있음: Your K-pop style is Ready → /form/complete
 * - 로그인 + 설문 없음: Discover your style → /form/step1
 */
export function FormButton() {
  const { isAuthenticated } = useUser();
  const { data: survey, isLoading } = useSurveyForCurrentUser(isAuthenticated);

  // 비로그인: 폼 시작 페이지로
  if (!isAuthenticated) {
    return (
      <Link href="/form/step1">
        <Button className="w-full bg-pink-500 hover:bg-pink-600 border-0 px-[12px] py-[8px] h-[52px] flex justify-between items-center cursor-pointer">
          <div className="text-md">
            <TranslatedText translationKey="discoverStyle" />
          </div>
          <div className="flex w-[28px] items-center justify-center py-[6px]">
            <ArrowRightIcon
              color="white"
              width={7}
              height={16}
              className="size-auto"
            />
          </div>
        </Button>
      </Link>
    );
  }

  // 로그인 + 로딩 중
  if (isLoading) {
    return (
      <Button className="w-full bg-pink-500 hover:bg-pink-600 border-0 px-[12px] py-[8px] h-[52px] flex justify-center items-center cursor-pointer">
        <ButtonLoading size="sm" />
      </Button>
    );
  }

  // 로그인 + 설문 있음: complete로
  if (survey) {
    return (
      <Link href="/form/complete">
        <Button className="w-full h-[52px] flex justify-between items-center">
          <div className="text-lg">Your K-pop style is Ready</div>
          <div className="flex w-[28px] items-center justify-center py-[6px]">
            <ArrowRightIcon
              color="white"
              width={7}
              height={16}
              className="size-auto"
            />
          </div>
        </Button>
      </Link>
    );
  }

  // 로그인 + 설문 없음: step1으로
  return (
    <Link href="/form/step1">
      <Button className="w-full bg-pink-500 hover:bg-pink-600 border-0 px-[12px] py-[8px] h-[52px] flex justify-between items-center cursor-pointer">
        <div className="text-md">
          <TranslatedText translationKey="discoverStyle" />
        </div>
        <div className="flex w-[28px] items-center justify-center py-[6px]">
          <ArrowRightIcon
            color="white"
            width={7}
            height={16}
            className="size-auto"
          />
        </div>
      </Button>
    </Link>
  );
}
