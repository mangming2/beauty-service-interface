"use client";

import { FormSurveyLoader } from "@/components/form/FormSurveyLoader";

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormSurveyLoader>{children}</FormSurveyLoader>;
}
