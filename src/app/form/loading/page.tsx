"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GapY } from "@/components/ui/gap";
import LottieAnimation from "../../../components/common/LottieAnimation";
import { useTranslation } from "@/hooks/useTranslation";

export default function FormLoadingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    // 1초 후에 분석 완료 상태로 변경
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setShowComplete(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    router.push("/form/complete");
  };

  return (
    <div className="bg-transparent flex flex-col flex-1">
      <div className="flex-1 flex flex-col">
        <GapY size={40} />
        {isAnalyzing ? (
          <>
            <div className="flex flex-col text-white items-start px-5">
              <h1 className="title-lg ">{t("form.formLoadingJustAMoment")}</h1>
              <h2 className="title-sm ">{t("form.formLoadingAnalyzing")}</h2>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <LottieAnimation
                src="/logo-loading.lottie"
                width={177}
                height={177}
              />
            </div>
          </>
        ) : showComplete ? (
          <div className="flex flex-col flex-1">
            <div className="flex flex-col items-start px-5">
              <h1 className="title-lg text-white">
                {t("form.formLoadingAllDone")}
              </h1>
              <h1 className="title-lg text-white">
                {t("form.formLoadingStyleResult")}
              </h1>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <LottieAnimation
                src="/check.lottie"
                width={177}
                height={177}
                loop={false}
              />
            </div>
            <div
              className="py-4 px-5"
              style={{
                boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)",
              }}
            >
              <Button
                onClick={handleNext}
                className="w-full h-[52px] bg-pink-500 hover:bg-pink-600"
              >
                <span className="text-white font-medium">{t("form.next")}</span>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
