import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminTourSurveyForm,
  createTourSurveySubmission,
  deleteAdminTourSurveyForm,
  generateTourSurveyRecommendation,
  getAdminTourSurveyForms,
  getTourSurveyForm,
  getTourSurveyForms,
  getTourSurveyRecommendation,
  getTourSurveySharePayload,
  updateAdminTourSurveyForm,
  type CreateTourSurveySubmissionRequest,
  type GenerateTourSurveyRecommendationParams,
  type TourSurveyForm,
  type TourSurveyRecommendation,
  type TourSurveySharePayload,
  type UpsertTourSurveyFormRequest,
} from "@/api/tourSurvey";
import type { ApiError } from "@/lib/apiClient";

export const tourSurveyKeys = {
  all: ["tour-surveys"] as const,
  forms: () => [...tourSurveyKeys.all, "forms"] as const,
  form: (formId: number) => [...tourSurveyKeys.forms(), formId] as const,
  adminForms: () => [...tourSurveyKeys.all, "admin-forms"] as const,
  adminForm: (formId: number) =>
    [...tourSurveyKeys.adminForms(), formId] as const,
  submissions: () => [...tourSurveyKeys.all, "submissions"] as const,
  submission: (submissionId: number) =>
    [...tourSurveyKeys.submissions(), submissionId] as const,
  recommendation: (submissionId: number) =>
    [...tourSurveyKeys.submission(submissionId), "result"] as const,
  sharePayload: (submissionId: number) =>
    [...tourSurveyKeys.submission(submissionId), "share-payload"] as const,
} as const;

function retryUnlessAuthOrTourApi(
  failureCount: number,
  error: unknown
): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401 || err?.status === 502 || err?.status === 503) {
    return false;
  }
  return failureCount < 2;
}

function isValidId(id: number | undefined): id is number {
  return typeof id === "number" && Number.isFinite(id) && id > 0;
}

export function useTourSurveyForms() {
  return useQuery<TourSurveyForm[]>({
    queryKey: tourSurveyKeys.forms(),
    queryFn: getTourSurveyForms,
    staleTime: 5 * 60 * 1000,
    retry: retryUnlessAuthOrTourApi,
  });
}

export function useTourSurveyForm(formId: number | undefined) {
  return useQuery<TourSurveyForm>({
    queryKey: tourSurveyKeys.form(formId ?? -1),
    queryFn: () => getTourSurveyForm(formId!),
    enabled: isValidId(formId),
    staleTime: 5 * 60 * 1000,
    retry: retryUnlessAuthOrTourApi,
  });
}

export function useTourSurveyRecommendation(
  submissionId: number | undefined,
  enabled = true
) {
  return useQuery<TourSurveyRecommendation>({
    queryKey: tourSurveyKeys.recommendation(submissionId ?? -1),
    queryFn: () => getTourSurveyRecommendation(submissionId!),
    enabled: enabled && isValidId(submissionId),
    staleTime: 5 * 60 * 1000,
    retry: retryUnlessAuthOrTourApi,
  });
}

export function useTourSurveySharePayload(
  submissionId: number | undefined,
  enabled = true
) {
  return useQuery<TourSurveySharePayload>({
    queryKey: tourSurveyKeys.sharePayload(submissionId ?? -1),
    queryFn: () => getTourSurveySharePayload(submissionId!),
    enabled: enabled && isValidId(submissionId),
    staleTime: 5 * 60 * 1000,
    retry: retryUnlessAuthOrTourApi,
  });
}

export function useCreateTourSurveySubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTourSurveySubmissionRequest) =>
      createTourSurveySubmission(request),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: tourSurveyKeys.submissions() });
      queryClient.setQueryData(
        tourSurveyKeys.submission(data.submissionId),
        data
      );
    },
  });
}

export function useGenerateTourSurveyRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      params,
    }: {
      submissionId: number;
      params?: GenerateTourSurveyRecommendationParams;
    }) => generateTourSurveyRecommendation(submissionId, params),
    onSuccess: data => {
      queryClient.setQueryData(
        tourSurveyKeys.recommendation(data.submissionId),
        data
      );
      queryClient.invalidateQueries({
        queryKey: tourSurveyKeys.submission(data.submissionId),
      });
      queryClient.invalidateQueries({
        queryKey: tourSurveyKeys.sharePayload(data.submissionId),
      });
    },
  });
}

// ========== Admin Hooks ==========

export function useAdminTourSurveyForms() {
  return useQuery<TourSurveyForm[]>({
    queryKey: tourSurveyKeys.adminForms(),
    queryFn: getAdminTourSurveyForms,
    staleTime: 60 * 1000,
    retry: retryUnlessAuthOrTourApi,
  });
}

export function useCreateAdminTourSurveyForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpsertTourSurveyFormRequest) =>
      createAdminTourSurveyForm(request),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: tourSurveyKeys.adminForms() });
      queryClient.invalidateQueries({ queryKey: tourSurveyKeys.forms() });
      queryClient.setQueryData(tourSurveyKeys.adminForm(data.id), data);
      queryClient.setQueryData(tourSurveyKeys.form(data.id), data);
    },
  });
}

export function useUpdateAdminTourSurveyForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      formId,
      request,
    }: {
      formId: number;
      request: UpsertTourSurveyFormRequest;
    }) => updateAdminTourSurveyForm(formId, request),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: tourSurveyKeys.adminForms() });
      queryClient.invalidateQueries({ queryKey: tourSurveyKeys.forms() });
      queryClient.setQueryData(tourSurveyKeys.adminForm(data.id), data);
      queryClient.setQueryData(tourSurveyKeys.form(data.id), data);
    },
  });
}

export function useDeleteAdminTourSurveyForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formId: number) => deleteAdminTourSurveyForm(formId),
    onSuccess: (_, formId) => {
      queryClient.invalidateQueries({ queryKey: tourSurveyKeys.adminForms() });
      queryClient.invalidateQueries({ queryKey: tourSurveyKeys.forms() });
      queryClient.removeQueries({ queryKey: tourSurveyKeys.adminForm(formId) });
      queryClient.removeQueries({ queryKey: tourSurveyKeys.form(formId) });
    },
  });
}
