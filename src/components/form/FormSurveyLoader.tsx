"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFormStore } from "@/lib/store";
import { useSurveyForCurrentUser } from "@/queries/useSurveyQueries";
import { surveyToFormData } from "@/lib/surveyUtils";
import { FormLoading } from "@/components/common";

interface FormSurveyLoaderProps {
  children: React.ReactNode;
}

const FORM_STEP_PATTERN = /^\/form\/step\d+$/;

/**
 * 폼 step 페이지 진입 시 백엔드 설문 데이터를 form store에 동기화
 * - 설문 있음: store에 로드 후 폼 표시
 * - 설문 없음: 빈 폼 표시
 * - complete/loading 페이지에서는 스킵
 */
export function FormSurveyLoader({ children }: FormSurveyLoaderProps) {
  const pathname = usePathname();
  const isStepPage = FORM_STEP_PATTERN.test(pathname ?? "");
  const { data: survey, isLoading } = useSurveyForCurrentUser(isStepPage);
  const updateFormData = useFormStore(state => state.updateFormData);
  const [hasSynced, setHasSynced] = useState(!isStepPage);

  useEffect(() => {
    if (!isStepPage) {
      setHasSynced(true);
      return;
    }
    if (isLoading) return;

    // store 업데이트 후 children 렌더 (폼이 올바른 defaultValues로 마운트되도록)
    if (survey) {
      updateFormData(surveyToFormData(survey));
    }
    setHasSynced(true);
  }, [isStepPage, isLoading, survey, updateFormData]);

  if (isStepPage && (!hasSynced || isLoading)) {
    return <FormLoading />;
  }

  return <>{children}</>;
}
