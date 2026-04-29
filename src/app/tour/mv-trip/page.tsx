import { Metadata } from "next";
import { Suspense } from "react";
import { PageLoading } from "@/components/common";
import { TourSurveyListView } from "@/features/tour-survey/components/TourSurveyListView";

export const metadata: Metadata = {
  title: "DOKI | Trip Finder",
  description: "취향에 맞는 한국 로컬 여행 설문을 선택해 보세요.",
};

export default function TourMvTripPage() {
  return (
    <Suspense fallback={<PageLoading message="설문 목록을 불러오는 중..." />}>
      <TourSurveyListView />
    </Suspense>
  );
}
