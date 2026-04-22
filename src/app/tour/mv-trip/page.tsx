import { Metadata } from "next";
import { HeroSection } from "@/features/tour-quiz/components/HeroSection";
import { QuizFlow } from "@/features/tour-quiz/components/QuizFlow";

export const metadata: Metadata = {
  title: "DOKI | BTS MV 로컬 여행 추천",
  description: "BTS MV 촬영지를 따라가는 인터랙티브 설문형 한국 로컬 여행 추천",
};

export default function TourMvTripPage() {
  return (
    <main className="min-h-screen bg-[#101319] px-3 pb-20 pt-4 text-white">
      <div className="mx-auto w-full">
        <HeroSection />
        <QuizFlow />
      </div>
    </main>
  );
}
