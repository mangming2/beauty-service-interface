"use client";

import { useEffect, useMemo, useState } from "react";
import { parseOptionIds } from "@/lib/parseOptionIds";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateProductRequest } from "@/api/product";
import {
  useInfiniteProducts,
  useProductDetail,
  useProductOptions,
  useUpdateProduct,
  useDeleteProduct,
} from "@/queries/useProductQueries";
import { ProductFormFields } from "./product-form-fields";

const PAGE_SIZE = 50;

export function AdminProductsPanel() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({ size: PAGE_SIZE });

  const products = useMemo(() => (data?.pages ?? []).flat(), [data?.pages]);

  const [editId, setEditId] = useState<number | null>(null);
  const { data: productDetail, isLoading: detailLoading } = useProductDetail(
    editId ?? undefined
  );
  const { data: productOptions = [], isLoading: optionsLoading } =
    useProductOptions(editId ?? undefined);

  const pickerOptions = useMemo(
    () => productOptions.map(o => ({ id: o.id, name: o.name })),
    [productOptions]
  );

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [optionIdsText, setOptionIdsText] = useState("");
  const [representOptionId, setRepresentOptionId] = useState<number | "">("");
  const [productImages, setProductImages] = useState<File[]>([]);

  const productOptionIds = useMemo(
    () => parseOptionIds(optionIdsText),
    [optionIdsText]
  );

  const optionIdModeLabels = useMemo(() => {
    const map = new Map(pickerOptions.map(o => [o.id, o.name]));
    return productOptionIds.map(id => ({
      id,
      name: map.get(id) ?? `옵션 #${id}`,
    }));
  }, [pickerOptions, productOptionIds]);

  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const dialogOpen = editId !== null;

  useEffect(() => {
    if (!dialogOpen || !productDetail || optionsLoading) return;
    setProductName(productDetail.name);
    setProductDescription(productDetail.description ?? "");
    const ids = productOptions.map(o => o.id);
    setOptionIdsText(ids.join(", "));
    const rep = productOptions.find(o => o.isRepresent)?.id ?? ids[0];
    setRepresentOptionId(rep ?? "");
    setProductImages([]);
  }, [dialogOpen, productDetail, productOptions, optionsLoading]);

  const handleClose = () => {
    setEditId(null);
    setProductName("");
    setProductDescription("");
    setOptionIdsText("");
    setRepresentOptionId("");
    setProductImages([]);
  };

  const handleOptionIdsTextChange = (text: string) => {
    setOptionIdsText(text);
    setRepresentOptionId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null) return;
    const ids = parseOptionIds(optionIdsText);
    if (ids.length === 0) {
      alert("옵션을 1개 이상 선택하세요.");
      return;
    }
    const repId =
      representOptionId !== "" && ids.includes(Number(representOptionId))
        ? Number(representOptionId)
        : ids[0];
    const request: CreateProductRequest = {
      name: productName,
      description: productDescription,
      optionIds: ids,
      representOptionId: repId,
    };
    updateMutation.mutate(
      {
        productId: editId,
        request,
        images: productImages.length ? productImages : undefined,
      },
      { onSuccess: handleClose }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm(`상품 #${id} 을(를) 삭제할까요?`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        상품 목록 · 수정 · 삭제 (PUT/DELETE /products/:id)
      </p>
      {isLoading ? (
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-sm">상품이 없습니다.</p>
      ) : (
        <div className="rounded-lg border border-gray-600 overflow-x-auto">
          <table className="w-full text-sm min-w-[300px]">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">상품명</th>
                <th className="text-left p-2 hidden sm:table-cell">가격</th>
                <th className="text-right p-2 w-36">작업</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr
                  key={p.id}
                  className="border-t border-gray-700 hover:bg-gray-800/50"
                >
                  <td className="p-2 text-gray-400">{p.id}</td>
                  <td className="p-2 font-medium text-white max-w-[140px] truncate">
                    {p.name}
                  </td>
                  <td className="p-2 hidden sm:table-cell text-gray-400">
                    {p.minPrice != null
                      ? `₩${p.minPrice.toLocaleString()}`
                      : p.representOption?.finalPrice != null
                        ? `₩${p.representOption.finalPrice.toLocaleString()}`
                        : "-"}
                  </td>
                  <td className="p-2 text-right space-x-1 whitespace-nowrap">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8"
                      onClick={() => setEditId(p.id)}
                    >
                      수정
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 text-red-300"
                      onClick={() => handleDelete(p.id)}
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

      {hasNextPage && (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
        </Button>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={open => {
          if (!open) handleClose();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg text-white border-gray-600 bg-[#1a1c20]">
          <DialogHeader>
            <DialogTitle>상품 수정 #{editId}</DialogTitle>
          </DialogHeader>
          {detailLoading || optionsLoading || !productDetail ? (
            <p className="text-gray-400 text-sm">불러오는 중...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <ProductFormFields
                productName={productName}
                setProductName={setProductName}
                productDescription={productDescription}
                setProductDescription={setProductDescription}
                productOptionIds={productOptionIds}
                representOptionId={representOptionId}
                setRepresentOptionId={setRepresentOptionId}
                productImages={productImages}
                setProductImages={setProductImages}
                optionIdsText={optionIdsText}
                onOptionIdsTextChange={handleOptionIdsTextChange}
                optionIdModeLabels={optionIdModeLabels}
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
