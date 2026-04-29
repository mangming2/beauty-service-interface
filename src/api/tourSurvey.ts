import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

export type TourSurveyQuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
export type TourSurveySubmissionStatus = "SAVED" | "RECOMMENDED";

export interface TourSurveyOption {
  id: number;
  optionKey: string;
  label: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  tourAreaCode?: number;
  tourSignguCode?: number;
  placeLabel?: string;
  categoryTag?: string;
  styleTag?: string;
}

export interface TourSurveyQuestion {
  id: number;
  questionKey: string;
  title: string;
  description?: string;
  sortOrder: number;
  type: TourSurveyQuestionType;
  required: boolean;
  options: TourSurveyOption[];
}

export interface TourSurveyForm {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  questions: TourSurveyQuestion[];
}

export interface TourSurveySubmissionAnswerRequest {
  questionId: number;
  selectedOptionId: number;
}

export interface CreateTourSurveySubmissionRequest {
  formId: number;
  answers: TourSurveySubmissionAnswerRequest[];
}

export interface UpdateTourSurveySubmissionRequest {
  answers: TourSurveySubmissionAnswerRequest[];
}

export interface TourSurveySubmissionAnswer {
  questionId: number;
  questionKey: string;
  questionTitle: string;
  selectedOptionId: number;
  selectedOptionKey: string;
  selectedOptionLabel: string;
  selectedOptionDescription?: string;
  selectedOptionImageUrl?: string;
  tourAreaCode?: number;
  tourSignguCode?: number;
  placeLabel?: string;
  categoryTag?: string;
  styleTag?: string;
}

