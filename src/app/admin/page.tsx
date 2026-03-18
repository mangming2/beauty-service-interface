"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMyPageUser } from "@/queries/useMyPageQueries";
import { useOptions, useCreateOption } from "@/queries/useOptionQueries";
import { useCreateProduct } from "@/queries/useProductQueries";
import type { CreateOptionRequest } from "@/api/option";
import type { CreateProductRequest } from "@/api/product";
import { GapY } from "@/components/ui/gap";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function AdminPage() {
  const router = useRouter();
  const { data: myPageUser, isLoading: userLoading } = useMyPageUser();
  const { data: options = [] } = useOptions();
  const createOptionMutation = useCreateOption();
  const createProductMutation = useCreateProduct();

  const isAdmin = myPageUser?.role === "ADMIN";

  useEffect(() => {
    if (userLoading) return;
    if (!myPageUser || !isAdmin) {
      router.replace("/my");
    }
  }, [myPageUser, isAdmin, userLoading, router]);

  // 옵션 생성 폼
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

  // 상품 생성 폼
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

  if (userLoading || !myPageUser) {
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

        <Tabs defaultValue="option" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="option">옵션 생성</TabsTrigger>
            <TabsTrigger value="product">상품 생성</TabsTrigger>
          </TabsList>

          <TabsContent value="option" className="mt-6">
            <form onSubmit={handleCreateOption} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  이름 *
                </label>
                <input
                  required
                  value={optionReq.name}
                  onChange={e =>
                    setOptionReq(prev => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="뷰티 스파 이용권"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  설명 *
                </label>
                <textarea
                  required
                  value={optionReq.description}
                  onChange={e =>
                    setOptionReq(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="프라이빗 뷰티 스파 2시간 이용"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    가격 *
                  </label>
                  <input
                    type="number"
                    required
                    value={optionReq.price}
                    onChange={e =>
                      setOptionReq(prev => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    할인율 (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={optionReq.discountRate ?? 0}
                    onChange={e =>
                      setOptionReq(prev => ({
                        ...prev,
                        discountRate: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  주소 *
                </label>
                <input
                  required
                  value={optionReq.address}
                  onChange={e =>
                    setOptionReq(prev => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder="Olympic-ro 300, Songpa-gu, Seoul"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    슬롯 시작일 *
                  </label>
                  <input
                    type="date"
                    required
                    value={optionReq.slotStartDate}
                    onChange={e =>
                      setOptionReq(prev => ({
                        ...prev,
                        slotStartDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    슬롯 종료일 *
                  </label>
                  <input
                    type="date"
                    required
                    value={optionReq.slotEndDate}
                    onChange={e =>
                      setOptionReq(prev => ({
                        ...prev,
                        slotEndDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    슬롯 시작 시 *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={optionReq.slotStartHour}
                    onChange={e =>
                      setOptionReq(prev => ({
                        ...prev,
                        slotStartHour: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    슬롯 종료 시 *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={optionReq.slotEndHour}
                    onChange={e =>
                      setOptionReq(prev => ({
                        ...prev,
                        slotEndHour: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  정기 휴무일
                </label>
                <select
                  value={optionReq.regularClosingDay ?? ""}
                  onChange={e =>
                    setOptionReq(prev => ({
                      ...prev,
                      regularClosingDay: e.target.value || null,
                    }))
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                >
                  <option value="">없음</option>
                  {DAYS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    할인 시작일시
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      optionReq.discountStartAt
                        ? optionReq.discountStartAt.slice(0, 16)
                        : ""
                    }
                    onChange={e =>
                      setOptionReq(prev => ({
                        ...prev,
                        discountStartAt: e.target.value
                          ? `${e.target.value}:00`
                          : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    할인 종료일시
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      optionReq.discountEndAt
                        ? optionReq.discountEndAt.slice(0, 16)
                        : ""
                    }
                    onChange={e =>
                      setOptionReq(prev => ({
                        ...prev,
                        discountEndAt: e.target.value
                          ? `${e.target.value}:00`
                          : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  예약 안내
                </label>
                <input
                  value={optionReq.bookingGuide ?? ""}
                  onChange={e =>
                    setOptionReq(prev => ({
                      ...prev,
                      bookingGuide: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder="네이버 예약"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  태그 (쉼표 구분)
                </label>
                <input
                  value={optionTagsStr}
                  onChange={e => setOptionTagsStr(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder="hair,makeup"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  이미지 (선택)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e =>
                    setOptionImages(e.target.files ? [...e.target.files] : [])
                  }
                  className="w-full text-sm text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:bg-gray-700 file:text-white"
                />
              </div>
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

          <TabsContent value="product" className="mt-6">
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  상품명 *
                </label>
                <input
                  required
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder="뷰티 올인원 패키지"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  설명 *
                </label>
                <textarea
                  required
                  value={productDescription}
                  onChange={e => setProductDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder="머리와 피부 관리를 진행합니다"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  포함 옵션 (복수 선택) *
                </label>
                <div className="flex flex-wrap gap-2">
                  {options.map(opt => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 px-3 py-2 rounded bg-gray-800 border border-gray-600 cursor-pointer hover:border-pink-500"
                    >
                      <input
                        type="checkbox"
                        checked={productOptionIds.includes(opt.id)}
                        onChange={() => toggleProductOption(opt.id)}
                      />
                      <span className="text-sm">
                        {opt.name} (ID: {opt.id})
                      </span>
                    </label>
                  ))}
                </div>
                {options.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    먼저 옵션을 생성한 뒤 상품에 연결하세요.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  대표 옵션 ID *
                </label>
                <select
                  value={representOptionId}
                  onChange={e =>
                    setRepresentOptionId(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                >
                  <option value="">
                    {productOptionIds.length
                      ? "선택 (미선택 시 첫 옵션)"
                      : "옵션을 먼저 선택하세요"}
                  </option>
                  {options
                    .filter(o => productOptionIds.includes(o.id))
                    .map(o => (
                      <option key={o.id} value={o.id}>
                        {o.name} (ID: {o.id})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  이미지 (선택)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e =>
                    setProductImages(e.target.files ? [...e.target.files] : [])
                  }
                  className="w-full text-sm text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:bg-gray-700 file:text-white"
                />
              </div>
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
        </Tabs>

        <GapY size={24} />
      </div>
    </div>
  );
}
