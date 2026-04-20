"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  useLatestInKoreaRecommendations,
  useUpsertLatestKoreaRecommendation,
  useAdminPickedRecommendations,
  useSetProductRecommendation,
  useSetProductRecommendationScore,
} from "@/queries/useRecommendationQueries";
import { useProducts } from "@/queries/useProductQueries";

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

// ─── 섹션 1: 랜딩 캐러셀 추천 (admin-picked) ───────────────────────────────

function AdminPickedSection() {
  const { data: allProducts = [], isLoading: productsLoading } = useProducts({
    size: 100,
  });
  const { data: pickedList = [], isLoading: pickedLoading } =
    useAdminPickedRecommendations({ size: 100 });
  const setRecommendationMutation = useSetProductRecommendation();

  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 추천 목록 로드되면 초기 체크 상태 설정
  useEffect(() => {
    if (!pickedLoading && !initialized) {
      setCheckedIds(new Set(pickedList.map(p => p.id)));
      setInitialized(true);
    }
  }, [pickedLoading, pickedList, initialized]);

  const toggle = (id: number) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    const pickedIds = new Set(pickedList.map(p => p.id));
    const changes = allProducts
      .filter(p => checkedIds.has(p.id) !== pickedIds.has(p.id))
      .map(p => ({ productId: p.id, recommended: checkedIds.has(p.id) }));

    if (changes.length === 0) {
      alert("변경 사항이 없습니다.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      await Promise.all(
        changes.map(c => setRecommendationMutation.mutateAsync(c))
      );
      alert(`${changes.length}개 상품 저장 완료`);
    } catch (e) {
      setSaveError((e as Error)?.message ?? "저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const isLoading = productsLoading || pickedLoading;
  const checkedCount = checkedIds.size;

  return (
    <div className="rounded-xl border border-gray-600 p-5 space-y-4">
      {/* 헤더 */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
            랜딩 캐러셀
          </span>
          <h3 className="text-base font-semibold text-white">
            추천 패키지 on/off
          </h3>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          랜딩 페이지 <strong className="text-gray-200">상단 캐러셀</strong>에
          노출할 패키지를 선택하세요. 체크한 상품이 캐러셀에 표시됩니다.
          <br />
          API:{" "}
          <code className="text-gray-300">
            PUT /admin/products/&#123;productId&#125;/recommendation
          </code>
        </p>
      </div>

      {/* 상품 목록 + 체크박스 */}
      {isLoading ? (
        <p className="text-gray-500 text-sm">불러오는 중...</p>
      ) : allProducts.length === 0 ? (
        <p className="text-gray-500 text-sm">등록된 상품이 없습니다.</p>
      ) : (
        <div className="rounded-lg border border-gray-700 overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-sm min-w-[280px]">
            <thead className="bg-gray-800/60 text-gray-400 sticky top-0">
              <tr>
                <th className="p-2 w-10 text-center">추천</th>
                <th className="text-left p-2 w-16">ID</th>
                <th className="text-left p-2">상품명</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map(p => (
                <tr
                  key={p.id}
                  className={`border-t border-gray-700/60 cursor-pointer hover:bg-gray-800/40 transition-colors ${checkedIds.has(p.id) ? "bg-pink-500/5" : ""}`}
                  onClick={() => toggle(p.id)}
                >
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={checkedIds.has(p.id)}
                      onChange={() => toggle(p.id)}
                      onClick={e => e.stopPropagation()}
                      className="accent-pink-500"
                    />
                  </td>
                  <td className="p-2 text-gray-400">{p.id}</td>
                  <td className="p-2 text-white max-w-[200px] truncate">
                    {p.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 저장 */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-gray-500">{checkedCount}개 선택됨</p>
        <Button onClick={handleSave} disabled={saving || isLoading}>
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>
      {saveError && <p className="text-red-400 text-xs">{saveError}</p>}
    </div>
  );
}

// ─── 섹션 2: Latest in Korea 순서 관리 ─────────────────────────────────────

function RecommendationScoreSection() {
  const { data: allProducts = [], isLoading } = useProducts({ size: 100 });
  const setScoreMutation = useSetProductRecommendationScore();
  const [scores, setScores] = useState<Record<number, string>>({});
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (allProducts.length === 0) return;

    setScores(prev => {
      const next = { ...prev };
      let changed = false;

      allProducts.forEach(product => {
        if (next[product.id] !== undefined) return;

        next[product.id] = String(product.recommendationScore ?? 0);
        changed = true;
      });

      return changed ? next : prev;
    });
  }, [allProducts]);

  const handleScoreChange = (productId: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    setScores(prev => ({ ...prev, [productId]: value }));
  };

  const handleSave = async (productId: number) => {
    const rawValue = scores[productId] ?? "";
    const score = Number(rawValue);

    if (rawValue === "" || !Number.isInteger(score) || score < 0) {
      setSaveError("추천 점수는 0 이상의 정수만 저장할 수 있습니다.");
      setSaveMessage(null);
      return;
    }

    setSaveError(null);
    setSaveMessage(null);

    try {
      const result = await setScoreMutation.mutateAsync({ productId, score });
      setScores(prev => ({
        ...prev,
        [productId]: String(result.recommendationScore),
      }));
      setSaveMessage(
        `상품 #${productId} 추천 점수를 ${result.recommendationScore}로 저장했습니다.`
      );
    } catch (error) {
      setSaveError(
        (error as Error)?.message ?? "추천 점수 저장 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="rounded-xl border border-gray-600 p-5 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Recommend Sort
          </span>
          <h3 className="text-base font-semibold text-white">추천 점수 관리</h3>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          추천 페이지에서 <strong className="text-gray-200">Recommend</strong>
          정렬을 눌렀을 때 사용할 점수를 설정합니다.
          <br />
          API:{" "}
          <code className="text-gray-300">
            PUT /admin/products/&#123;productId&#125;/recommendation-score
          </code>
        </p>
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-sm">불러오는 중...</p>
      ) : allProducts.length === 0 ? (
        <p className="text-gray-500 text-sm">등록된 상품이 없습니다.</p>
      ) : (
        <div className="rounded-lg border border-gray-700 overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-sm min-w-[360px]">
            <thead className="bg-gray-800/60 text-gray-400 sticky top-0">
              <tr>
                <th className="text-left p-2 w-16">ID</th>
                <th className="text-left p-2">상품명</th>
                <th className="text-left p-2 w-32">추천 점수</th>
                <th className="text-right p-2 w-24">저장</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map(product => (
                <tr
                  key={product.id}
                  className="border-t border-gray-700/60 hover:bg-gray-800/40"
                >
                  <td className="p-2 text-gray-400">{product.id}</td>
                  <td className="p-2 text-white max-w-[200px] truncate">
                    {product.name}
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={scores[product.id] ?? ""}
                      onChange={e =>
                        handleScoreChange(product.id, e.target.value)
                      }
                      className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                      placeholder="0"
                    />
                  </td>
                  <td className="p-2 text-right">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSave(product.id)}
                      disabled={setScoreMutation.isPending}
                    >
                      저장
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-500">
        현재 상품 목록에서 내려온 추천 점수를 초기값으로 보여줍니다.
      </p>
      {saveMessage && <p className="text-green-400 text-xs">{saveMessage}</p>}
      {saveError && <p className="text-red-400 text-xs">{saveError}</p>}
    </div>
  );
}

function LatestInKoreaSection() {
  const { data: list = [], isLoading } = useLatestInKoreaRecommendations({
    size: 50,
  });
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
          alert(`${data.productCount}개 저장 완료`);
          setProductIdsText("");
        },
      }
    );
  };

  return (
    <div className="rounded-xl border border-gray-600 p-5 space-y-4">
      {/* 헤더 */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Latest Trends
          </span>
          <h3 className="text-base font-semibold text-white">노출 순서 관리</h3>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          랜딩 페이지{" "}
          <strong className="text-gray-200">
            하단 &ldquo;Latest Trends&rdquo;
          </strong>{" "}
          섹션에 노출할 상품 목록과 순서를 설정합니다. 입력한 순서 그대로
          저장되며, 저장 시 기존 목록은 완전히 교체됩니다. (최대 50개)
          <br />
          API:{" "}
          <code className="text-gray-300">
            POST /admin/products/recommendations/latest-in-korea
          </code>
        </p>
      </div>

      {/* 현재 목록 */}
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          현재 노출 목록 (순서대로)
        </p>
        {isLoading ? (
          <p className="text-gray-500 text-sm">불러오는 중...</p>
        ) : list.length === 0 ? (
          <p className="text-gray-500 text-sm">등록된 상품이 없습니다.</p>
        ) : (
          <div className="rounded-lg border border-gray-700 overflow-x-auto">
            <table className="w-full text-sm min-w-[280px]">
              <thead className="bg-gray-800/60 text-gray-400">
                <tr>
                  <th className="text-left p-2 w-12">순서</th>
                  <th className="text-left p-2 w-16">ID</th>
                  <th className="text-left p-2">상품명</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p, idx) => (
                  <tr key={p.id} className="border-t border-gray-700/60">
                    <td className="p-2 text-gray-500">{idx + 1}</td>
                    <td className="p-2 text-gray-400">{p.id}</td>
                    <td className="p-2 text-white max-w-[200px] truncate">
                      {p.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 교체 폼 */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <p className="text-xs font-medium text-gray-400">목록 교체</p>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            상품 ID (쉼표 또는 공백으로 구분, 입력 순서대로 저장)
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
              파싱된 ID {parsedIds.length}개: {parsedIds.join(", ")}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={upsertMutation.isPending || parsedIds.length === 0}
          className="w-full"
        >
          {upsertMutation.isPending ? "저장 중..." : "목록 저장 (기존 교체)"}
        </Button>
        {upsertMutation.isError && (
          <p className="text-red-400 text-xs">{upsertMutation.error.message}</p>
        )}
      </form>
    </div>
  );
}

// ─── 메인 패널 ──────────────────────────────────────────────────────────────

export function AdminRecommendationsPanel() {
  return (
    <div className="space-y-6">
      <AdminPickedSection />
      <RecommendationScoreSection />
      <LatestInKoreaSection />
    </div>
  );
}
