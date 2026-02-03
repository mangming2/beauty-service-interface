import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReservation,
  type CreateReservationRequest,
} from "@/api/reservation";
import { myPageKeys } from "./useMyPageQueries";

// ========== Mutations ==========

interface CreateReservationParams {
  productId: number;
  request: CreateReservationRequest;
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
