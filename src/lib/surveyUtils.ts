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

/** 백엔드 concept enum → 프론트 concept id 매핑 */
const BACKEND_ENUM_TO_CONCEPT_ID: Record<string, string> = {
  GIRL_CRUSH: "girlcrush",
  LOVELY_FRESH: "lovely",
  ELEGANT_GLAM: "elegant",
  DREAMY: "dreamy",
  HIGHTEEN: "highteen",
  ETC: "etc",
};

/**
 * Survey → FormData 변환 (폼 초기값용)
 * - 백엔드에 저장된 설문 데이터를 폼 store에 로드할 때 사용
 */
export function surveyToFormData(survey: Survey): Partial<FormData> {
  const conceptId =
    BACKEND_ENUM_TO_CONCEPT_ID[survey.concept] ??
    survey.concept.toLowerCase().replace(/_/g, "");
  const selectedConcepts = conceptId ? [conceptId] : [];

  let selectedRegions: string[] = [];
  try {
    const places = (survey as { places?: string | string[] }).places;
    if (Array.isArray(places)) {
      selectedRegions = places;
    } else if (typeof places === "string") {
      selectedRegions = JSON.parse(places) as string[];
    }
  } catch {
    selectedRegions = [];
  }

  const dateRange =
    survey.visitStartDate && survey.visitEndDate
      ? {
          from: new Date(survey.visitStartDate),
          to: new Date(survey.visitEndDate),
        }
      : undefined;

  return {
    selectedConcepts,
    favoriteIdol: survey.idolName || "",
    idolOption: "", // 백엔드에 없음
    dateRange,
    selectedRegions,
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
    const places = (survey as { places?: string | string[] }).places;
    if (Array.isArray(places)) {
      regions = places;
    } else if (typeof places === "string") {
      regions = JSON.parse(places) as string[];
    }
  } catch {
    regions = [];
  }

  return {
    concepts,
    idolName: survey.idolName,
    regions,
  };
}
