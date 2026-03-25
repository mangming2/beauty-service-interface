"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  ArrowRightIcon,
  BookmarkIcon,
  HeartIcon,
} from "@/components/common/Icons";
import { GapY } from "@/components/ui/gap";
import { useAnnouncements } from "@/queries/useAnnouncementQueries";
import { truncateAnnouncementPreview } from "@/lib/utils";

function formatLikeCount(count: number): string {
  return count >= 1000 ? "999+" : String(count);
}

export function LatestAnnouncementPosts() {
  const { data, isLoading, isError } = useAnnouncements({ size: 3 });

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="title-md text-white">DOKI Community</h2>
          <span className="text-gray_1 caption-md">...</span>
        </div>
        <GapY size={8} />
        <div className="flex items-center justify-center py-8 rounded-xl bg-[#2E3033]">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500" />
        </div>
      </div>
    );
  }

  const posts = data?.posts ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="title-md text-white">DOKI Community</h2>
        <Link
          href="/board"
          className="text-gray_1 caption-md flex items-center gap-[4px]"
        >
          more
          <ArrowRightIcon
            color="#BCBCBC"
            width={3}
            height={7}
            className="size-auto"
          />
        </Link>
      </div>
      <GapY size={8} />
      {isError ? (
        <p className="text-gray_1 caption-md py-3 rounded-xl bg-[#2E3033] px-4">
          게시글을 불러올 수 없습니다.
        </p>
      ) : posts.length === 0 ? (
        <p className="text-gray_1 caption-md py-3 rounded-xl bg-[#2E3033] px-4">
          게시글이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map(post => {
            const preview = truncateAnnouncementPreview(post.content, 72);
            return (
            <Link
              key={post.postId}
              href={`/board/notice/${post.postId}`}
              className="block bg-gray-container p-3"
            >
              {/* 상단: 작성자 + 날짜 */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex-shrink-0 bg-black overflow-hidden relative">
                    <Image
                      src="/main-icon.png"
                      alt=""
                      width={20}
                      height={20}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <span className="text-gray-2 text-sm">DOKI 담당자</span>
                </div>
                <span className="text-disabled caption-sm">
                  {format(new Date(post.createdAt), "yy.MM.dd HH:mm")}
                </span>
              </div>
              {/* 제목 */}
              <h3 className="text-white text-md mb-1 truncate">{post.title}</h3>
              {preview ? (
                <p className="text-gray_1 text-sm mb-1 line-clamp-2">
                  {preview}
                </p>
              ) : null}
              {/* 하단: 태그 + 좋아요/댓글 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {/* {post.tags?.[0] ? (
                    <span className="px-2 py-0.5 bg-gray-outline text-gray-font caption-sm truncate max-w-[120px]">
                      {post.tags[0]}
                    </span>
                  ) : null} */}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="flex items-center gap-1 text-disabled text-sm">
                    <HeartIcon color="#ff60b3" className="w-4 h-4" />
                    {formatLikeCount(post.viewCount)}
                  </span>
                  <span className="flex items-center gap-1 text-disabled text-sm">
                    <BookmarkIcon color="#ABA9A9" className="w-4 h-4" />
                    {post.viewCount}
                  </span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
