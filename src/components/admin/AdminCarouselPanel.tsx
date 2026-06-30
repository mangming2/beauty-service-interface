"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ApiError } from "@/lib/apiClient";
import {
  useAdminCarousels,
  useCreateLandingCarousel,
  useUpdateLandingCarousel,
  useUpdateCarouselHashtag,
  useCreateCommunityCarousel,
  useUpdateCommunityCarousel,
  useDeleteCarousel,
} from "@/queries/useCarouselQueries";
import { useProducts } from "@/queries/useProductQueries";
import { useAnnouncements } from "@/queries/useAnnouncementQueries";
import { getSafeImageSrc } from "@/lib/utils";
import type {
  AdminCarouselItem,
  LandingCarouselRequest,
  CarouselLinkType,
} from "@/api/carousel";

function LinkPicker({
  linkType,
  value,
  onChange,
}: {
  linkType: CarouselLinkType;
  value: string;
  onChange: (id: string) => void;
}) {
  const { data: productData, isLoading: productLoading } = useProducts({
    size: 200,
  });
  const { data: announcementData, isLoading: announcementLoading } =
    useAnnouncements({ size: 200 });

  if (linkType === "PRODUCT") {
    const products = productData ?? [];
    return (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white text-sm"
      >
        <option value="">-- 상품 선택 --</option>
        {productLoading && <option disabled>불러오는 중...</option>}
        {products.map(p => (
          <option key={p.id} value={String(p.id)}>
            {p.name} (ID: {p.id})
          </option>
        ))}
      </select>
    );
  }

  const announcements = announcementData?.posts ?? [];
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      required
      className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white text-sm"
    >
      <option value="">-- 공지 선택 --</option>
      {announcementLoading && <option disabled>불러오는 중...</option>}
      {announcements.map(a => (
        <option key={a.postId} value={String(a.postId)}>
          {a.title} (ID: {a.postId})
        </option>
      ))}
    </select>
  );
}

function carouselErrMsg(error: unknown): string {
  const e = error as ApiError | undefined;
  if (e?.status === 403) return "관리자 권한이 필요합니다.";
  if (e?.status === 404) return "캐러셀을 찾을 수 없습니다.";
  return e?.message ?? "요청에 실패했습니다.";
}

// ========== 랜딩 캐러셀 패널 ==========

