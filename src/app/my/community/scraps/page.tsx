"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleIcon,
} from "@/components/common/Icons";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "@/hooks/useTranslation";
import { useMyScraps } from "@/queries/useCommunityQueries";
import type { CommunityPostListItem } from "@/api/community";

function formatCount(count: number): string {
  return count >= 999 ? "999+" : count.toString();
}

function ScrapCard({ post }: { post: CommunityPostListItem }) {
  const firstTag = post.tags?.[0];
  const dateStr = format(new Date(post.createdAt), "yy.MM.dd");

  return (
    <Link href={`/board/community/${post.postId}`} className="block">
      <li className="py-4 border-b border-gray-outline">
        {firstTag && (
          <span className="inline-block px-2 py-0.5 rounded border border-gray-outline caption-md text-gray_1 mb-2">
            {firstTag}
          </span>
        )}
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
      </li>
    </Link>
  );
}

export default function MyScrapsPage() {
  const { t } = useTranslation();
  const { data: scraps, isLoading } = useMyScraps();

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-4 pt-6 pb-3">
        <h1 className="title-md font-semibold">{t("communityPage.myScraps")}</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-8 h-8 text-white" />
        </div>
      ) : !scraps?.length ? (
        <p className="caption-md text-gray_1 text-center py-16 px-4">
          {t("communityPage.noScraps")}
        </p>
      ) : (
        <ul className="px-4">
          {scraps.map(post => (
            <ScrapCard key={post.postId} post={post} />
          ))}
        </ul>
      )}
    </div>
  );
}
