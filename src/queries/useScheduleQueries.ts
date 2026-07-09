import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getSchedules,
  createSchedule,
  deleteSchedule,
  type ScheduleListResponse,
  type CreateScheduleRequest,
} from "@/api/schedule";

// ========== Query Keys ==========

export const scheduleKeys = {
  all: ["schedules"] as const,
  list: () => [...scheduleKeys.all, "list"] as const,
  detail: (id: number) => [...scheduleKeys.all, "detail", id] as const,
} as const;

// ========== Queries ==========

/**
 * 일정 목록 조회 (무한 스크롤)
 */
export function useSchedules(size: number = 20) {
  return useInfiniteQuery<ScheduleListResponse>({
    queryKey: scheduleKeys.list(),
    queryFn: ({ pageParam }) =>
      getSchedules({
        cursorId: pageParam as number | undefined,
        size,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.nextCursorId : undefined,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ========== Mutations ==========

/**
 * 일정 생성
 */
export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateScheduleRequest) => createSchedule(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
    },
  });
}

/**
 * 일정 삭제
 */
export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: number) => deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
    },
  });
}
