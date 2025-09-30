"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/common/Icons";
import { TranslatedText } from "@/components/main/TranslatedText";
import { useAuth } from "@/hooks/useAuth";
import { useUserFormSubmission } from "@/hooks/useFormQueries";

export function FormButton() {
  const { user, isAuthenticated } = useAuth();
  const { data: formSubmission, isLoading } = useUserFormSubmission(user?.id);

  // 로딩 중이거나 인증되지 않은 경우 기본 링크 제공
  if (isLoading || !isAuthenticated) {
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

  // 폼을 이미 작성한 경우 complete 페이지로 이동
  const targetUrl = formSubmission ? "/form/complete" : "/form/step1";

  return (
    <Link href={targetUrl}>
      <Button className="w-full  h-[52px] flex justify-between items-center">
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
