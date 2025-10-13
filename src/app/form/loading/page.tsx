"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GapY } from "@/components/ui/gap";
import { FormLoading } from "@/components/common";
import LottieAnimation from "../../../components/common/LottieAnimation";

export default function FormLoadingPage() {
  const router = useRouter();
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
        {!isAnalyzing ? (
          <>
            <div className="flex flex-col text-white items-start">
              <h1 className="title-lg ">Just a moment, please.</h1>
              <h2 className="title-sm ">
                Analyzing your input to recommend the most suitable package.
              </h2>
            </div>
            <div className="self-center">
              <LottieAnimation
                src="/dummy-loading.lottie"
                width={100}
                height={100}
              />
            </div>
          </>
        ) : showComplete ? (
          <>
            <div className="flex flex-col items-start">
              <h1 className="title-lg text-white">All done!</h1>
              <h1 className="title-lg text-white">
                Here&apos;s your style result
              </h1>
            </div>
            <div className="self-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="207"
                height="207"
                viewBox="0 0 207 207"
                fill="none"
              >
                <g clipPath="url(#clip0_497_1916)">
                  <mask
                    id="mask0_497_1916"
                    style={{ maskType: "luminance" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="207"
                    height="207"
                  >
                    <path d="M207 0H0V207H207V0Z" fill="white" />
                  </mask>
                  <g mask="url(#mask0_497_1916)">
                    <mask
                      id="mask1_497_1916"
                      style={{ maskType: "luminance" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="-1"
                      width="207"
                      height="209"
                    >
                      <path
                        d="M0 -0.00012207H207V207H0V-0.00012207Z"
                        fill="white"
                      />
                    </mask>
                    <g mask="url(#mask1_497_1916)">
                      <path
                        d="M103.5 44.4519C136.088 44.4519 162.548 70.9114 162.548 103.5C162.548 136.089 136.088 162.548 103.5 162.548C70.9111 162.548 44.4517 136.089 44.4517 103.5C44.4517 70.9114 70.9111 44.4519 103.5 44.4519Z"
                        fill="#F92595"
                      />
                      <path
                        d="M85.125 102.625L99.8101 115.645L125.657 91.3268"
                        stroke="#FFFFFE"
                        strokeWidth="7.96154"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_497_1916">
                    <rect width="207" height="207" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="mt-auto py-4">
              <Button
                onClick={handleNext}
                className="w-full h-[52px] bg-pink-500 hover:bg-pink-600"
              >
                <span className="text-white font-medium">Next</span>
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
