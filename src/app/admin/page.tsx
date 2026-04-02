"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/store/useAuthStore";
import { useCreateOption, useOptions } from "@/queries/useOptionQueries";
import { useCreateProduct } from "@/queries/useProductQueries";
import type { CreateOptionRequest } from "@/api/option";
import type { CreateProductRequest } from "@/api/product";
import { GapY } from "@/components/ui/gap";
import { OptionFormFields } from "@/components/admin/option-form-fields";
import { ProductFormFields } from "@/components/admin/product-form-fields";
import { AdminAnnouncementsPanel } from "@/components/admin/AdminAnnouncementsPanel";
import { AdminOptionsPanel } from "@/components/admin/AdminOptionsPanel";
import { AdminProductsPanel } from "@/components/admin/AdminProductsPanel";
import { AdminUsersPanel } from "@/components/admin/AdminUsersPanel";
import { AdminReservationsPanel } from "@/components/admin/AdminReservationsPanel";
import { AdminRecommendationsPanel } from "@/components/admin/AdminRecommendationsPanel";
import { useResetAndSeedDb } from "@/queries/useAdminQueries";

/** 관리자 탭: 기본 TabsTrigger는 dark muted 색이라 회색 배경에서 대비가 거의 없음 */
const adminTabTriggerClass =
  "text-xs sm:text-sm shrink-0 rounded-md px-2.5 py-2 font-medium " +
  "text-gray-200 hover:bg-gray-700/60 hover:text-white " +
  "data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm";