function LandingCarouselPanel() {
  const { data: items = [], isLoading } = useAdminCarousels("LANDING");
  const createMutation = useCreateLandingCarousel();
  const updateMutation = useUpdateLandingCarousel();
  const hashtagMutation = useUpdateCarouselHashtag();
  const deleteMutation = useDeleteCarousel();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [linkType, setLinkType] = useState<CarouselLinkType>("PRODUCT");
  const [linkId, setLinkId] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const [hashtagDialogOpen, setHashtagDialogOpen] = useState(false);
  const [hashtagTargetId, setHashtagTargetId] = useState<number | null>(null);
  const [hashtagInput, setHashtagInput] = useState("");

  const openCreate = () => {
    setEditingId(null);
    setLinkType("PRODUCT");
    setLinkId("");
    setHashtag("");
    setSortOrder("0");
    setIsActive(true);
    setDialogOpen(true);
  };

  const openEdit = (item: AdminCarouselItem) => {
    setEditingId(item.id);
    setLinkType(item.linkType ?? "PRODUCT");
    setLinkId(String(item.linkId ?? ""));
    setHashtag(item.hashtag ?? "");
    setSortOrder(String(item.sortOrder ?? 0));
    setIsActive(item.isActive);
    setDialogOpen(true);
  };

  const openHashtagEdit = (item: AdminCarouselItem) => {
    setHashtagTargetId(item.id);
    setHashtagInput(item.hashtag ?? "");
    setHashtagDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request: LandingCarouselRequest = {
      linkType,
      linkId: Number(linkId),
      hashtag,
      sortOrder: Number(sortOrder),
      isActive,
    };
    if (editingId === null) {
      createMutation.mutate(request, { onSuccess: () => setDialogOpen(false) });
    } else {
      updateMutation.mutate(
        { id: editingId, request },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  };

  const handleHashtagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hashtagTargetId === null) return;
    hashtagMutation.mutate(
      { id: hashtagTargetId, hashtag: hashtagInput },
      { onSuccess: () => setHashtagDialogOpen(false) }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("이 캐러셀을 삭제할까요?")) return;
    deleteMutation.mutate(id);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">랜딩 페이지 캐러셀 관리</p>
        <Button type="button" size="sm" onClick={openCreate}>
          캐러셀 추가
        </Button>
      </div>

      {isLoading ? (
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-sm">등록된 캐러셀이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="flex gap-3 items-start rounded-lg border border-gray-600 p-3 bg-gray-800/30"
            >
              <div className="relative w-20 h-14 rounded overflow-hidden shrink-0 bg-gray-900">
                <Image
                  src={getSafeImageSrc(item.imageUrl)}
                  alt={item.hashtag ?? ""}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">
                  {item.hashtag ?? "-"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.linkType} → ID {item.linkId}
                </p>
                <p
                  className={`text-xs mt-0.5 font-medium ${item.isActive ? "text-green-400" : "text-gray-500"}`}
                >
                  {item.isActive ? "● 활성" : "○ 비활성"}
                </p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => openEdit(item)}
                >
                  수정
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => openHashtagEdit(item)}
                >
                  해시태그
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7 text-xs text-red-300"
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteMutation.isPending}
                >
                  삭제
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 생성/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-md text-white border-gray-600 bg-[#1a1c20]">
          <DialogHeader>
            <DialogTitle>
              {editingId === null ? "랜딩 캐러셀 추가" : "랜딩 캐러셀 수정"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                링크 타입 *
              </label>
              <select
                value={linkType}
                onChange={e => {
                  setLinkType(e.target.value as CarouselLinkType);
                  setLinkId("");
                }}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white text-sm"
              >
                <option value="PRODUCT">상품 (PRODUCT)</option>
                <option value="ANNOUNCEMENT">공지 (ANNOUNCEMENT)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                {linkType === "PRODUCT" ? "상품 선택 *" : "공지 선택 *"}
              </label>
              <LinkPicker
                linkType={linkType}
                value={linkId}
                onChange={id => setLinkId(id)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                해시태그
              </label>
              <input
                value={hashtag}
                onChange={e => setHashtag(e.target.value)}
                placeholder="#beauty"
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white text-sm"
              />
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">
                  정렬 순서 (낮을수록 우선)
                </label>
                <input
                  type="number"
                  min={0}
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white text-sm"
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="landing-isActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-pink-500"
                />
                <label
                  htmlFor="landing-isActive"
                  className="text-sm text-gray-300"
                >
                  활성화
                </label>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDialogOpen(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
            {(createMutation.isError || updateMutation.isError) && (
              <p className="text-red-400 text-xs">
                {carouselErrMsg(createMutation.error ?? updateMutation.error)}
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* 해시태그 빠른 수정 다이얼로그 */}
      <Dialog open={hashtagDialogOpen} onOpenChange={setHashtagDialogOpen}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-sm text-white border-gray-600 bg-[#1a1c20]">
          <DialogHeader>
            <DialogTitle>해시태그 수정</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleHashtagSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                해시태그
              </label>
              <input
                value={hashtagInput}
                onChange={e => setHashtagInput(e.target.value)}
                placeholder="#beauty"
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white text-sm"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setHashtagDialogOpen(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={hashtagMutation.isPending}>
                {hashtagMutation.isPending ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
            {hashtagMutation.isError && (
              <p className="text-red-400 text-xs">
                {carouselErrMsg(hashtagMutation.error)}
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ========== 커뮤니티 캐러셀 패널 ==========

function CommunityCarouselPanel() {
  const { data: items = [], isLoading } = useAdminCarousels("COMMUNITY");
  const createMutation = useCreateCommunityCarousel();
  const updateMutation = useUpdateCommunityCarousel();
  const deleteMutation = useDeleteCarousel();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<AdminCarouselItem | null>(
    null
  );
  const [image, setImage] = useState<File | null>(null);
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const openCreate = () => {
    setEditingId(null);
    setEditingItem(null);
    setImage(null);
    setSortOrder("0");
    setIsActive(true);
    setDialogOpen(true);
  };

  const openEdit = (item: AdminCarouselItem) => {
    setEditingId(item.id);
    setEditingItem(item);
    setImage(null);
    setSortOrder(String(item.sortOrder ?? 0));
    setIsActive(item.isActive);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dto = { sortOrder: Number(sortOrder), isActive };
    if (editingId === null) {
      if (!image) return;
      createMutation.mutate(
        { image, dto },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      updateMutation.mutate(
        { id: editingId, dto, image: image ?? undefined },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("이 배너를 삭제할까요?")) return;
    deleteMutation.mutate(id);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">커뮤니티 페이지 배너 관리</p>
        <Button type="button" size="sm" onClick={openCreate}>
          배너 추가
        </Button>
      </div>

      {isLoading ? (
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-sm">등록된 배너가 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="flex gap-3 items-center rounded-lg border border-gray-600 p-3 bg-gray-800/30"
            >
              <div className="relative w-24 h-8 rounded overflow-hidden shrink-0 bg-gray-900">
                <Image
                  src={getSafeImageSrc(item.imageUrl)}
                  alt="커뮤니티 배너"
                  fill
                  className="object-cover"
                  sizes="96px"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-medium ${item.isActive ? "text-green-400" : "text-gray-500"}`}
                >
                  {item.isActive ? "● 활성" : "○ 비활성"}
                </p>
                <p className="text-xs text-gray-500">
                  순서 {item.sortOrder ?? 0}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => openEdit(item)}
                >
                  수정
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7 text-xs text-red-300"
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteMutation.isPending}
                >
                  삭제
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-md text-white border-gray-600 bg-[#1a1c20]">
          <DialogHeader>
            <DialogTitle>
              {editingId === null ? "커뮤니티 배너 추가" : "커뮤니티 배너 수정"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            {editingItem && (
              <div className="relative w-full aspect-[3/1] rounded overflow-hidden bg-gray-900">
                <Image
                  src={getSafeImageSrc(editingItem.imageUrl)}
                  alt="현재 이미지"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  unoptimized
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                이미지 파일 {editingId === null ? "*" : "(교체 시 선택)"}
              </label>
              {editingId !== null && (
                <p className="text-xs text-gray-500 mb-1">
                  파일을 선택하지 않으면 기존 이미지가 유지됩니다.
                </p>
              )}
              <input
                type="file"
                accept="image/*"
                required={editingId === null}
                onChange={e => setImage(e.target.files?.[0] ?? null)}
                className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:bg-gray-700 file:text-white file:border-0"
              />
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">
                  정렬 순서 (낮을수록 우선)
                </label>
                <input
                  type="number"
                  min={0}
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white text-sm"
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="community-isActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-pink-500"
                />
                <label
                  htmlFor="community-isActive"
                  className="text-sm text-gray-300"
                >
                  활성화
                </label>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDialogOpen(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
            {(createMutation.isError || updateMutation.isError) && (
              <p className="text-red-400 text-xs">
                {carouselErrMsg(createMutation.error ?? updateMutation.error)}
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ========== 통합 어드민 캐러셀 패널 ==========

export function AdminCarouselPanel() {
  return (
    <div className="space-y-2">
      <Tabs defaultValue="landing">
        <TabsList className="bg-gray-800 border border-gray-600">
          <TabsTrigger
            value="landing"
            className="text-xs data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
          >
            랜딩 캐러셀
          </TabsTrigger>
          <TabsTrigger
            value="community"
            className="text-xs data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
          >
            커뮤니티 배너
          </TabsTrigger>
        </TabsList>
        <TabsContent value="landing" className="mt-4">
          <LandingCarouselPanel />
        </TabsContent>
        <TabsContent value="community" className="mt-4">
          <CommunityCarouselPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
