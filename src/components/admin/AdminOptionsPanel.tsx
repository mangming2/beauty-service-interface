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
  useOptions,
  useOptionDetail,
  useUpdateOption,
  useDeleteOption,
} from "@/queries/useOptionQueries";
import { OptionFormFields, optionToCreateRequest } from "./option-form-fields";

const defaultOptionReq = (): CreateOptionRequest => ({
  name: "",
  description: "",
  price: 100000,
  address: "",
  slotStartDate: "2025-01-01",
  slotEndDate: "2025-12-31",
  slotStartHour: 9,
  slotEndHour: 18,
  discountRate: 0,
  bookingGuide: "",
  regularClosingDay: null,
  optionTagNames: [],
});

export function AdminOptionsPanel() {
  const { data: options = [], isLoading } = useOptions();
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

  const handleDelete = (id: number) => {
    if (
      !confirm(
        `옵션 #${id} 을(를) 삭제할까요? 연결된 상품이 있으면 실패할 수 있습니다.`
      )
    )
      return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        옵션 목록 · 수정 · 삭제 (PUT/DELETE /options/:id)
      </p>
      {isLoading ? (
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      ) : options.length === 0 ? (
        <p className="text-gray-500 text-sm">등록된 옵션이 없습니다.</p>
      ) : (
        <div className="rounded-lg border border-gray-600 overflow-x-auto">
          <table className="w-full text-sm min-w-[320px]">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">이름</th>
                <th className="text-left p-2">가격</th>
                <th className="text-left p-2 hidden sm:table-cell">주소</th>
                <th className="text-right p-2 w-36">작업</th>
              </tr>
            </thead>
            <tbody>
              {options.map(opt => (
                <tr
                  key={opt.id}
                  className="border-t border-gray-700 hover:bg-gray-800/50"
                >
                  <td className="p-2 text-gray-400">{opt.id}</td>
                  <td className="p-2 font-medium text-white max-w-[120px] truncate">
                    {opt.name}
                  </td>
                  <td className="p-2">₩{opt.price.toLocaleString()}</td>
                  <td className="p-2 text-gray-400 max-w-[140px] truncate hidden sm:table-cell">
                    {opt.address}
                  </td>
                  <td className="p-2 text-right space-x-1 whitespace-nowrap">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8"
                      onClick={() => setEditId(opt.id)}
                    >
                      수정
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 text-red-300"
                      onClick={() => handleDelete(opt.id)}
                      disabled={deleteMutation.isPending}
                    >
                      삭제
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
