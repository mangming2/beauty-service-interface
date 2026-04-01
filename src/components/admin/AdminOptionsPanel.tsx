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
  const [editId, setEditId] = useState<number | null>(null);
  const [tagFilter, setTagFilter] = useState("");

  const { data: options = [], isLoading: listLoading } = useOptions(
    tagFilter.trim() || undefined
  );
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

  const handleDelete = (id: number, name: string) => {
    if (
      !confirm(`옵션 "${name}" (#${id}) 을(를) 삭제할까요? 연결된 상품이 있으면 실패할 수 있습니다.`)
    )
      return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <input
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
          placeholder="태그 필터 (예: hair)"
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 text-sm"
        />
        <span className="text-xs text-gray-500 shrink-0">
          {listLoading ? "로딩 중..." : `${options.length}개`}
        </span>
      </div>

      {options.length === 0 && !listLoading ? (
        <p className="text-gray-500 text-sm">등록된 옵션이 없습니다.</p>
      ) : (
        <div className="rounded-lg border border-gray-600 overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="text-left p-2 w-12">ID</th>
                <th className="text-left p-2">이름</th>
                <th className="text-left p-2 hidden sm:table-cell">태그</th>
                <th className="text-left p-2 w-20">가격</th>
                <th className="text-left p-2 w-24">액션</th>
              </tr>
            </thead>
            <tbody>
              {options.map(opt => (
                <tr
                  key={opt.id}
                  className="border-t border-gray-700 hover:bg-gray-800/50"
                >
                  <td className="p-2 text-gray-400">{opt.id}</td>
                  <td className="p-2 text-white max-w-[160px] truncate">
                    {opt.name}
                  </td>
                  <td className="p-2 text-gray-400 hidden sm:table-cell">
                    {opt.categoryTagName}
                  </td>
                  <td className="p-2 text-gray-400">
                    {opt.price.toLocaleString()}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => setEditId(opt.id)}
                      >
                        수정
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-7 px-2 text-xs text-red-300"
                        onClick={() => handleDelete(opt.id, opt.name)}
                        disabled={deleteMutation.isPending}
                      >
                        삭제
                      </Button>
                    </div>
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
