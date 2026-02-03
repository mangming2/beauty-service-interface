import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOptions,
  getOptionDetail,
  createOption,
  type Option,
  type CreateOptionRequest,
} from "@/api/option";
import { productKeys } from "./useProductQueries";

// ========== Query Keys ==========

export const optionKeys = {
  all: ["options"] as const,
  lists: () => [...optionKeys.all, "list"] as const,
  details: () => [...optionKeys.all, "detail"] as const,
  detail: (id: number) => [...optionKeys.details(), id] as const,
} as const;

// ========== Queries ==========

/**
 * 옵션 목록 조회
 */
export function useOptions() {
  return useQuery<Option[]>({
    queryKey: optionKeys.lists(),
    queryFn: getOptions,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 옵션 상세 조회
 */
export function useOptionDetail(optionId: number | undefined) {
  return useQuery<Option | null>({
    queryKey: optionKeys.detail(optionId!),
    queryFn: () => getOptionDetail(optionId!),
    enabled: optionId !== undefined,
    staleTime: 5 * 60 * 1000,
    retry: 2,
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
      queryClient.invalidateQueries({ queryKey: optionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
