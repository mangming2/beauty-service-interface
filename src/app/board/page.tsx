"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowRightIcon,
  HeartIcon,
  BookmarkIcon,
  ChatBubbleIcon,
  EditIcon,
} from "@/components/common/Icons";
import { TranslatedText } from "@/components/main/TranslatedText";
import { useAnnouncements } from "@/queries/useAnnouncementQueries";
import {
  usePopularPosts,
  useInfiniteCommunityPosts,
} from "@/queries/useCommunityQueries";
import { GapY } from "../../components/ui/gap";
import { truncateAnnouncementPreview } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import type { CommunityPostListItem } from "@/api/community";

const TAB_NOTICE = "notice";
const TAB_COMMUNITY = "community";

const COMMUNITY_CATEGORIES = [
  { id: "hot", label: "communityPage.hot", isHot: true },
  { id: "Recruiting", label: "communityPage.recruiting", isHot: false },
  { id: "K-pop News", label: "communityPage.kpopNews", isHot: false },
  { id: "K-Beauty", label: "communityPage.kbeauty", isHot: false },
] as const;

type CategoryId = (typeof COMMUNITY_CATEGORIES)[number]["id"];

function formatCount(count: number): string {
  return count >= 999 ? "999+" : count.toString();
}

function PostCard({ post }: { post: CommunityPostListItem }) {
  const firstTag = post.tags?.[0];
  const dateStr = format(new Date(post.createdAt), "yy.MM.dd");

  return (
    <Link href={`/board/community/${post.postId}`} className="block">
      <li className="py-4 border-b border-gray-outline">
        {firstTag && (
          <span className="inline-block px-2 py-0.5 rounded border border-gray-outline bg-gray-outline caption-md text-gray_1 mb-2">
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

function HotCommunityTab() {
  const { t } = useTranslation();
  const { data: posts, isLoading } = usePopularPosts(20);

  if (isLoading) {
    return (
      <li className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </li>
    );
  }

  if (!posts?.length) {
    return (
      <li className="py-8 text-center text-gray_1 caption-md">
        {t("boardPage.noPosts")}
      </li>
    );
  }

  return (
    <>
      {posts.map(post => (
        <PostCard key={post.postId} post={post} />
      ))}
    </>
  );
}

function TaggedCommunityTab({ tag }: { tag: string }) {
  const { t } = useTranslation();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteCommunityPosts({ tag, size: 20 });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useCallback(
    (node: HTMLLIElement | null) => {
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

  if (isLoading) {
    return (
      <li className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </li>
    );
  }

  const posts = data?.pages.flatMap(p => p.posts) ?? [];

  if (!posts.length) {
    return (
      <li className="py-8 text-center text-gray_1 caption-md">
        {t("boardPage.noPosts")}
      </li>
    );
  }

  return (
    <>
      {posts.map(post => (
        <PostCard key={post.postId} post={post} />
      ))}
      <li ref={bottomRef} className="h-4" />
      {isFetchingNextPage && (
        <li className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500" />
        </li>
      )}
    </>
  );
}

function CommunityTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryId>("hot");
  const activeCat = COMMUNITY_CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <div className="relative">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-5 px-5">
        {COMMUNITY_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-white text-background"
                : "bg-gray-container text-gray_1"
            }`}
          >
            {cat.isHot && <span>🔥</span>}
            {t(cat.label)}
          </button>
        ))}
      </div>

      <GapY size={16} />

      {/* Posts */}
      <ul className="divide-y divide-transparent">
        {activeCat.isHot ? (
          <HotCommunityTab />
        ) : (
          <TaggedCommunityTab tag={activeCategory} />
        )}
      </ul>

      {/* FAB - write post button */}
      <button
        onClick={() => router.push("/board/community/write")}
        className="fixed bottom-[80px] w-14 h-14 rounded-full bg-pink-font flex items-center justify-center shadow-lg z-10"
        style={{ right: "max(16px, calc(50vw - 190px))" }}
        aria-label={t("communityPage.writePost")}
      >
        <EditIcon color="white" width={22} height={22} />
      </button>
    </div>
  );
}

function BoardContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const tab =
    searchParams.get("tab") === TAB_COMMUNITY ? TAB_COMMUNITY : TAB_NOTICE;

  const { data: noticeData, isLoading: noticeLoading } = useAnnouncements({
    size: 50,
  });

  const noticePosts = noticeData?.posts ?? [];

  return (
    <div className="px-5">
      <div className="pt-6 border-b border-gray-outline">
        <nav className="flex gap-6">
          <Link
            href="/board"
            className={`relative title-sm flex-initial pb-3 pt-0 px-0 rounded-none transition-colors duration-200 after:absolute after:left-0 after:right-0 after:h-px after:bottom-0 after:bg-gray-outline ${
              tab === TAB_NOTICE
                ? "text-pink-font after:bg-pink-font"
                : "text-gray-400 hover:text-white after:bg-gray-outline"
            }`}
          >
            <span className="relative z-[1]">
              <TranslatedText translationKey="notice" />
            </span>
          </Link>
          <Link
            href="/board?tab=community"
            className={`relative title-sm flex-initial pb-3 pt-0 px-0 rounded-none transition-colors duration-200 after:absolute after:left-0 after:right-0 after:h-px after:bottom-0 after:bg-gray-outline ${
              tab === TAB_COMMUNITY
                ? "text-pink-font after:bg-pink-font"
                : "text-gray-400 hover:text-white after:bg-gray-outline"
            }`}
          >
            <span className="relative z-[1]">
              <TranslatedText translationKey="community" />
            </span>
          </Link>
        </nav>
      </div>

      <GapY size={24} />

      {tab === TAB_NOTICE && (
        <div className="relative w-full aspect-[3/1] overflow-hidden rounded">
          <Image
            src="/notice.png"
            alt={t("boardPage.noticeAlt")}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {tab === TAB_NOTICE && (
        <ul className="divide-y divide-gray-outline">
          {noticeLoading ? (
            <li className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
            </li>
          ) : noticePosts.length === 0 ? (
            <li className="py-8 text-center text-gray_1 caption-md">
              {t("boardPage.noNotices")}
            </li>
          ) : (
            noticePosts.map(post => {
              const preview = truncateAnnouncementPreview(post.content, 90);
              return (
                <li key={post.postId}>
                  <Link
                    href={`/board/notice/${post.postId}`}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-md text-white truncate">
                        {post.title}
                      </p>
                      {preview ? (
                        <p className="caption-md text-gray_1 mt-0.5 line-clamp-2">
                          {preview}
                        </p>
                      ) : null}
                      <p className="caption-md text-gray_1 mt-0.5">
                        {format(
                          new Date(post.announcementDate || post.createdAt),
                          "yy.MM.dd"
                        )}
                        {" · "}
                        {t("boardPage.viewCount")} {post.viewCount}
                      </p>
                    </div>
                    <ArrowRightIcon
                      color="#FFFFFE"
                      width={6}
                      height={16}
                      className="size-auto shrink-0 ml-2"
                    />
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      )}

      {tab === TAB_COMMUNITY && <CommunityTab />}
    </div>
  );
}

export default function BoardPage() {
  return (
    <Suspense
      fallback={
        <div className="px-5 py-12 flex justify-center text-gray-400">
          <TranslatedText translationKey="common.loading" />
        </div>
      }
    >
      <BoardContent />
    </Suspense>
  );
}
