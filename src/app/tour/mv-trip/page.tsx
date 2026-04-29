import { Metadata } from "next";
import { Suspense } from "react";
import { PageLoading } from "@/components/common";
import { TourSurveyExperience } from "@/features/tour-survey/components/TourSurveyExperience";

export const metadata: Metadata = {
  title: "DOKI | 여행 설문 추천",
  description:
    "설문 답변과 DOKI 추천 상품을 기반으로 만드는 한국 로컬 여행 추천",
};

export default function TourMvTripPage() {
  return (
    <Suspense fallback={<PageLoading message="여행 설문을 준비하는 중..." />}>
      <TourSurveyExperience />
    </Suspense>
  );
}
