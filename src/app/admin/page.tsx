"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/store/useAuthStore";
import { useOptions, useCreateOption } from "@/queries/useOptionQueries";
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

export default function AdminPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const { data: authStatus, isLoading: statusLoading } = useAuthStatus();
  const { data: options = [] } = useOptions();
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
  const [optionTagsStr, setOptionTagsStr] = useState("hair,makeup");
  const [optionImages, setOptionImages] = useState<File[]>([]);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productOptionIds, setProductOptionIds] = useState<number[]>([]);
  const [representOptionId, setRepresentOptionId] = useState<number | "">("");
  const [productImages, setProductImages] = useState<File[]>([]);

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
          setProductImages([]);
        },
      }
    );
  };

  const toggleProductOption = (id: number) => {
    setProductOptionIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
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
          <TabsList className="flex flex-wrap h-auto gap-1 bg-gray-800 p-1 justify-start">
            <TabsTrigger value="option-create" className="text-xs sm:text-sm">
              옵션 생성
            </TabsTrigger>
            <TabsTrigger value="option-manage" className="text-xs sm:text-sm">
              옵션 관리
            </TabsTrigger>
            <TabsTrigger value="product-create" className="text-xs sm:text-sm">
              상품 생성
            </TabsTrigger>
            <TabsTrigger value="product-manage" className="text-xs sm:text-sm">
              상품 관리
            </TabsTrigger>
            <TabsTrigger value="announcements" className="text-xs sm:text-sm">
              공지
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm">
              유저
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
              <ProductFormFields
                productName={productName}
                setProductName={setProductName}
                productDescription={productDescription}
                setProductDescription={setProductDescription}
                productOptionIds={productOptionIds}
                toggleProductOption={toggleProductOption}
                representOptionId={representOptionId}
                setRepresentOptionId={setRepresentOptionId}
                options={options}
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
        </Tabs>

        <GapY size={24} />
      </div>
    </div>
  );
}
