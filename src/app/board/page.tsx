"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowRightIcon } from "@/components/common/Icons";
import { TranslatedText } from "@/components/main/TranslatedText";
import { useAnnouncements } from "@/queries/useAnnouncementQueries";
import { useCommunityPosts } from "@/queries/useCommunityQueries";
import { GapY } from "../../components/ui/gap";
import { truncateAnnouncementPreview } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

const TAB_NOTICE = "notice";
const TAB_COMMUNITY = "community";

function BoardContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const tab =
    searchParams.get("tab") === TAB_COMMUNITY ? TAB_COMMUNITY : TAB_NOTICE;

  const { data: noticeData, isLoading: noticeLoading } = useAnnouncements({
    size: 50,
  });
  const { data: communityData, isLoading: communityLoading } =
    useCommunityPosts({ size: 50 });

  const noticePosts = noticeData?.posts ?? [];
  const communityPosts = communityData?.posts ?? [];

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

      {tab === TAB_COMMUNITY && (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <Image
            src="/error-logo.png"
            alt="coming soon"
            width={160}
            height={160}
          />
          <p className="title-md text-gray-2 text-center">
            Something new is coming.
          </p>
          <p className="text-md text-white font-semibold text-center whitespace-pre-line">
            {"We're crafting a space for us.\nComing soon!"}
          </p>
        </div>
      )}
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
