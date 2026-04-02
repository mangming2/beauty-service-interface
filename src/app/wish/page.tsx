"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PageLoading } from "@/components/common";
import { GapY } from "../../components/ui/gap";
import { useWishes, useToggleWish } from "@/queries/useWishQueries";
import { useMyPageUser } from "@/queries/useMyPageQueries";
import { useEffect } from "react";
import { HeartIcon } from "@/components/common/Icons";
import { useTranslation } from "@/hooks/useTranslation";
import { useProducts } from "@/queries/useProductQueries";
import { useLatestInKoreaRecommendations } from "@/queries/useRecommendationQueries";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import PackageSection from "@/components/main/PackageSection";
import type { Product } from "@/api/product";

export default function Wish() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: myPageUser, isLoading: userLoading } = useMyPageUser();
  const { data: wishes = [], isLoading: wishesLoading } = useWishes();
  const { data: allProducts = [], isLoading: productsLoading } = useProducts({
    size: 100,
  });
  const { data: suggestions = [] } = useLatestInKoreaRecommendations({
    size: 6,
  });
  const toggleWishMutation = useToggleWish();

  useEffect(() => {
    if (!userLoading && !myPageUser) {
      router.push("/login");
    }
  }, [myPageUser, userLoading, router]);

  const productMap = useMemo(() => {
    const map = new Map<number, Product>();
    allProducts.forEach(p => map.set(p.id, p));
    return map;
  }, [allProducts]);

  const handlePackageClick = (id: number) => router.push(`/package/${id}`);

  if (userLoading || wishesLoading || productsLoading) {
    return <PageLoading />;
  }

  return (
    <div className="flex flex-col flex-1 text-white">
      <div className="px-5 pt-6">
        <h1 className="title-lg text-white">{t("wish.myWishlist")}</h1>
      </div>

      <GapY size={20} />

      {wishes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 pb-20">
          <Image src="/empty.png" alt="empty" width={180} height={120} />
          <p className="title-md text-white">{t("wish.emptyWishlist")}</p>
          <p className="text-md text-gray-font text-center">
            {t("wish.emptyWishlistSub")}
          </p>
        </div>
      ) : (
        <>
          <div>
            {wishes.map(item => {
              const product = productMap.get(item.id);
              return (
                <div key={item.id} className="relative pl-5">
                  <RecommendationGallery
                    images={
                      product?.imageUrls?.length
                        ? product.imageUrls
                        : [
                            "/dummy-package.png",
                            "/dummy-package.png",
                            "/dummy-package.png",
                          ]
                    }
                    salonInfo={{
                      tags:
                        product?.representOption?.tags ??
                        product?.tagNames ??
                        [],
                      name: item.name,
                      originalPrice:
                        product?.representOption?.originalPrice ??
                        item.minPrice ??
                        0,
                      finalPrice:
                        product?.representOption?.finalPrice ??
                        item.minPrice ??
                        0,
                      discountRate: product?.representOption?.discountRate ?? 0,
                      rating:
                        product?.rating ??
                        product?.representOption?.rating ??
                        0,
                      reviewCount:
                        product?.reviewCount ??
                        product?.representOption?.reviewCount ??
                        0,
                      location: product?.representOption?.location ?? "",
                    }}
                    onClick={() => handlePackageClick(item.id)}
                  />
                  {/* 위시 토글 버튼 */}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleWishMutation.mutate(item.id);
                    }}
                    disabled={toggleWishMutation.isPending}
                    className="absolute top-6 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/40"
                  >
                    <HeartIcon color="#F92595" />
                  </button>
                </div>
              );
            })}
          </div>

          {suggestions.length > 0 && (
            <>
              <GapY size={20} />
              <PackageSection
                title={t("wish.howAboutThisPackage")}
                packages={suggestions}
                onPackageClick={handlePackageClick}
              />
              <GapY size={24} />
            </>
          )}
        </>
      )}
    </div>
  );
}
