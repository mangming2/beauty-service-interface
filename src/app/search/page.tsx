"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  SearchIcon,
  HeartIcon,
  BookmarkIcon,
  ChatBubbleIcon,
} from "@/components/common/Icons";
import { useInfiniteProducts } from "@/queries/useProductQueries";
import { useInfiniteCommunityPosts } from "@/queries/useCommunityQueries";
import { useAnnouncements } from "@/queries/useAnnouncementQueries";
import { TrendCard } from "@/components/main/TrendCard";
import { Divider } from "@/components/ui/divider";
import { PageLoading } from "@/components/common";
import type { Product } from "@/api/product";
import type { CommunityPostListItem } from "@/api/community";
import type { AnnouncementPostListItem } from "@/api/announcement";
import { useTranslation } from "@/hooks/useTranslation";
import { gtag } from "@/lib/gtag";

type View = null | "packages" | "community";

const PAGE_SIZE = 50;
const PREVIEW_COUNT = 3;

function filterProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  const lower = query.trim().toLowerCase();
  return products.filter(
    p =>
      p.name.toLowerCase().includes(lower) ||
      (p.description && p.description.toLowerCase().includes(lower))
  );
}

function filterAnnouncements(
  posts: AnnouncementPostListItem[],
  query: string
): AnnouncementPostListItem[] {
  if (!query.trim()) return posts;
  const lower = query.trim().toLowerCase();
  return posts.filter(
    p =>
      p.title.toLowerCase().includes(lower) ||
      (p.content && p.content.toLowerCase().includes(lower))
  );
}

function formatCount(n: number) {
  return n >= 999 ? "999+" : n.toString();
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="relative w-48 h-48 mb-6">
        <Image src="/empty.png" alt="empty" fill className="object-contain" />
      </div>
      <p className="text-white text-lg font-semibold">This content is empty.</p>
      <p className="text-gray_1 caption-md mt-2">
        The content has been deleted or moved
        <br />
        and can&apos;t be found.
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-pink-500" />
    </div>
  );
}

function SectionHeader({
  title,
  onMore,
}: {
  title: string;
  onMore: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="title-sm text-white font-semibold">{title}</h2>
      <button
        onClick={onMore}
        className="flex items-center gap-0.5 caption-md text-gray_1"
      >
        more <span className="text-xs">›</span>
      </button>
    </div>
  );
}

function AnnouncementCard({ post }: { post: AnnouncementPostListItem }) {
  const dateStr = format(new Date(post.createdAt), "yy.MM.dd HH:mm");
  return (
    <Link
      href={`/board/notice/${post.postId}`}
      className="block py-4 border-b border-gray-outline"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="inline-block px-2 py-0.5 rounded border border-gray-outline caption-md text-gray_1">
          공지
        </span>
        <span className="caption-md text-gray_1">{dateStr}</span>
      </div>
      <p className="text-md text-white font-semibold line-clamp-1 mt-1">
        {post.title}
      </p>
      {post.content && (
        <p className="caption-md text-gray_1 mt-0.5 line-clamp-2">
          {post.content}
        </p>
      )}
    </Link>
  );
}

function CommunityPostCard({ post }: { post: CommunityPostListItem }) {
  const firstTag = post.tags?.[0];
  const dateStr = format(new Date(post.createdAt), "yy.MM.dd HH:mm");
  return (
    <Link
      href={`/board/community/${post.postId}`}
      className="block py-4 border-b border-gray-outline"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 rounded border border-gray-outline caption-md text-gray_1">
            커뮤니티
          </span>
          {firstTag && (
            <span className="inline-block px-2 py-0.5 rounded border border-gray-outline caption-md text-gray_1">
              {firstTag}
            </span>
          )}
        </div>
        <span className="caption-md text-gray_1">{dateStr}</span>
      </div>
      <p className="text-md text-white font-semibold line-clamp-1 mt-1">
        {post.title}
      </p>
      <p className="caption-md text-gray_1 mt-0.5 line-clamp-2">
        {post.previewContent}
      </p>
      <div className="flex items-center gap-3 mt-2">
        <span className="flex items-center gap-1 caption-md text-gray_1">
          <HeartIcon width={12} height={12} color="#f92595" />
          {formatCount(post.likeCount)}
        </span>
        <span className="flex items-center gap-1 caption-md text-gray_1">
          <BookmarkIcon width={9} height={11} color="#bcbcbc" />
          {formatCount(post.bookmarkCount)}
        </span>
        <span className="flex items-center gap-1 caption-md text-gray_1">
          <ChatBubbleIcon width={12} height={12} color="#bcbcbc" />
          {formatCount(post.commentCount)}
        </span>
      </div>
    </Link>
  );
}

