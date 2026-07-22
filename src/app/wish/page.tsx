"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { PageLoading } from "@/components/common";
import { useWishes, useToggleWish } from "@/queries/useWishQueries";
import { useMyPageUser } from "@/queries/useMyPageQueries";
import { useMyBookmarkedCommunityPosts } from "@/queries/useMyPageQueries";
import { useEffect } from "react";
import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleIcon,
} from "@/components/common/Icons";
import { useTranslation } from "@/hooks/useTranslation";
import { useProducts } from "@/queries/useProductQueries";
import RecommendationGallery from "@/components/main/RecommendationGallery";
import type { Product } from "@/api/product";
import type { CommunityPostListItem } from "@/api/community";

type Tab = "wish" | "bookmark";

function formatCount(n: number) {
  return n >= 999 ? "999+" : n.toString();
}

function BookmarkPostCard({ post }: { post: CommunityPostListItem }) {
  const firstTag = post.tags?.[0];
  const dateStr = format(new Date(post.createdAt), "yy.MM.dd");
  return (
    <Link
      href={`/board/community/${post.postId}`}
      className="block py-4 border-b border-gray-outline px-5"
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

export default function Wish() {
  const router = useRouter();
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("wish");

  const { data: myPageUser, isLoading: userLoading } = useMyPageUser();
  const { data: wishes = [], isLoading: wishesLoading } = useWishes();
  const { data: allProducts = [], isLoading: productsLoading } = useProducts({
    size: 100,
  });
  const { data: bookmarks = [], isLoading: bookmarksLoading } =
    useMyBookmarkedCommunityPosts();
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
      {/* 탭 */}
      <div className="flex items-center gap-[17px] px-5 py-6">
        <button
          onClick={() => setTab("wish")}
          className={`text-2xl leading-[130%] transition-colors ${
            tab === "wish"
              ? "text-pink-font font-bold"
              : "text-gray_1 font-medium"
          }`}
        >
          Wish
        </button>
        <button
          onClick={() => setTab("bookmark")}
          className={`text-2xl leading-[130%] transition-colors ${
            tab === "bookmark"
              ? "text-pink-font font-bold"
              : "text-gray_1 font-medium"
          }`}
        >
          Bookmark
        </button>
      </div>

      {/* Wish 탭 */}
      {tab === "wish" && (
        <>
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
                                "/dummy-logo.png",
                                "/dummy-logo.png",
                                "/dummy-logo.png",
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
                          discountRate:
                            product?.representOption?.discountRate ?? 0,
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
            </>
          )}
        </>
      )}

      {/* Bookmark 탭 */}
      {tab === "bookmark" && (
        <>
          {bookmarksLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-pink-500" />
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 pb-20">
              <Image src="/empty.png" alt="empty" width={180} height={120} />
              <p className="title-md text-white">북마크한 글이 없어요</p>
              <p className="text-md text-gray-font text-center">
                커뮤니티 글을 북마크해보세요
              </p>
            </div>
          ) : (
            <div>
              {bookmarks.map(post => (
                <BookmarkPostCard key={post.postId} post={post} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
