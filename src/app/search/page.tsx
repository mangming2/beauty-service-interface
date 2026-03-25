"use client";

import { useState, useEffect, useMemo } from "react";
import { SearchIcon } from "@/components/common/Icons";
import { useInfiniteProducts } from "@/queries/useProductQueries";
import { TrendCard } from "@/components/main/TrendCard";
import { Divider } from "@/components/ui/divider";
import { PageLoading } from "@/components/common";
import type { Product } from "@/api/product";
import { useTranslation } from "@/hooks/useTranslation";

const PAGE_SIZE = 50;

function filterProductsByQuery(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  const lower = query.trim().toLowerCase();
  return products.filter(
    p =>
      p.name.toLowerCase().includes(lower) ||
      (p.description && p.description.toLowerCase().includes(lower))
  );
}

export default function SearchPage() {
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({ size: PAGE_SIZE });

  // 전체 상품 로드: 다음 페이지가 있으면 계속 요청
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allProducts = useMemo(() => (data?.pages ?? []).flat(), [data?.pages]);
  const filteredProducts = useMemo(
    () => filterProductsByQuery(allProducts, searchText),
    [allProducts, searchText]
  );

  if (isLoading) {
    return <PageLoading message={t("search.loadingProducts")} />;
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center px-5">
        <p className="text-gray-400">{t("search.errorLoadingProducts")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="px-5 pt-4 pb-5">
        {/* 검색 바 */}
        <div className="flex items-center gap-2 rounded-xl bg-[#2E3033] border border-[#3E4043] px-3 py-2.5">
          <input
            type="search"
            placeholder={t("search.searchPlaceholder")}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder:text-gray-400 text-md outline-none min-w-0"
            aria-label={t("common.search")}
          />
          <SearchIcon color="#9CA3AF" />
        </div>

        <div className="mt-6">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              {allProducts.length === 0 ? (
                <p>{t("search.noProducts")}</p>
              ) : (
                <p>{t("search.noSearchResults")}</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredProducts.map((product, index, array) => (
                <div key={product.id}>
                  <TrendCard
                    id={String(product.id)}
                    title={product.name}
                    location={product.representOption?.location ?? "-"}
                    description={product.description ?? ""}
                    imageSrc={
                      product.imageUrls?.[0] ??
                      product.representOption?.imageUrls?.[0] ??
                      "/dummy-profile.png"
                    }
                  />
                  {index < array.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
