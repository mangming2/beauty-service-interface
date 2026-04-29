"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageLoading } from "@/components/common";
import { Button } from "@/components/ui/button";
import { TourSurveyResultView } from "@/features/tour-survey/components/TourSurveyResultView";
import {
  useTourSurveyRecommendation,
  useTourSurveySharePayload,
} from "@/queries/useTourSurveyQueries";
import type { ApiError } from "@/lib/apiClient";

interface TourSurveyResultPageClientProps {
  submissionId: number;
}

function describeResultError(error: unknown) {
  const apiError = error as ApiError | undefined;

  if (apiError?.status === 404) {
    return "아직 생성된 결과가 없거나 접근할 수 없는 설문 결과예요.";
  }

  if (apiError?.status === 502 || apiError?.status === 503) {
    return "공공 API 응답 문제로 결과 조회가 불안정해요. 잠시 후 다시 시도해 주세요.";
  }

  return apiError?.message ?? "결과를 불러오지 못했어요.";
}

export function TourSurveyResultPageClient({
  submissionId,
}: TourSurveyResultPageClientProps) {
  const {
    data: recommendation,
    isLoading,
    error,
  } = useTourSurveyRecommendation(submissionId);
  const { data: sharePayload } = useTourSurveySharePayload(
    submissionId,
    Boolean(recommendation)
  );

  if (isLoading) {
    return <PageLoading message="설문 결과를 불러오는 중..." />;
  }

  if (error || !recommendation) {
    return (
      <div className="min-h-screen bg-[#101319] px-4 py-12 text-white">
        <div className="mx-auto max-w-[412px] rounded-[24px] border border-red-300/20 bg-red-500/10 p-5">
          <Link
            href="/tour/mv-trip"
            className="inline-flex items-center gap-2 text-sm text-red-100 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            설문으로 돌아가기
          </Link>
          <h1 className="mt-5 text-lg font-semibold">
            결과를 불러오지 못했어요
          </h1>
          <p className="mt-3 break-keep text-sm leading-6 text-red-100">
            {describeResultError(error)}
          </p>
          <Button asChild className="mt-5 h-11 rounded-full">
            <Link href="/tour/mv-trip">새 설문 시작하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TourSurveyResultView
      recommendation={recommendation}
      sharePayload={sharePayload}
      showBackLink
    />
  );
}
