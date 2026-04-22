"use client";

import { OptionBranchCard } from "@/features/tour-quiz/components/OptionBranchCard";
import { QuizOptionId, QuizQuestion } from "@/features/tour-quiz/types";
import { cn } from "@/lib/utils";

type QuestionNodeProps = {
  question: QuizQuestion;
  selectedOptionId?: QuizOptionId;
  hasAnsweredBefore: boolean;
  transitioningOptionId?: QuizOptionId;
  routeLabel?: string;
  transitionPreviewTitle?: string;
  transitionPreviewStep?: number | null;
  onSelect: (optionId: QuizOptionId) => void;
};

export function QuestionNode({
  question,
  selectedOptionId,
  hasAnsweredBefore,
  transitioningOptionId,
  routeLabel,
  transitionPreviewTitle,
  transitionPreviewStep,
  onSelect,
}: QuestionNodeProps) {
  return (
    <section className="relative mx-auto w-full">
      <div className="absolute left-6 top-0 h-full w-px bg-[linear-gradient(180deg,_rgba(255,255,255,0.12),_transparent)]" />

      <div
        className={cn(
          "relative overflow-visible rounded-[28px] border bg-[linear-gradient(180deg,_rgba(29,33,41,0.95),_rgba(17,20,27,0.96))] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)]",
          selectedOptionId ? "border-pink-300/30" : "border-white/10"
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,37,149,0.14),_transparent_28%)]" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                selectedOptionId
                  ? "border-pink-300/50 bg-pink-400/15 text-pink-100"
                  : "border-white/10 bg-white/[0.04] text-gray-200"
              )}
            >
              {question.step}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-gray-400">
                {question.eyebrow}
              </p>
              <h2 className="mt-1 break-keep text-xl font-semibold leading-8 text-white">
                {question.title}
              </h2>
            </div>
          </div>

          {question.subtitle && (
            <p className="mt-4 break-keep pl-[52px] text-sm leading-7 text-gray-300">
              {question.subtitle}
            </p>
          )}

          <div className="mt-6 grid gap-3">
            {question.options.map(option => (
              <OptionBranchCard
                key={option.id}
                label={option.label}
                description={option.description}
                badge={option.badge}
                visualTitle={option.visualTitle}
                visualSubtitle={option.visualSubtitle}
                visualTheme={option.visualTheme}
                selected={selectedOptionId === option.id}
                muted={hasAnsweredBefore && selectedOptionId !== option.id}
                showRouteOut={transitioningOptionId === option.id}
                routeLabel={routeLabel}
                transitionPreviewTitle={
                  transitioningOptionId === option.id
                    ? transitionPreviewTitle
                    : undefined
                }
                transitionPreviewStep={
                  transitioningOptionId === option.id
                    ? transitionPreviewStep
                    : null
                }
                onSelect={() => onSelect(option.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
