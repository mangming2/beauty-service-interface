"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/store/useAuthStore";
import { useCreateOption } from "@/queries/useOptionQueries";
import { useCreateProduct, useProductOptions } from "@/queries/useProductQueries";
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
import { parseOptionIds } from "@/lib/parseOptionIds";

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

  const isAdmin =
    authStatus?.admin === true || authStatus?.role === "ADMIN";

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
  const [optionIdsText, setOptionIdsText] = useState("");
  const [refProductIdStr, setRefProductIdStr] = useState("");
  const [representOptionId, setRepresentOptionId] = useState<number | "">("");
  const [productImages, setProductImages] = useState<File[]>([]);

  const refProductIdParsed = parseInt(refProductIdStr.trim(), 10);
  const { data: refProductOptions = [] } = useProductOptions(
    Number.isFinite(refProductIdParsed) && refProductIdParsed > 0
      ? refProductIdParsed
      : undefined
  );

  const optionIdModeLabels = useMemo(() => {
    const map = new Map<number, string>();
    refProductOptions.forEach(o => map.set(o.id, o.name));
    return productOptionIds.map(id => ({
      id,
      name: map.get(id) ?? `옵션 #${id}`,
    }));
  }, [refProductOptions, productOptionIds]);

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
          setOptionIdsText("");
          setRefProductIdStr("");
          setRepresentOptionId("");
          setProductImages([]);
        },
      }
    );
  };

  const handleOptionIdsTextChange = (text: string) => {
    setOptionIdsText(text);
    setProductOptionIds(parseOptionIds(text));
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
      <div className="max-w-2xl mx-auto">
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
            <TabsTrigger value="product-create" className={adminTabTriggerClass}>
              상품 생성
            </TabsTrigger>
            <TabsTrigger value="product-manage" className={adminTabTriggerClass}>
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
            <TabsTrigger value="recommendations" className={adminTabTriggerClass}>
              추천상품
            </TabsTrigger>
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
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  이름 참고용 상품 ID (선택)
                </label>
                <input
                  type="number"
                  min={1}
                  value={refProductIdStr}
                  onChange={e => setRefProductIdStr(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder="기존 상품 번호 — 대표 옵션 드롭다운에 이름 표시"
                />
                <p className="text-gray-500 text-xs mt-1">
                  {`GET /products/{productId}/options 로 라벨을 가져옵니다. 입력한 옵션 ID와 겹치는 항목만 이름이 보입니다.`}
                </p>
              </div>
              <ProductFormFields
                productName={productName}
                setProductName={setProductName}
                productDescription={productDescription}
                setProductDescription={setProductDescription}
                productOptionIds={productOptionIds}
                representOptionId={representOptionId}
                setRepresentOptionId={setRepresentOptionId}
                optionIdsText={optionIdsText}
                onOptionIdsTextChange={handleOptionIdsTextChange}
                optionIdModeLabels={optionIdModeLabels}
                productImages={productImages}
                setProductImages={setProductImages}
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
        </Tabs>

        <GapY size={24} />
      </div>
    </div>
  );
}
