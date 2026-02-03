"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GapY } from "@/components/ui/gap";
import { ProgressBar } from "@/components/form/ProgressBar";
import { SeoulMap } from "@/components/common/SeoulMap";
import { FormLoading } from "@/components/common";
import { Step5Schema, Step5Data } from "@/types/form";
import { useFormStore } from "@/lib/store";
import { useUser } from "@/queries/useAuthQueries";
import { useSubmitSurveyForm } from "@/queries/useSurveyQueries";

export default function FormPage5() {
  const router = useRouter();
  const { isAuthenticated, isLoggedIn } = useUser();
  const { formData, updateStep5, setCurrentStep } = useFormStore();
  const submitFormMutation = useSubmitSurveyForm();

  const form = useForm<Step5Data>({
    resolver: zodResolver(Step5Schema),
    defaultValues: {
      selectedRegions: formData.selectedRegions || [],
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;
  const selectedRegions = watch("selectedRegions");

  // 컴포넌트 마운트 시 현재 스텝 설정 및 인증 확인
  useEffect(() => {
    setCurrentStep(5);

    // 로그인 확인 (loading이 완료된 후에만)
    if (!isLoggedIn && !isAuthenticated) {
      router.push("/login");
    }
  }, [setCurrentStep, isAuthenticated, isLoggedIn, router]);

  // 비로그인 시 로그인 페이지로 리다이렉트 중일 때 로딩 표시
  if (!isLoggedIn && !isAuthenticated) {
    return <FormLoading />;
  }

  const handleRegionClick = (regionId: string) => {
    const currentSelected = selectedRegions || [];

    if (currentSelected.includes(regionId)) {
      // 이미 선택된 지역이면 제거
      setValue(
        "selectedRegions",
        currentSelected.filter(id => id !== regionId)
      );
    } else {
      // 새로운 지역이면 추가
      setValue("selectedRegions", [...currentSelected, regionId]);
    }
  };

  const onSubmit = async (data: Step5Data) => {
    // Zustand store에 마지막 스텝 데이터 저장
    updateStep5(data);

    // 전체 폼 데이터 가져오기 (업데이트된 데이터 포함)
    const completeFormData = { ...formData, ...data };

    // React Query mutation 실행
    submitFormMutation
      .mutateAsync(completeFormData)
      .then(() => router.push("/form/loading"))
      .catch(() => {
        // 에러는 mutation의 isError로 표시됨
      });
  };

  return (
    <div className="text-white bg-transparent flex flex-col flex-1">
      <div className="flex-1 flex flex-col">
        <GapY size={8} />
        <ProgressBar />
        <GapY size={12} />

        {/* Header */}
        <div className="px-5">
          <h1 className="h-[68px] text-xl font-semibold mb-6">
            Where would you like to visit?
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5">
            <SeoulMap
              selectedIds={selectedRegions || []}
              onSelect={handleRegionClick}
              className="w-full max-w-[480px]"
            />
          </div>

          <GapY size={12} />

          <div className="flex justify-center">
            {selectedRegions && selectedRegions.length > 0 && (
              <div className="min-w-[200px] p-3 bg-gray rounded-[32px] text-lg text-center w-fit">
                {selectedRegions.length === 1
                  ? selectedRegions[0]
                  : `${selectedRegions[0]}, ... and ${selectedRegions.length - 1} others`}
              </div>
            )}
          </div>

          {/* Error Display */}
          {errors.selectedRegions && (
            <div className="mt-4 text-red-400 text-sm text-center px-[16px]">
              {errors.selectedRegions.message}
            </div>
          )}

          {/* Submit Error Display */}
          {submitFormMutation.isError && (
            <div className="mt-4 text-red-400 text-sm text-center px-[16px]">
              {(submitFormMutation.error as Error)?.message ||
                "폼 제출 중 오류가 발생했습니다."}
            </div>
          )}
        </form>
      </div>

      {/* Navigation */}
      <div
        className="mt-auto py-4 px-5"
        style={{ boxShadow: "inset 0 6px 6px -6px rgba(255, 255, 255, 0.12)" }}
      >
        <Button
          className="w-full h-[52px]"
          disabled={selectedRegions && selectedRegions.length === 0}
          onClick={handleSubmit(onSubmit)}
        >
          <span className="text-white font-medium">
            {submitFormMutation.isPending ? "제출 중..." : "제출하기"}
          </span>
        </Button>
      </div>
    </div>
  );
}
