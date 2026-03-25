"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateOptionRequest } from "@/api/option";
import {
  useOptionDetail,
  useUpdateOption,
  useDeleteOption,
} from "@/queries/useOptionQueries";
import { OptionFormFields, optionToCreateRequest } from "./option-form-fields";

const defaultOptionReq = (): CreateOptionRequest => ({
  name: "",
  description: "",
  categoryTagName: "hair",
  price: 100000,
  address: "",
  slotStartDate: "2025-01-01",
  slotEndDate: "2025-12-31",
  slotStartHour: 9,
  slotEndHour: 16,
  discountRate: 0,
  bookingGuide: "",
  regularClosingDay: null,
  optionTagNames: [],
});

export function AdminOptionsPanel() {
  const [optionIdInput, setOptionIdInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const { data: detail, isLoading: detailLoading } = useOptionDetail(
    editId ?? undefined
  );

  const [optionReq, setOptionReq] =
    useState<CreateOptionRequest>(defaultOptionReq);
  const [optionTagsStr, setOptionTagsStr] = useState("");
  const [optionImages, setOptionImages] = useState<File[]>([]);

  const updateMutation = useUpdateOption();
  const deleteMutation = useDeleteOption();

  const dialogOpen = editId !== null;

  useEffect(() => {
    if (!dialogOpen || !detail) return;
    setOptionReq(optionToCreateRequest(detail));
    setOptionTagsStr("");
    setOptionImages([]);
  }, [dialogOpen, detail]);

  const handleClose = () => {
    setEditId(null);
    setOptionReq(defaultOptionReq());
    setOptionTagsStr("");
    setOptionImages([]);
  };

  const parsedTargetId = parseInt(optionIdInput.trim(), 10);
  const validTargetId =
    Number.isFinite(parsedTargetId) && parsedTargetId > 0
      ? parsedTargetId
      : null;

  const openEditForInputId = () => {
    if (validTargetId === null) {
      alert("올바른 옵션 ID(양의 정수)를 입력하세요.");
      return;
    }
    setEditId(validTargetId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null) return;
    const tags = optionTagsStr
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    updateMutation.mutate(
      {
        optionId: editId,
        request: { ...optionReq, optionTagNames: tags },
        images: optionImages.length ? optionImages : undefined,
      },
      { onSuccess: handleClose }
    );
  };

  const handleDeleteFromInput = () => {
    if (validTargetId === null) {
      alert("올바른 옵션 ID를 입력하세요.");
      return;
    }
    if (
      !confirm(
        `옵션 #${validTargetId} 을(를) 삭제할까요? 연결된 상품이 있으면 실패할 수 있습니다.`
      )
    )
      return;
    deleteMutation.mutate(validTargetId);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400 leading-relaxed">
        전체 옵션 목록 API(GET /options)는 없습니다. 수정·삭제할{" "}
        <strong className="text-gray-200">옵션 ID</strong>를 입력한 뒤 작업을
        선택하세요. (상세 조회: {`GET /options/{optionId}`})
      </p>
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-gray-500 mb-1">옵션 ID</label>
          <input
            type="number"
            min={1}
            value={optionIdInput}
            onChange={e => setOptionIdInput(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
            placeholder="예: 1"
          />
        </div>
        <Button type="button" size="sm" onClick={openEditForInputId}>
          수정
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="text-red-300"
          onClick={handleDeleteFromInput}
          disabled={deleteMutation.isPending}
        >
          삭제
        </Button>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={open => {
          if (!open) handleClose();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg text-white border-gray-600 bg-[#1a1c20]">
          <DialogHeader>
            <DialogTitle>옵션 수정 #{editId}</DialogTitle>
          </DialogHeader>
          {detailLoading || !detail ? (
            <p className="text-gray-400 text-sm">불러오는 중...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <OptionFormFields
                optionReq={optionReq}
                setOptionReq={setOptionReq}
                optionTagsStr={optionTagsStr}
                setOptionTagsStr={setOptionTagsStr}
                optionImages={optionImages}
                setOptionImages={setOptionImages}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="secondary" onClick={handleClose}>
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
