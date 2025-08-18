"use client";

import { usePathname } from "next/navigation";

export const ProgressBar = () => {
  const pathname = usePathname();

  // 현재 단계를 경로에서 추출
  const getCurrentStep = () => {
    if (pathname.includes("/form/step1")) return 1;
    if (pathname.includes("/form/step2")) return 2;
    if (pathname.includes("/form/step3")) return 3;
    if (pathname.includes("/form/step4")) return 4;
    if (pathname.includes("/form/step5")) return 5;
    return 1;
  };

  const currentStep = getCurrentStep();
  const totalSteps = 5;

  return (
    <div className="px-[20px]">
      <div className="flex items-center gap-[6px]">
        {/* Progress Bar */}
        <div className="flex-1 h-[2px] bg-[#D9D9D9] rounded-full overflow-hidden">
          <div
            className="h-full bg-pink-font transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Counter */}
        <span className="text-white caption-sm font-medium text-right">
          {currentStep} / {totalSteps}
        </span>
      </div>
    </div>
  );
};
