"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  SearchIcon,
  HeartIcon,
  BookmarkIcon,
  ChatBubbleIcon,
} from "@/components/common/Icons";
import { useInfiniteCommunityPosts } from "@/queries/useCommunityQueries";
import type { CommunityPostListItem } from "@/api/community";

function formatCount(count: number): string {
  return count >= 999 ? "999+" : count.toString();
}

function CommunityPostCard({ post }: { post: CommunityPostListItem }) {
  const firstTag = post.tags?.[0];
  const dateStr = format(new Date(post.createdAt), "yy.MM.dd HH:mm");

  return (
    <Link
      href={`/board/community/${post.postId}`}
      className="block py-4 border-b border-gray-outline"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-block px-2 py-0.5 rounded border border-gray-outline caption-md text-gray_1">
          커뮤니티
        </span>
        {firstTag && (
          <span className="inline-block px-2 py-0.5 rounded border border-gray-outline caption-md text-gray_1">
            {firstTag}
          </span>
        )}
      </div>
      <p className="text-md text-white font-semibold line-clamp-1">
        {post.title}
      </p>
      <p className="caption-md text-gray_1 mt-0.5 line-clamp-2">
        {post.previewContent}
      </p>
      <div className="flex items-center justify-between mt-2">
        <p className="caption-md text-gray_1">
          {post.authorDisplayName}
          {"  "}|{"  "}
          {dateStr}
        </p>
        <div className="flex items-center gap-3">
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
      </div>
    </Link>
  );
}

export default function BoardSearchPage() {
  const [searchText, setSearchText] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteCommunityPosts(
      { query: debouncedQuery, size: 20 },
      { enabled: !!debouncedQuery }
    );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  function handleChange(value: string) {
    setSearchText(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(value), 300);
  }

  const posts = data?.pages.flatMap(p => p.posts) ?? [];

  return (
    <div className="min-h-screen text-white px-5 pt-4 pb-5">
      <div className="flex items-center gap-2 rounded-xl bg-[#2E3033] border border-[#3E4043] px-3 py-2.5">
        <input
          type="search"
          placeholder="커뮤니티 검색..."
          value={searchText}
          onChange={e => handleChange(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder:text-gray-400 text-md outline-none min-w-0"
          autoFocus
        />
        <SearchIcon color="#9CA3AF" />
      </div>

      <div className="mt-6">
        {/* TODO: 공지글 검색 추가 예정 (GET /boards/announcements에 query 파라미터 지원 시) */}

        {!debouncedQuery ? null : isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex justify-center py-16">
            <p className="text-gray-400">검색 결과가 없습니다</p>
          </div>
        ) : (
          <div>
            {posts.map(post => (
              <CommunityPostCard key={post.postId} post={post} />
            ))}
            <div ref={bottomRef} className="h-4" />
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