export default function AdminPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const { data: authStatus, isLoading: statusLoading } = useAuthStatus();
  const createOptionMutation = useCreateOption();
  const createProductMutation = useCreateProduct();
  const resetAndSeedMutation = useResetAndSeedDb();

  const isAdmin = authStatus?.admin === true || authStatus?.role === "ADMIN";

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (statusLoading) return;
    if (!isAdmin) {
      router.replace("/my");
    }
  }, [isAuthenticated, isAdmin, statusLoading, router]);

  const [optionReq, setOptionReq] = useState<CreateOptionRequest>({
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
  const [optionTagsStr, setOptionTagsStr] = useState("hair,makeup");
  const [optionImages, setOptionImages] = useState<File[]>([]);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productOptionIds, setProductOptionIds] = useState<number[]>([]);
  const [representOptionId, setRepresentOptionId] = useState<number | "">("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [tagFilter, setTagFilter] = useState("전체");
  const [optionSearch, setOptionSearch] = useState("");

  const { data: allOptions = [], isLoading: optionsLoading } = useOptions();

  const allTags = useMemo(
    () => [
      "전체",
      ...Array.from(new Set(allOptions.map(o => o.categoryTagName))),
    ],
    [allOptions]
  );

  const filteredOptions = useMemo(
    () =>
      allOptions
        .filter(o => tagFilter === "전체" || o.categoryTagName === tagFilter)
        .filter(o => o.name.includes(optionSearch.trim()))
        .map(o => ({ id: o.id, name: o.name, price: o.price })),
    [allOptions, tagFilter, optionSearch]
  );

  const handleCreateOption = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = optionTagsStr
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    createOptionMutation.mutate(
      {
        request: { ...optionReq, optionTagNames: tags },
        images: optionImages.length ? optionImages : undefined,
      },
      {
        onSuccess: () => {
          setOptionReq(prev => ({ ...prev, name: "", description: "" }));
          setOptionImages([]);
          setOptionTagsStr("hair,makeup");
        },
      }
    );
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (productOptionIds.length === 0) {
      alert("옵션을 1개 이상 선택하세요.");
      return;
    }
    const repId =
      representOptionId !== "" &&
      productOptionIds.includes(Number(representOptionId))
        ? Number(representOptionId)
        : productOptionIds[0];
    const request: CreateProductRequest = {
      name: productName,
      description: productDescription,
      optionIds: productOptionIds,
      representOptionId: repId,
    };
    createProductMutation.mutate(
      { request, images: productImages.length ? productImages : undefined },
      {
        onSuccess: () => {
          setProductName("");
          setProductDescription("");
          setProductOptionIds([]);
          setRepresentOptionId("");
          setTagFilter("전체");
          setOptionSearch("");
          setProductImages([]);
        },
      }
    );
  };

  const toggleProductOption = (id: number) => {
    setProductOptionIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    setRepresentOptionId("");
  };

  if (!isAuthenticated || statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <span>로딩 중...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen text-white bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">관리자 페이지</h1>
          <Link href="/my" className="text-sm text-gray-400 hover:text-white">
            ← 마이페이지
          </Link>
        </div>

        <Tabs defaultValue="option-create" className="w-full">
          <TabsList className="flex flex-wrap h-auto w-full max-w-full gap-1 rounded-lg border border-gray-600 bg-gray-900/90 p-1.5 justify-start">
            <TabsTrigger value="option-create" className={adminTabTriggerClass}>
              옵션 생성
            </TabsTrigger>
            <TabsTrigger value="option-manage" className={adminTabTriggerClass}>
              옵션 관리
            </TabsTrigger>
            <TabsTrigger
              value="product-create"
              className={adminTabTriggerClass}
            >
              상품 생성
            </TabsTrigger>
            <TabsTrigger
              value="product-manage"
              className={adminTabTriggerClass}
            >
              상품 관리
            </TabsTrigger>
            <TabsTrigger value="announcements" className={adminTabTriggerClass}>
              공지
            </TabsTrigger>
            <TabsTrigger value="users" className={adminTabTriggerClass}>
              유저
            </TabsTrigger>
            <TabsTrigger value="reservations" className={adminTabTriggerClass}>
              예약
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className={adminTabTriggerClass}
            >
              추천상품
            </TabsTrigger>
            {process.env.NODE_ENV === "development" && (
              <TabsTrigger value="dev-tools" className={adminTabTriggerClass}>
                🛠 Dev Tools
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="option-create" className="mt-6">
            <form onSubmit={handleCreateOption} className="space-y-4">
              <OptionFormFields
                optionReq={optionReq}
                setOptionReq={setOptionReq}
                optionTagsStr={optionTagsStr}
                setOptionTagsStr={setOptionTagsStr}
                optionImages={optionImages}
                setOptionImages={setOptionImages}
              />
              <Button
                type="submit"
                disabled={createOptionMutation.isPending}
                className="w-full"
              >
                {createOptionMutation.isPending ? "생성 중..." : "옵션 생성"}
              </Button>
              {createOptionMutation.isError && (
                <p className="text-red-400 text-sm">
                  {createOptionMutation.error.message}
                </p>
              )}
              {createOptionMutation.isSuccess && (
                <p className="text-green-400 text-sm">옵션이 생성되었습니다.</p>
              )}
            </form>
          </TabsContent>

          <TabsContent value="option-manage" className="mt-6">
            <AdminOptionsPanel />
          </TabsContent>

          <TabsContent value="product-create" className="mt-6">
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <ProductFormFields
                productName={productName}
                setProductName={setProductName}
                productDescription={productDescription}
                setProductDescription={setProductDescription}
                productOptionIds={productOptionIds}
                representOptionId={representOptionId}
                setRepresentOptionId={setRepresentOptionId}
                pickerOptions={filteredOptions}
                toggleProductOption={toggleProductOption}
                productImages={productImages}
                setProductImages={setProductImages}
                optionPickerHeader={
                  <div className="space-y-2 mb-2">
                    <div className="flex flex-wrap gap-1">
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setTagFilter(tag)}
                          className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                            tagFilter === tag
                              ? "bg-pink-500 border-pink-500 text-white"
                              : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={optionSearch}
                      onChange={e => setOptionSearch(e.target.value)}
                      placeholder="옵션명 검색"
                      className="w-full px-3 py-1.5 rounded bg-gray-800 text-white border border-gray-600 text-sm"
                    />
                    {optionsLoading && (
                      <p className="text-gray-500 text-xs">옵션 로딩 중...</p>
                    )}
                  </div>
                }
              />
              <Button
                type="submit"
                disabled={
                  createProductMutation.isPending ||
                  productOptionIds.length === 0
                }
                className="w-full"
              >
                {createProductMutation.isPending ? "생성 중..." : "상품 생성"}
              </Button>
              {createProductMutation.isError && (
                <p className="text-red-400 text-sm">
                  {createProductMutation.error.message}
                </p>
              )}
              {createProductMutation.isSuccess && (
                <p className="text-green-400 text-sm">상품이 생성되었습니다.</p>
              )}
            </form>
          </TabsContent>

          <TabsContent value="product-manage" className="mt-6">
            <AdminProductsPanel />
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <AdminAnnouncementsPanel />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AdminUsersPanel />
          </TabsContent>

          <TabsContent value="reservations" className="mt-6">
            <AdminReservationsPanel />
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <AdminRecommendationsPanel />
          </TabsContent>

          {process.env.NODE_ENV === "development" && (
            <TabsContent value="dev-tools" className="mt-6">
              <div className="space-y-4 max-w-lg">
                <div>
                  <h2 className="text-base font-semibold mb-1">Dev Tools</h2>
                  <p className="text-gray-400 text-sm">
                    로컬/개발 환경 전용입니다. 프로덕션에서는 노출되지 않습니다.
                  </p>
                </div>
                <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-red-400">
                      DB 초기화 + 더미 데이터 생성
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      모든 테이블을 truncate하고 id=9999 기준 더미 데이터를
                      생성합니다.
                      <br />
                      <code className="text-gray-300">
                        POST /dev/tools/db/reset-and-seed
                      </code>
                    </p>
                  </div>
                  <Button
                    type="button"
                    disabled={resetAndSeedMutation.isPending}
                    onClick={() => {
                      if (
                        !confirm(
                          "DB 전체를 초기화하고 더미 데이터를 생성합니다. 계속할까요?"
                        )
                      )
                        return;
                      resetAndSeedMutation.mutate();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white w-full"
                  >
                    {resetAndSeedMutation.isPending
                      ? "초기화 중..."
                      : "DB 초기화 + 더미 생성"}
                  </Button>
                  {resetAndSeedMutation.isSuccess &&
                    resetAndSeedMutation.data && (
                      <div className="text-xs text-green-400 space-y-0.5">
                        <p>
                          ✓ 완료 (truncated{" "}
                          {resetAndSeedMutation.data.truncatedTableCount}개
                          테이블)
                        </p>
                        <p>
                          상품 ID: {resetAndSeedMutation.data.seededProductId} /
                          옵션 ID: {resetAndSeedMutation.data.seededOptionId}
                        </p>
                        <p>
                          예약 ID:{" "}
                          {resetAndSeedMutation.data.seededReservationId} / 리뷰
                          ID: {resetAndSeedMutation.data.seededReviewId}
                        </p>
                        <p>
                          유저 ID: {resetAndSeedMutation.data.seededUserId} /
                          배너 ID:{" "}
                          {resetAndSeedMutation.data.seededMainBannerId}
                        </p>
                      </div>
                    )}
                  {resetAndSeedMutation.isError && (
                    <p className="text-red-400 text-xs">
                      오류: {resetAndSeedMutation.error.message}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        <GapY size={24} />
      </div>
    </div>
  );
}