export interface TourSurveySubmission {
  submissionId: number;
  formId: number;
  formCode: string;
  userId: number;
  status: TourSurveySubmissionStatus;
  answers: TourSurveySubmissionAnswer[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TourSurveyResultCard {
  title: string;
  description: string;
  imageUrl?: string | null;
}

export interface TourSurveyRecommendedAttraction {
  attractionCode: string;
  name: string;
  areaName?: string | null;
  signguName?: string | null;
  categoryLarge?: string | null;
  categoryMiddle?: string | null;
  rank: number;
  reason: string;
}

export interface TourSurveyRecommendedProduct {
  productId: number;
  name: string;
  location: string;
  finalPrice: number;
  discountRate: number;
  rating: number;
  reviewCount: number;
  bookingCount: number;
  tags: string[];
  imageUrl?: string | null;
  reason: string;
  deepLinkPath: string;
}

export interface TourSurveyRecommendation {
  submissionId: number;
  resultId: number;
  llmEnhanced: boolean;
  title: string;
  subtitle: string;
  narrative: string;
  stylingTip: string;
  selectedAnswerCards: TourSurveyResultCard[];
  attractions: TourSurveyRecommendedAttraction[];
  route: string[];
  shareCaption: string;
  hashtags: string[];
  recommendedProducts: TourSurveyRecommendedProduct[];
}

export interface GenerateTourSurveyRecommendationParams {
  useLlm?: boolean;
  attractionSize?: number;
  productSize?: number;
  baseYm?: string;
}

export interface TourSurveyCapturePayload {
  title: string;
  subtitle: string;
  narrative: string;
  cards: TourSurveyResultCard[];
  footer: string;
}

export interface TourSurveyShareMeta {
  captureSchemaVersion: string;
  generatedAt: string;
  destinationLabel?: string;
  attractionCodes: string[];
  productIds: number[];
}

export interface TourSurveySharePayload {
  submissionId: number;
  resultId: number;
  capture: TourSurveyCapturePayload;
  shareText: string;
  hashtags: string[];
  meta: TourSurveyShareMeta;
  deepLinkPath: string;
}

function appendRecommendationParams(
  params: GenerateTourSurveyRecommendationParams = {}
) {
  const queryParams = new URLSearchParams();

  if (params.useLlm !== undefined) {
    queryParams.append("useLlm", String(params.useLlm));
  }
  if (params.attractionSize !== undefined) {
    queryParams.append("attractionSize", String(params.attractionSize));
  }
  if (params.productSize !== undefined) {
    queryParams.append("productSize", String(params.productSize));
  }
  if (params.baseYm) {
    queryParams.append("baseYm", params.baseYm);
  }

  const qs = queryParams.toString();
  return qs ? `?${qs}` : "";
}

export async function getTourSurveyForms(): Promise<TourSurveyForm[]> {
  const data = await apiGet<TourSurveyForm[]>("/tour-surveys", {
    requireAuth: true,
  });
  return data ?? [];
}

export async function getTourSurveyForm(
  formId: number
): Promise<TourSurveyForm> {
  return apiGet<TourSurveyForm>(`/tour-surveys/${formId}`, {
    requireAuth: true,
  });
}

export async function getTourSurveySubmissions(): Promise<
  TourSurveySubmission[]
> {
  const data = await apiGet<TourSurveySubmission[]>(
    "/tour-surveys/submissions",
    {
      requireAuth: true,
    }
  );
  return data ?? [];
}

export async function getTourSurveySubmission(
  submissionId: number
): Promise<TourSurveySubmission> {
  return apiGet<TourSurveySubmission>(
    `/tour-surveys/submissions/${submissionId}`,
    { requireAuth: true }
  );
}

export async function createTourSurveySubmission(
  request: CreateTourSurveySubmissionRequest
): Promise<TourSurveySubmission> {
  return apiPost<TourSurveySubmission>("/tour-surveys/submissions", request, {
    requireAuth: true,
  });
}

export async function updateTourSurveySubmission(
  submissionId: number,
  request: UpdateTourSurveySubmissionRequest
): Promise<TourSurveySubmission> {
  return apiPut<TourSurveySubmission>(
    `/tour-surveys/submissions/${submissionId}`,
    request,
    { requireAuth: true }
  );
}

export async function deleteTourSurveySubmission(
  submissionId: number
): Promise<void> {
  return apiDelete<void>(`/tour-surveys/submissions/${submissionId}`, {
    requireAuth: true,
  });
}

export async function getTourSurveyRecommendation(
  submissionId: number
): Promise<TourSurveyRecommendation> {
  return apiGet<TourSurveyRecommendation>(
    `/tour-surveys/submissions/${submissionId}/result`,
    { requireAuth: true }
  );
}

export async function generateTourSurveyRecommendation(
  submissionId: number,
  params: GenerateTourSurveyRecommendationParams = {}
): Promise<TourSurveyRecommendation> {
  return apiPost<TourSurveyRecommendation>(
    `/tour-surveys/submissions/${submissionId}/result${appendRecommendationParams(params)}`,
    undefined,
    { requireAuth: true }
  );
}

export async function getTourSurveySharePayload(
  submissionId: number
): Promise<TourSurveySharePayload> {
  return apiGet<TourSurveySharePayload>(
    `/tour-surveys/submissions/${submissionId}/share-payload`,
    { requireAuth: true }
  );
}

// ========== Admin API ==========

export interface UpsertTourSurveyOptionRequest {
  optionKey: string;
  label: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  tourAreaCode?: number;
  tourSignguCode?: number;
  placeLabel?: string;
  categoryTag?: string;
  styleTag?: string;
}

export interface UpsertTourSurveyQuestionRequest {
  questionKey: string;
  title: string;
  description?: string;
  sortOrder: number;
  type: TourSurveyQuestionType;
  required: boolean;
  options: UpsertTourSurveyOptionRequest[];
}

export interface UpsertTourSurveyFormRequest {
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  questions: UpsertTourSurveyQuestionRequest[];
}

export async function getAdminTourSurveyForms(): Promise<TourSurveyForm[]> {
  const data = await apiGet<TourSurveyForm[]>("/admin/tour-surveys", {
    requireAuth: true,
  });
  return data ?? [];
}

export async function getAdminTourSurveyForm(
  formId: number
): Promise<TourSurveyForm> {
  return apiGet<TourSurveyForm>(`/admin/tour-surveys/${formId}`, {
    requireAuth: true,
  });
}

export async function createAdminTourSurveyForm(
  request: UpsertTourSurveyFormRequest
): Promise<TourSurveyForm> {
  return apiPost<TourSurveyForm>("/admin/tour-surveys", request, {
    requireAuth: true,
  });
}

export async function updateAdminTourSurveyForm(
  formId: number,
  request: UpsertTourSurveyFormRequest
): Promise<TourSurveyForm> {
  return apiPut<TourSurveyForm>(`/admin/tour-surveys/${formId}`, request, {
    requireAuth: true,
  });
}

export async function deleteAdminTourSurveyForm(formId: number): Promise<void> {
  return apiDelete<void>(`/admin/tour-surveys/${formId}`, {
    requireAuth: true,
  });
}
