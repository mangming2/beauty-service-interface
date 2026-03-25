"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useLatestInKoreaRecommendations,
  useUpsertLatestKoreaRecommendation,
} from "@/queries/useRecommendationQueries";

function parseProductIds(text: string): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const part of text.split(/[,，\s]+/)) {
    const n = parseInt(part.trim(), 10);
    if (!Number.isFinite(n) || n <= 0) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}

export function AdminRecommendationsPanel() {
  const { data: currentRecommendations = [], isLoading } =
    useLatestInKoreaRecommendations({ size: 50 });

  const upsertMutation = useUpsertLatestKoreaRecommendation();

  const [productIdsText, setProductIdsText] = useState("");

  const parsedIds = parseProductIds(productIdsText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedIds.length === 0) {
      alert("상품 ID를 1개 이상 입력하세요.");
      return;
    }
    upsertMutation.mutate(
      { productIds: parsedIds },
      {
        onSuccess: data => {
          alert(`추천 상품 ${data.productCount}개가 등록되었습니다.`);
          setProductIdsText("");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-400">
        Latest in Korea 추천 상품 등록 (POST /admin/products/recommendations/latest-in-korea)
      </p>

      {/* 현재 추천 상품 목록 */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">현재 추천 상품</h3>
        {isLoading ? (
          <p className="text-gray-400 text-sm">불러오는 중...</p>
        ) : currentRecommendations.length === 0 ? (
          <p className="text-gray-500 text-sm">등록된 추천 상품이 없습니다.</p>
        ) : (
          <div className="rounded-lg border border-gray-600 overflow-x-auto">
            <table className="w-full text-sm min-w-[280px]">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="text-left p-2 w-12">순서</th>
                  <th className="text-left p-2 w-16">ID</th>
                  <th className="text-left p-2">상품명</th>
                </tr>
              </thead>
              <tbody>
                {currentRecommendations.map((p, idx) => (
                  <tr key={p.id} className="border-t border-gray-700">
                    <td className="p-2 text-gray-500">{idx + 1}</td>
                    <td className="p-2 text-gray-400">{p.id}</td>
                    <td className="p-2 text-white max-w-[200px] truncate">{p.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 추천 상품 등록 폼 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <h3 className="text-sm font-medium text-gray-300">추천 상품 교체</h3>
        <p className="text-xs text-gray-500">
          입력한 순서대로 저장됩니다. 기존 목록은 완전히 교체됩니다. (최대 50개)
        </p>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            상품 ID 목록 (쉼표 또는 공백 구분)
          </label>
          <textarea
            value={productIdsText}
            onChange={e => setProductIdsText(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 text-sm resize-none"
            placeholder="예: 12, 5, 19, 3"
          />
          {parsedIds.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              파싱된 ID ({parsedIds.length}개): {parsedIds.join(", ")}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={upsertMutation.isPending || parsedIds.length === 0}
          className="w-full"
        >
          {upsertMutation.isPending ? "저장 중..." : "추천 상품 저장"}
        </Button>
        {upsertMutation.isError && (
          <p className="text-red-400 text-sm">{upsertMutation.error.message}</p>
        )}
      </form>
    </div>
  );
}
