import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReservation,
  updateReservation,
  getReservationDetail,
  type CreateReservationRequest,
  type UpdateReservationRequest,
  type ReservationSpecificResponse,
} from "@/api/reservation";
import { myPageKeys } from "./useMyPageQueries";
import type { ApiError } from "@/lib/apiClient";

// ========== Query Keys ==========

export const reservationKeys = {
  all: ["reservations"] as const,
  detail: (productId: number, reservationId: number) =>
    [...reservationKeys.all, "detail", productId, reservationId] as const,
} as const;

function retryUnless401(failureCount: number, error: unknown): boolean {
  const err = error as ApiError | undefined;
  if (err?.status === 401) return false;
  return failureCount < 2;
}

// ========== Queries ==========

/**
 * 예약 단건 조회
 * GET /products/:productId/reservations/:reservationId
 */
export function useReservationDetail(
  productId: number | undefined,
  reservationId: number | undefined
) {
  const isValid =
    productId !== undefined &&
    reservationId !== undefined &&
    Number.isFinite(productId) &&
    Number.isFinite(reservationId);

  return useQuery<ReservationSpecificResponse>({
    queryKey: reservationKeys.detail(productId!, reservationId!),
    queryFn: () => getReservationDetail(productId!, reservationId!),
    enabled: isValid,
    staleTime: 2 * 60 * 1000,
    retry: retryUnless401,
  });
}

// ========== Mutations ==========

interface CreateReservationParams {
  productId: number;
  request: CreateReservationRequest;
}

interface UpdateReservationParams {
  productId: number;
  reservationId: number;
  request: UpdateReservationRequest;
}

/**
 * 상품 예약 신청
 */
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, request }: CreateReservationParams) =>
      createReservation(productId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myPageKeys.bookings() });
      queryClient.invalidateQueries({
        queryKey: myPageKeys.upcomingBookings(),
      });
    },
  });
}

/**
 * 예약 수정
 * PUT /products/:productId/reservations/:reservationId
 */
export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      reservationId,
      request,
    }: UpdateReservationParams) =>
      updateReservation(productId, reservationId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: myPageKeys.bookings() });
      queryClient.invalidateQueries({
        queryKey: myPageKeys.upcomingBookings(),
      });
      queryClient.invalidateQueries({
        queryKey: reservationKeys.detail(
          variables.productId,
          variables.reservationId
        ),
      });
    },
  });
}
