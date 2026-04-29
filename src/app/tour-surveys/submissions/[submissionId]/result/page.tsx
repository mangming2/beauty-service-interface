import { Metadata } from "next";
import { TourSurveyResultPageClient } from "@/features/tour-survey/components/TourSurveyResultPageClient";

export const metadata: Metadata = {
  title: "DOKI | 여행 설문 결과",
  description: "DOKI 여행 설문 추천 결과",
};

interface TourSurveyResultPageProps {
  params: Promise<{
    submissionId: string;
  }>;
}

export default async function TourSurveyResultPage({
  params,
}: TourSurveyResultPageProps) {
  const { submissionId } = await params;
  const parsedSubmissionId = Number(submissionId);

  return (
    <TourSurveyResultPageClient
      submissionId={
        Number.isFinite(parsedSubmissionId) && parsedSubmissionId > 0
          ? parsedSubmissionId
          : -1
      }
    />
  );
}
