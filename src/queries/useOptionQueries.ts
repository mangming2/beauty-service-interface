import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOptions,
  getOptionDetail,
  createOption,
  updateOption,
  deleteOption,
  type Option,
  type OptionCatalogItem,
  type CreateOptionRequest,
} from "@/api/option";
import { productKeys } from "./useProductQueries";
import type { ApiError } from "@/lib/apiClient";

// ========== Query Keys ==========

export const optionKeys = {
  all: ["options"] as const,
  lists: () => [...optionKeys.all, "list"] as const,
  list: (tag?: string) => [...optionKeys.lists(), { tag }] as const,
  details: () => [...optionKeys.all, "detail"] as const,
  detail: (id: number) => [...optionKeys.details(), id] as const,
} as const;

function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

// ========== Queries ==========

/**
 * 전체 옵션 목록 조회 (태그 필터 optional)
 * GET /options?tag=...
 */
export function useOptions(tag?: string) {
  return useQuery<OptionCatalogItem[]>({
    queryKey: optionKeys.list(tag),
    queryFn: () => getOptions(tag),
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

/**
 * 옵션 상세 조회
 */
export function useOptionDetail(optionId: number | undefined) {
  const enabled =
    typeof optionId === "number" && Number.isFinite(optionId) && optionId > 0;

  return useQuery<Option | null>({
    queryKey: optionKeys.detail(optionId!),
    queryFn: () => getOptionDetail(optionId!),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });
}

// ========== Mutations ==========

interface CreateOptionParams {
  request: CreateOptionRequest;
  images?: File[];
}

/**
 * 옵션 생성
 */
export function useCreateOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ request, images }: CreateOptionParams) =>
      createOption(request, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

interface UpdateOptionParams {
  optionId: number;
  request: CreateOptionRequest;
  images?: File[];
}

export function useUpdateOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ optionId, request, images }: UpdateOptionParams) =>
      updateOption(optionId, request, images),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: optionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: optionKeys.detail(variables.optionId),
      });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (optionId: number) => deleteOption(optionId),
    onSuccess: (_, optionId) => {
      queryClient.invalidateQueries({ queryKey: optionKeys.lists() });
      queryClient.removeQueries({ queryKey: optionKeys.detail(optionId) });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
