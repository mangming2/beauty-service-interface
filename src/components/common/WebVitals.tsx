/* eslint-disable no-console */
"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import type { Metric } from "web-vitals";

function sendToGA4(metric: Metric) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", metric.name, {
    value: Math.round(
      metric.name === "CLS" ? metric.value * 1000 : metric.value
    ),
    metric_id: metric.id,
    metric_delta: Math.round(metric.delta),
    metric_rating: metric.rating,
    non_interaction: true,
  });
}

const RATING_STYLE = {
  good: "background:#0cce6b; color:#000; font-weight:700; padding:1px 6px; border-radius:3px;",
  "needs-improvement":
    "background:#ffa400; color:#000; font-weight:700; padding:1px 6px; border-radius:3px;",
  poor: "background:#ff4e42; color:#fff; font-weight:700; padding:1px 6px; border-radius:3px;",
};

const METRIC_DESCRIPTIONS: Record<string, string> = {
  LCP: "Largest Contentful Paint",
  FCP: "First Contentful Paint",
  CLS: "Cumulative Layout Shift",
  INP: "Interaction to Next Paint",
  TTFB: "Time to First Byte",
};

function formatValue(metric: Metric) {
  return metric.name === "CLS"
    ? metric.value.toFixed(3)
    : `${Math.round(metric.value)}ms`;
}

function logToConsole(metric: Metric) {
  const ratingStyle = RATING_STYLE[metric.rating];
  const desc = METRIC_DESCRIPTIONS[metric.name] ?? metric.name;
  const value = formatValue(metric);

  console.groupCollapsed(
    `%c ${metric.name} %c ${value} %c ${metric.rating} `,
    "background:#1e1e2e; color:#cdd6f4; font-weight:700; padding:2px 8px; border-radius:4px 0 0 4px; font-family:monospace;",
    "background:#313244; color:#a6adc8; padding:2px 10px; font-family:monospace;",
    ratingStyle
  );
  console.log("%c" + desc, "color:#888; font-size:11px;");
  console.log(
    "%cvalue%c",
    "color:#89b4fa; font-weight:600;",
    "",
    value,
    "\n%cdelta%c",
    "color:#89b4fa; font-weight:600;",
    "",
    `${Math.round(metric.delta)}ms`,
    "\n%cid%c",
    "color:#89b4fa; font-weight:600;",
    "",
    metric.id
  );
  console.groupEnd();
}

export function WebVitals() {
  useEffect(() => {
    const report = (metric: Metric) => {
      sendToGA4(metric);
      if (process.env.NODE_ENV === "development") {
        logToConsole(metric);
      }
    };

    onCLS(report);
    onFCP(report);
    onINP(report);
    onLCP(report);
    onTTFB(report);
  }, []);

  return null;
}
