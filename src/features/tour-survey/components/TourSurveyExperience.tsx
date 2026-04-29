"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  MapPin,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/common";
import { TourSurveyResultView } from "@/features/tour-survey/components/TourSurveyResultView";
import {
  useCreateTourSurveySubmission,
  useGenerateTourSurveyRecommendation,
  useTourSurveyForm,
  useTourSurveySharePayload,
} from "@/queries/useTourSurveyQueries";
import type {
  TourSurveyOption,
  TourSurveyQuestion,
  TourSurveyRecommendation,
} from "@/api/tourSurvey";
import type { ApiError } from "@/lib/apiClient";

const DEFAULT_FORM_ID = Number(
  process.env.NEXT_PUBLIC_TOUR_SURVEY_FORM_ID ?? "1"
);
const DEFAULT_BASE_YM = process.env.NEXT_PUBLIC_TOUR_SURVEY_BASE_YM ?? "202603";

function parseFormId(value: string | null) {
  if (!value) {
    return Number.isFinite(DEFAULT_FORM_ID) && DEFAULT_FORM_ID > 0
      ? DEFAULT_FORM_ID
      : undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function sortQuestions(questions: TourSurveyQuestion[]) {
  return [...questions]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(question => ({
      ...question,
      options: [...question.options].sort((a, b) => a.sortOrder - b.sortOrder),
    }));
}

function describeApiError(error: unknown) {
  const apiError = error as ApiError | undefined;

  if (apiError?.status === 502 || apiError?.status === 503) {
    return "공공 API 응답이 불안정해서 결과를 만들지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  if (apiError?.status === 404) {
    return "설문 또는 결과를 찾지 못했어요. formId와 활성 상태를 확인해 주세요.";
  }

  if (apiError?.status === 401) {
    return "로그인이 만료되었어요. 다시 로그인한 뒤 시도해 주세요.";
  }

  return apiError?.message ?? "요청 처리 중 오류가 발생했어요.";
}

function optionMeta(option: TourSurveyOption) {
  return [option.placeLabel, option.categoryTag, option.styleTag]
    .filter(Boolean)
    .join(" · ");
}

export function TourSurveyExperience() {
  const searchParams = useSearchParams();
  const formId = parseFormId(searchParams.get("formId"));
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submissionId, setSubmissionId] = useState<number>();
  const [recommendation, setRecommendation] =
    useState<TourSurveyRecommendation | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);

  const { data: form, isLoading, error } = useTourSurveyForm(formId);
  const createSubmission = useCreateTourSurveySubmission();
  const generateRecommendation = useGenerateTourSurveyRecommendation();
  const { data: sharePayload } = useTourSurveySharePayload(
    submissionId,
    Boolean(recommendation)
  );

  const questions = useMemo(
    () => (form ? sortQuestions(form.questions) : []),
    [form]
  );
  const currentQuestion = questions[currentIndex] ?? null;
  const selectedOptionId = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;
  const answeredRequiredCount = questions.filter(
    question => !question.required || answers[question.id] !== undefined
  ).length;
  const isComplete =
    questions.length > 0 && answeredRequiredCount === questions.length;
  const isSubmitting =
    createSubmission.isPending || generateRecommendation.isPending;

  useEffect(() => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmissionId(undefined);
    setRecommendation(null);
    setResultError(null);
  }, [formId]);

  const selectOption = (questionId: number, optionId: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const moveNext = () => {
    if (!currentQuestion || selectedOptionId === undefined) {
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const moveBack = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const resetSurvey = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmissionId(undefined);
    setRecommendation(null);
    setResultError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generateForSubmission = async (nextSubmissionId: number) => {
    const result = await generateRecommendation.mutateAsync({
      submissionId: nextSubmissionId,
      params: {
        useLlm: true,
        attractionSize: 5,
        productSize: 3,
        ...(DEFAULT_BASE_YM ? { baseYm: DEFAULT_BASE_YM } : {}),
      },
    });
    setRecommendation(result);
    setResultError(null);
  };

  const submitSurvey = async () => {
    if (!formId || !isComplete) {
      return;
    }

    const payloadAnswers = questions
      .map(question => ({
        questionId: question.id,
        selectedOptionId: answers[question.id],
      }))
      .filter(
        (answer): answer is { questionId: number; selectedOptionId: number } =>
          answer.selectedOptionId !== undefined
      );

    setResultError(null);

    try {
      const submission = await createSubmission.mutateAsync({
        formId,
        answers: payloadAnswers,
      });
      setSubmissionId(submission.submissionId);
      await generateForSubmission(submission.submissionId);
    } catch (submitError) {
      setResultError(describeApiError(submitError));
    }
  };

  const retryRecommendation = async () => {
    if (!submissionId) {
      return;
    }

    try {
      setResultError(null);
      await generateForSubmission(submissionId);
    } catch (retryError) {
      setResultError(describeApiError(retryError));
    }
  };

  if (!formId) {
    return (
      <div className="min-h-screen bg-[#101319] px-4 py-12 text-white">
        <div className="mx-auto max-w-[412px] rounded-[24px] border border-red-300/20 bg-red-500/10 p-5">
          <h1 className="text-lg font-semibold">설문 ID가 필요해요</h1>
          <p className="mt-3 break-keep text-sm leading-6 text-red-100">
            URL에 `?formId=1`처럼 활성 설문 ID를 넣거나
            `NEXT_PUBLIC_TOUR_SURVEY_FORM_ID`를 설정해 주세요.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <PageLoading message="여행 설문을 불러오는 중..." />;
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-[#101319] px-4 py-12 text-white">
        <div className="mx-auto max-w-[412px] rounded-[24px] border border-red-300/20 bg-red-500/10 p-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-red-100 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Link>
          <h1 className="mt-5 text-lg font-semibold">
            설문을 불러오지 못했어요
          </h1>
          <p className="mt-3 break-keep text-sm leading-6 text-red-100">
            {describeApiError(error)}
          </p>
        </div>
      </div>
    );
  }

  if (recommendation) {
    return (
      <TourSurveyResultView
        recommendation={recommendation}
        sharePayload={sharePayload}
        onRestart={resetSurvey}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#101319] px-4 pb-16 pt-4 text-white">
      <div className="mx-auto max-w-[412px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로
        </Link>

        <section className="mt-5 rounded-[28px] border border-pink-300/20 bg-[radial-gradient(circle_at_top_left,_rgba(249,37,149,0.24),_transparent_34%),linear-gradient(180deg,_rgba(33,36,45,0.98),_rgba(17,19,26,0.98))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.26)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.28em] text-pink-200">
              Tour Survey
            </p>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-gray-300">
              #{form.id}
            </span>
          </div>
          <h1 className="mt-4 break-keep text-[2rem] font-semibold leading-tight">
            {form.name}
          </h1>
          {form.description && (
            <p className="mt-3 break-keep text-sm leading-7 text-gray-300">
              {form.description}
            </p>
          )}
          <div className="mt-5 flex items-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.04] px-3 py-3">
            <Sparkles className="h-4 w-4 shrink-0 text-pink-100" />
            <p className="break-keep text-sm leading-6 text-gray-200">
              답변을 저장한 뒤 공공 관광지 데이터와 DOKI 추천 상품으로 결과를
              만들어드려요.
            </p>
          </div>
        </section>

        <section className="mt-5">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.22em] text-gray-400">
                Progress
              </p>
              <p className="text-xs text-gray-400">
                {Math.min(currentIndex + 1, questions.length)} /{" "}
                {questions.length}
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,_#f92595,_#2dd4bf)] transition-all"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            {questions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {questions.map((question, index) => {
                  const hasAnswer = answers[question.id] !== undefined;
                  const active = index === currentIndex;

                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-xs font-semibold transition-colors ${
                        active
                          ? "border-pink-200/50 bg-pink-400/20 text-white"
                          : hasAnswer
                            ? "border-emerald-200/30 bg-emerald-400/10 text-emerald-100"
                            : "border-white/10 bg-white/[0.04] text-gray-400"
                      }`}
                    >
                      {hasAnswer ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        index + 1
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {currentQuestion && (
          <section className="mt-5 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,_rgba(33,36,45,0.98),_rgba(20,22,29,0.98))] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.18)]">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">
              Question {currentIndex + 1}
            </p>
            <h2 className="mt-3 break-keep text-2xl font-semibold leading-tight">
              {currentQuestion.title}
            </h2>
            {currentQuestion.description && (
              <p className="mt-3 break-keep text-sm leading-7 text-gray-300">
                {currentQuestion.description}
              </p>
            )}

            <div className="mt-5 grid gap-3">
              {currentQuestion.options.map(option => {
                const active = selectedOptionId === option.id;
                const meta = optionMeta(option);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectOption(currentQuestion.id, option.id)}
                    className={`group flex gap-3 rounded-[22px] border p-3 text-left transition-colors ${
                      active
                        ? "border-pink-300/60 bg-pink-400/10"
                        : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                    }`}
                  >
                    {option.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={option.imageUrl}
                        alt=""
                        className="h-20 w-20 shrink-0 rounded-[18px] object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,_rgba(249,37,149,0.25),_rgba(45,212,191,0.14))]">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="break-keep text-base font-semibold leading-6 text-white">
                          {option.label}
                        </h3>
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            active
                              ? "border-pink-100 bg-pink-400 text-white"
                              : "border-white/20 text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      </div>
                      {option.description && (
                        <p className="mt-2 break-keep text-sm leading-6 text-gray-300">
                          {option.description}
                        </p>
                      )}
                      {meta && (
                        <p className="mt-2 break-keep text-xs leading-5 text-gray-500">
                          {meta}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {resultError && (
          <div className="mt-5 rounded-[20px] border border-red-300/20 bg-red-500/10 p-4">
            <p className="break-keep text-sm leading-6 text-red-100">
              {resultError}
            </p>
            {submissionId && (
              <Button
                type="button"
                variant="gray"
                className="mt-3 h-10 rounded-full border border-white/10 bg-[#23262d] text-white hover:bg-[#2c3038]"
                onClick={retryRecommendation}
                disabled={generateRecommendation.isPending}
              >
                {generateRecommendation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                결과 다시 생성
              </Button>
            )}
          </div>
        )}

        <div className="mt-6 grid grid-cols-[auto_1fr] gap-3">
          <Button
            type="button"
            variant="gray"
            className="h-12 rounded-full border border-white/10 bg-[#23262d] px-5 text-white hover:bg-[#2c3038]"
            onClick={moveBack}
            disabled={currentIndex === 0 || isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button
              type="button"
              className="h-12 rounded-full"
              onClick={moveNext}
              disabled={selectedOptionId === undefined || isSubmitting}
            >
              다음 질문
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              className="h-12 rounded-full"
              onClick={submitSurvey}
              disabled={!isComplete || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isSubmitting ? "추천 생성 중..." : "추천 결과 만들기"}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