export default function SearchPage() {
  const [searchText, setSearchText] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [view, setView] = useState<View>(null);
  const { t } = useTranslation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 패키지: 전체 로드 후 클라이언트 필터
  const {
    data: productData,
    isLoading: productLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({ size: PAGE_SIZE });

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allProducts = useMemo(
    () => (productData?.pages ?? []).flat(),
    [productData?.pages]
  );
  const filteredProducts = useMemo(
    () => filterProducts(allProducts, searchText),
    [allProducts, searchText]
  );

  // 공지글: 전체 로드 후 클라이언트 필터
  const { data: announcementData } = useAnnouncements({ size: 100 });
  const filteredAnnouncements = useMemo(
    () => filterAnnouncements(announcementData?.posts ?? [], searchText),
    [announcementData?.posts, searchText]
  );

  // 커뮤니티: 서버 검색 (debounce)
  const {
    data: communityData,
    isLoading: communityLoading,
    isFetchingNextPage: isFetchingNextCommunity,
    hasNextPage: hasNextCommunity,
    fetchNextPage: fetchNextCommunity,
  } = useInfiniteCommunityPosts(
    { query: debouncedQuery, size: 20 },
    { enabled: !!debouncedQuery }
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;
      observerRef.current = new IntersectionObserver(entries => {
        if (
          entries[0].isIntersecting &&
          hasNextCommunity &&
          !isFetchingNextCommunity
        )
          fetchNextCommunity();
      });
      observerRef.current.observe(node);
    },
    [hasNextCommunity, isFetchingNextCommunity, fetchNextCommunity]
  );

  function handleSearch(value: string) {
    setSearchText(value);
    setView(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(value);
      if (value.trim()) gtag.searchPerformed(value.trim());
    }, 300);
  }

  const communityPosts = communityData?.pages.flatMap(p => p.posts) ?? [];

  // DOKI BUZZ 더보기: 공지 + 커뮤니티 합산
  const buzTotal = filteredAnnouncements.length + communityPosts.length;

  if (productLoading) {
    return <PageLoading message={t("search.loadingProducts")} />;
  }

  const hasNoResults =
    !!debouncedQuery &&
    filteredProducts.length === 0 &&
    !communityLoading &&
    filteredAnnouncements.length === 0 &&
    communityPosts.length === 0;

  return (
    <div className="min-h-screen text-white">
      {/* 검색 바 */}
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center gap-2 rounded-xl bg-[#2E3033] border border-[#3E4043] px-3 py-2.5">
          <input
            type="text"
            placeholder={t("search.searchPlaceholder")}
            value={searchText}
            onChange={e => handleSearch(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-white placeholder:text-gray-400 text-md outline-none min-w-0"
            aria-label={t("common.search")}
          />

          <SearchIcon color="#9CA3AF" />
        </div>
      </div>

      {/* 패키지 더보기 뷰 */}
      {view === "packages" && (
        <div className="px-5 pb-5">
          {filteredProducts.length === 0 ? (
            <EmptyState />
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
                      "/dummy-logo.png"
                    }
                  />
                  {index < array.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DOKI BUZZ 더보기 뷰: 공지 + 커뮤니티 */}
      {view === "community" && (
        <div className="px-5 pb-5">
          {communityLoading ? (
            <Spinner />
          ) : buzTotal === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {filteredAnnouncements.map(post => (
                <AnnouncementCard key={`a-${post.postId}`} post={post} />
              ))}
              {communityPosts.map(post => (
                <CommunityPostCard key={`c-${post.postId}`} post={post} />
              ))}
              <div ref={bottomRef} className="h-4" />
              {isFetchingNextCommunity && <Spinner />}
            </div>
          )}
        </div>
      )}

      {/* 메인 검색 뷰 */}
      {view === null && (
        <div className="pb-5">
          {hasNoResults ? (
            <EmptyState />
          ) : (
            <>
              {/* Debut Packages 섹션 */}
              {filteredProducts.length > 0 && (
                <section className="px-5 mb-8">
                  <SectionHeader
                    title="Debut Packages"
                    onMore={() => setView("packages")}
                  />
                  <div className="flex flex-col">
                    {filteredProducts
                      .slice(0, PREVIEW_COUNT)
                      .map((product, index, array) => (
                        <div key={product.id}>
                          <TrendCard
                            id={String(product.id)}
                            title={product.name}
                            location={product.representOption?.location ?? "-"}
                            description={product.description ?? ""}
                            imageSrc={
                              product.imageUrls?.[0] ??
                              product.representOption?.imageUrls?.[0] ??
                              "/dummy-logo.png"
                            }
                          />
                          {index < array.length - 1 && <Divider />}
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* DOKI BUZZ 섹션: 공지 + 커뮤니티 */}
              {debouncedQuery && (
                <section className="px-5">
                  <SectionHeader
                    title="DOKI BUZZ"
                    onMore={() => setView("community")}
                  />
                  {communityLoading ? (
                    <Spinner />
                  ) : (
                    <div>
                      {filteredAnnouncements
                        .slice(0, PREVIEW_COUNT)
                        .map(post => (
                          <AnnouncementCard
                            key={`a-${post.postId}`}
                            post={post}
                          />
                        ))}
                      {communityPosts
                        .slice(
                          0,
                          Math.max(
                            0,
                            PREVIEW_COUNT -
                              filteredAnnouncements.slice(0, PREVIEW_COUNT)
                                .length
                          )
                        )
                        .map(post => (
                          <CommunityPostCard
                            key={`c-${post.postId}`}
                            post={post}
                          />
                        ))}
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
