import type { FormData } from "@/types/form";
import type { CreateSurveyRequest, Survey } from "@/api/survey";

/** 프론트 concept id → 백엔드 enum 매핑 (백엔드가 GIRL_CRUSH 등 SNAKE_CASE enum 기대) */
const CONCEPT_TO_BACKEND_ENUM: Record<string, string> = {
  girlcrush: "GIRL_CRUSH",
  lovely: "LOVELY_FRESH",
  elegant: "ELEGANT_GLAM",
  dreamy: "DREAMY",
  highteen: "HIGHTEEN",
  etc: "ETC",
};

/**
 * FormData → CreateSurveyRequest 변환
 */
export function formDataToSurveyRequest(
  formData: Partial<FormData>
): CreateSurveyRequest {
  const rawConcept = formData.selectedConcepts?.[0] || "";
  const concept =
    CONCEPT_TO_BACKEND_ENUM[rawConcept.toLowerCase()] ??
    rawConcept.toUpperCase().replace(/\s+/g, "_").replace(/-/g, "_");
  const visitStartDate = formData.dateRange?.from
    ? formData.dateRange.from.toISOString().slice(0, 10)
    : "";
  const visitEndDate = formData.dateRange?.to
    ? formData.dateRange.to.toISOString().slice(0, 10)
    : "";
  const places = formData.selectedRegions ?? [];

  return {
    concept,
    idolName: formData.favoriteIdol || "",
    visitStartDate,
    visitEndDate,
    places,
  };
}

/** 설문 배지 표시용 데이터 */
export interface SurveyDisplayData {
  concepts: string[];
  idolName: string;
  regions: string[];
}

/**
 * Survey → 배지 표시용 데이터 변환
 */
export function surveyToDisplayData(survey: Survey): SurveyDisplayData {
  const concepts = survey.concept ? [survey.concept] : [];

  let regions: string[] = [];
  try {
    regions =
      typeof survey.places === "string"
        ? (JSON.parse(survey.places) as string[])
        : [];
  } catch {
    regions = [];
  }

  return {
    concepts,
    idolName: survey.idolName,
    regions,
  };
}
