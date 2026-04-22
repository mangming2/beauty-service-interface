"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type OptionBranchCardProps = {
  label: string;
  description?: string;
  badge?: string;
  visualTitle?: string;
  visualSubtitle?: string;
  visualTheme?: "pink" | "violet" | "blue" | "emerald" | "amber";
  selected: boolean;
  muted: boolean;
  showRouteOut?: boolean;
  routeLabel?: string;
  transitionPreviewTitle?: string;
  transitionPreviewStep?: number | null;
  onSelect: () => void;
};

const visualThemeClassName = {
  pink: "bg-[radial-gradient(circle_at_top_left,_rgba(249,37,149,0.22),_transparent_38%),linear-gradient(180deg,_rgba(126,52,95,0.5),_rgba(40,43,53,0.8))]",
  violet:
    "bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.22),_transparent_38%),linear-gradient(180deg,_rgba(80,58,108,0.5),_rgba(40,43,53,0.8))]",
  blue: "bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_38%),linear-gradient(180deg,_rgba(54,78,109,0.5),_rgba(40,43,53,0.8))]",
  emerald:
    "bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.22),_transparent_38%),linear-gradient(180deg,_rgba(56,98,90,0.5),_rgba(40,43,53,0.8))]",
  amber:
    "bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.2),_transparent_38%),linear-gradient(180deg,_rgba(107,84,52,0.48),_rgba(40,43,53,0.8))]",
};

export function OptionBranchCard({
  label,
  description,
  badge,
  visualTitle,
  visualSubtitle,
  visualTheme = "pink",
  selected,
  muted,
  showRouteOut = false,
  routeLabel,
  transitionPreviewTitle,
  transitionPreviewStep,
  onSelect,
}: OptionBranchCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "group relative w-full overflow-visible rounded-[24px] border p-4 text-left transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-pink-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#11141b]",
        selected
          ? "border-pink-300/60 bg-[linear-gradient(180deg,_rgba(249,37,149,0.18),_rgba(255,255,255,0.06))] shadow-[0_12px_34px_rgba(249,37,149,0.18)]"
          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]",
        muted && !selected && "opacity-45"
      )}
    >
      <div className="absolute left-4 top-0 h-8 w-px bg-white/10" />
      <div
        className={cn(
          "absolute left-[13px] top-7 h-3 w-3 rounded-full border transition-colors",
          selected
            ? "border-pink-100 bg-pink-300 shadow-[0_0_0_6px_rgba(249,37,149,0.15)]"
            : "border-white/20 bg-[#1c2028]"
        )}
      />

      {showRouteOut && (
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <div className="relative flex items-center">
            <div className="h-px w-16 bg-white/10" />
            <div className="absolute left-0 top-1/2 h-[2px] w-16 -translate-y-1/2 origin-left bg-[linear-gradient(90deg,_rgba(249,37,149,0.95),_rgba(153,246,228,0.85))] animate-[routeSweep_720ms_ease-out_forwards]" />
            <div className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-cyan-100/40 bg-cyan-200 shadow-[0_0_0_5px_rgba(125,211,252,0.12)] animate-[fadeSlideIn_280ms_ease-out]" />
            {routeLabel && (
              <div className="absolute left-[4.5rem] top-1/2 ml-3 -translate-y-1/2 rounded-full border border-cyan-200/20 bg-[#18202a] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-50 animate-[slideFromRight_420ms_ease-out]">
                {routeLabel}
              </div>
            )}
            {transitionPreviewTitle && (
              <div className="absolute left-[5.6rem] top-1/2 ml-4 w-[148px] -translate-y-1/2 animate-[slideFromRight_520ms_ease-out]">
                <div className="overflow-hidden rounded-[18px] border border-cyan-200/20 bg-[linear-gradient(180deg,_rgba(23,30,41,0.96),_rgba(14,18,26,0.98))] p-3 shadow-[0_16px_34px_rgba(0,0,0,0.28)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.12),_transparent_32%)]" />
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-200/25 bg-cyan-300/10 text-[11px] font-semibold text-cyan-50">
                        {transitionPreviewStep ?? "R"}
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-100/70">
                        {transitionPreviewStep ? "Next Question" : "Result"}
                      </p>
                    </div>
                    <p className="mt-2 break-keep text-sm font-semibold leading-5 text-white">
                      {transitionPreviewTitle}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pl-6">
        {(visualTitle || visualSubtitle) && (
          <div
            className={cn(
              "mb-4 overflow-hidden rounded-[20px] border border-white/10 p-4",
              visualThemeClassName[visualTheme]
            )}
          >
            <div className="rounded-[16px] border border-white/10 bg-black/10 p-4">
              <div className="h-16 rounded-[14px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.18),_rgba(255,255,255,0.03))]" />
              {visualTitle && (
                <p className="mt-4 break-keep text-sm font-semibold text-white">
                  {visualTitle}
                </p>
              )}
              {visualSubtitle && (
                <p className="mt-1 break-keep text-xs leading-5 text-gray-200">
                  {visualSubtitle}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div>
            {badge && (
              <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-gray-300">
                {badge}
              </span>
            )}
            <h3 className="mt-3 break-keep text-base font-semibold leading-6 text-white">
              {label}
            </h3>
          </div>

          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all",
              selected
                ? "border-pink-200/70 bg-pink-300/20 text-pink-100"
                : "border-white/10 bg-white/[0.03] text-transparent"
            )}
          >
            <Check className="h-4 w-4" />
          </span>
        </div>

        {description && (
          <p className="mt-3 break-keep text-sm leading-6 text-gray-300">
            {description}
          </p>
        )}
      </div>
    </button>
  );
}
