"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useReservationDetail,
  useUpdateReservation,
} from "@/queries/useReservationQueries";

export function AdminReservationsPanel() {
  const [productIdStr, setProductIdStr] = useState("");
  const [reservationIdStr, setReservationIdStr] = useState("");
  const [searchProductId, setSearchProductId] = useState<number | undefined>();
  const [searchReservationId, setSearchReservationId] = useState<
    number | undefined
  >();

  const [editOpen, setEditOpen] = useState(false);
  const [editSlotId, setEditSlotId] = useState("");
  const [editTotalPrice, setEditTotalPrice] = useState("");

  const {
    data: reservation,
    isLoading,
    isError,
  } = useReservationDetail(searchProductId, searchReservationId);

  const updateMutation = useUpdateReservation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const pId = parseInt(productIdStr.trim(), 10);
    const rId = parseInt(reservationIdStr.trim(), 10);
    if (
      !Number.isFinite(pId) ||
      pId <= 0 ||
      !Number.isFinite(rId) ||
      rId <= 0
    ) {
      alert("올바른 상품 ID와 예약 ID를 입력하세요.");
      return;
    }
    setSearchProductId(pId);
    setSearchReservationId(rId);
  };

  const openEditDialog = () => {
    setEditSlotId("");
    setEditTotalPrice(reservation?.option.price?.toString() ?? "");
    setEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchProductId || !searchReservationId) return;
    const slotId = parseInt(editSlotId.trim(), 10);
    const price = parseFloat(editTotalPrice.trim());
    if (!Number.isFinite(slotId) || slotId <= 0) {
      alert("올바른 슬롯 ID를 입력하세요.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      alert("올바른 금액을 입력하세요.");
      return;
    }
    updateMutation.mutate(
      {
        productId: searchProductId,
        reservationId: searchReservationId,
        request: { reservationSlotId: slotId, totalPrice: price },
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          alert("예약이 수정되었습니다.");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-400">
        예약 단건 조회 · 수정 (GET/PUT
        /products/:productId/reservations/:reservationId)
      </p>

      {/* 검색 폼 */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">상품 ID</label>
            <input
              type="number"
              min={1}
              value={productIdStr}
              onChange={e => setProductIdStr(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 text-sm"
              placeholder="예: 1"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">예약 ID</label>
            <input
              type="number"
              min={1}
              value={reservationIdStr}
              onChange={e => setReservationIdStr(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 text-sm"
              placeholder="예: 1"
            />
          </div>
        </div>
        <Button type="submit" variant="secondary" className="w-full">
          조회
        </Button>
      </form>

      {/* 조회 결과 */}
      {isLoading && searchProductId && (
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      )}
      {isError && (
        <p className="text-red-400 text-sm">예약을 찾을 수 없습니다.</p>
      )}
      {reservation && (
        <div className="rounded-lg border border-gray-600 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">
              예약 #{searchReservationId}
            </h3>
            <Button type="button" size="sm" onClick={openEditDialog}>
              수정
            </Button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">상품</span>
              <span className="text-white">
                {reservation.product.name} (#{reservation.product.id})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">옵션</span>
              <span className="text-white">{reservation.option.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">방문일</span>
              <span className="text-white">{reservation.visitDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">방문 시작 시간</span>
              <span className="text-white">{reservation.visitStartAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">가격</span>
              <span className="text-white">
                ₩{Number(reservation.option.price).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">주소</span>
              <span className="text-white text-right max-w-[200px]">
                {reservation.option.address}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 수정 다이얼로그 */}
      <Dialog
        open={editOpen}
        onOpenChange={open => {
          if (!open) setEditOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-md text-white border-gray-600 bg-[#1a1c20]">
          <DialogHeader>
            <DialogTitle>예약 수정 #{searchReservationId}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                변경할 슬롯 ID
              </label>
              <input
                type="number"
                min={1}
                value={editSlotId}
                onChange={e => setEditSlotId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 text-sm"
                placeholder="예: 6"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                결제 총액
              </label>
              <input
                type="number"
                min={1}
                step="0.01"
                value={editTotalPrice}
                onChange={e => setEditTotalPrice(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 text-sm"
                placeholder="예: 300000"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditOpen(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
            {updateMutation.isError && (
              <p className="text-red-400 text-xs">
                {updateMutation.error.message}
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
