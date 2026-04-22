"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionNode } from "@/features/tour-quiz/components/QuestionNode";
import { ResultCard } from "@/features/tour-quiz/components/ResultCard";
import { getQuizQuestions } from "@/features/tour-quiz/quizData";
import { getQuizResult } from "@/features/tour-quiz/resultMapper";
import {
  QuizAnswers,
  QuizOptionId,
  QuizQuestion,
  QuizQuestionId,
  QuizResult,
} from "@/features/tour-quiz/types";

type TransitionState = {
  questionId: QuizQuestionId;
  optionId: QuizOptionId;
  nextQuestion: QuizQuestion | null;
};

export function QuizFlow() {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [editingQuestionId, setEditingQuestionId] =
    useState<QuizQuestionId | null>(null);
  const [transitioning, setTransitioning] = useState<TransitionState | null>(
    null
  );
  const [suppressEntrance, setSuppressEntrance] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  const questionSequence = useMemo(
    () => getQuizQuestions(answers.q1),
    [answers.q1]
  );

  const firstUnansweredIndex = useMemo(() => {
    const index = questionSequence.findIndex(question => !answers[question.id]);
    return index === -1 ? questionSequence.length : index;
  }, [answers, questionSequence]);

  const currentQuestionIndex = useMemo(() => {
    if (editingQuestionId) {
      const editIndex = questionSequence.findIndex(
        question => question.id === editingQuestionId
      );
      if (editIndex >= 0) {
        return editIndex;
      }
    }

    return firstUnansweredIndex;
  }, [editingQuestionId, firstUnansweredIndex, questionSequence]);

  const currentQuestion = questionSequence[currentQuestionIndex] ?? null;
  const answeredQuestions = questionSequence.filter(
    (_, index) => index < currentQuestionIndex
  );
  const isComplete =
    questionSequence.length > 0 &&
    firstUnansweredIndex === questionSequence.length &&
    !editingQuestionId &&
    !transitioning;

  const result = useMemo(
    () => (isComplete ? getQuizResult(answers) : null),
    [answers, isComplete]
  );
  const transitionResult = useMemo(() => {
    if (!transitioning || transitioning.nextQuestion) {
      return null;
    }

    if (!currentQuestion) {
      return null;
    }

    return getQuizResult({
      ...answers,
      [currentQuestion.id]: transitioning.optionId,
    });
  }, [answers, currentQuestion, transitioning]);

  const commitAnswer = (question: QuizQuestion, optionId: QuizOptionId) => {
    const questionIndex = questionSequence.findIndex(
      sequenceQuestion => sequenceQuestion.id === question.id
    );

    const nextAnswers = questionSequence.reduce<QuizAnswers>(
      (acc, sequenceQuestion, index) => {
        if (index < questionIndex) {
          const existing = answers[sequenceQuestion.id];
          if (existing) {
            acc[sequenceQuestion.id] = existing;
          }
        }

        if (index === questionIndex) {
          acc[sequenceQuestion.id] = optionId;
        }

        return acc;
      },
      {}
    );

    setAnswers(nextAnswers);
    setEditingQuestionId(null);
    setTransitioning(null);
    setSuppressEntrance(true);
  };

  const handleSelect = (question: QuizQuestion, optionId: QuizOptionId) => {
    if (transitioning) {
      return;
    }

    const questionIndex = questionSequence.findIndex(
      sequenceQuestion => sequenceQuestion.id === question.id
    );

    const simulatedAnswers = questionSequence.reduce<QuizAnswers>(
      (acc, sequenceQuestion, index) => {
        if (index < questionIndex) {
          const existing = answers[sequenceQuestion.id];
          if (existing) {
            acc[sequenceQuestion.id] = existing;
          }
        }

        if (index === questionIndex) {
          acc[sequenceQuestion.id] = optionId;
        }

        return acc;
      },
      {}
    );

    const nextSequence = getQuizQuestions(simulatedAnswers.q1);
    const nextQuestion = nextSequence[questionIndex + 1] ?? null;

    setTransitioning({
      questionId: question.id,
      optionId,
      nextQuestion,
    });
    setSuppressEntrance(false);

    window.setTimeout(() => {
      commitAnswer(question, optionId);
    }, 980);
  };

  const handleEdit = (questionId: QuizQuestionId) => {
    setEditingQuestionId(questionId);
    setTransitioning(null);
    setSuppressEntrance(false);
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleBack = () => {
    if (!currentQuestionIndex) {
      return;
    }

    const previousQuestion = questionSequence[currentQuestionIndex - 1];
    if (previousQuestion) {
      setEditingQuestionId(previousQuestion.id);
      setTransitioning(null);
      setSuppressEntrance(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setEditingQuestionId(null);
    setTransitioning(null);
    setSuppressEntrance(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayedSelectedOptionId =
    transitioning &&
    currentQuestion &&
    transitioning.questionId === currentQuestion.id
      ? transitioning.optionId
      : currentQuestion
        ? answers[currentQuestion.id]
        : undefined;

  const routeLabel = transitioning?.nextQuestion
    ? `Q${transitioning.nextQuestion.step}`
    : transitioning
      ? "RESULT"
      : undefined;

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const resultElement = document.getElementById("tour-quiz-result");
    if (resultElement) {
      window.setTimeout(() => {
        resultElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 220);
    }
  }, [isComplete]);

  return (
    <section ref={containerRef} className="mt-8">
      <div className="mx-auto flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gray-400">
            Interactive Flow
          </p>
          <h2 className="mt-3 break-keep text-2xl font-semibold text-white">
            질문을 따라 내려가면 당신의 MV 여행 동선이 완성돼요
          </h2>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="rounded-full border border-white/10 bg-white/[0.03] px-4 text-gray-100 hover:bg-white/[0.06]"
          onClick={resetQuiz}
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden min-[360px]:inline">다시 고르기</span>
        </Button>
      </div>

      {answeredQuestions.length > 0 && !isComplete && (
        <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
              Current Route
            </p>
            <Button
              type="button"
              variant="ghost"
              className="h-8 rounded-full border border-white/10 px-3 text-xs text-gray-200 hover:bg-white/[0.05]"
              onClick={handleBack}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              이전 질문
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {answeredQuestions.map(question => {
              const selectedOption = question.options.find(
                option => option.id === answers[question.id]
              );

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => handleEdit(question.id)}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-left text-xs text-gray-200 transition-colors hover:bg-white/[0.08]"
                >
                  <span className="mr-2 text-gray-500">
                    {String(question.step).padStart(2, "0")}
                  </span>
                  {selectedOption?.label ?? answers[question.id]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!isComplete && currentQuestion && (
        <div className="mt-6">
          {transitioning?.questionId === currentQuestion.id ? (
            <div className="overflow-hidden rounded-[32px]">
              <div className="flex w-[200%] animate-[questionTrackSlide_900ms_ease-in-out_forwards]">
                <div className="w-1/2 shrink-0 pr-5">
                  <QuestionNode
                    question={currentQuestion}
                    selectedOptionId={displayedSelectedOptionId}
                    hasAnsweredBefore={Boolean(displayedSelectedOptionId)}
                    transitioningOptionId={transitioning.optionId}
                    routeLabel={routeLabel}
                    onSelect={optionId =>
                      handleSelect(currentQuestion, optionId)
                    }
                  />
                </div>

                <div className="w-1/2 shrink-0 pl-5">
                  {transitioning.nextQuestion ? (
                    <div className="animate-[fadeSlideIn_320ms_ease-out]">
                      <QuestionNode
                        question={transitioning.nextQuestion}
                        hasAnsweredBefore={false}
                        onSelect={() => {}}
                      />
                    </div>
                  ) : (
                    <div className="animate-[fadeSlideIn_320ms_ease-out]">
                      <ResultCard
                        result={transitionResult ?? emptyResultFallback()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              key={`${currentQuestion.id}-${editingQuestionId ? "edit" : "live"}`}
              className={
                suppressEntrance
                  ? ""
                  : "animate-[fadeSlideIn_500ms_ease-out] motion-reduce:animate-none"
              }
            >
              <QuestionNode
                question={currentQuestion}
                selectedOptionId={displayedSelectedOptionId}
                hasAnsweredBefore={Boolean(displayedSelectedOptionId)}
                onSelect={optionId => handleSelect(currentQuestion, optionId)}
              />
            </div>
          )}
        </div>
      )}

      {isComplete && result && (
        <div
          id="tour-quiz-result"
          className="mt-10 animate-[fadeSlideIn_650ms_ease-out] motion-reduce:animate-none"
        >
          <ResultCard result={result} />
        </div>
      )}
    </section>
  );
}

function emptyResultFallback(): QuizResult {
  return {
    region: "",
    mvTitle: "",
    mvLocation: "",
    relatedSpots: [],
    restaurant: "",
    dessert: "",
    stay: "",
    stylingPackage: "",
    shareTitle: "",
    copy: "",
    highlight: "",
    narrative: [],
    packageCtaTitle: "",
    packageCtaDescription: "",
  };
}
