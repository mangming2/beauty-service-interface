"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useState, useRef } from "react";
import {
  useCommunityPostDetail,
  usePostComments,
  useTogglePostLike,
  useTogglePostBookmark,
  useCreatePostComment,
} from "@/queries/useCommunityQueries";
import { getSafeImageSrc } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleIcon,
  SendIcon,
} from "@/components/common/Icons";
import { format } from "date-fns";
import { useTranslation } from "@/hooks/useTranslation";
import { gtag } from "@/lib/gtag";

// TODO: Backend doesn't support nested replies - comments are displayed flat

function formatCount(count: number): string {
  return count >= 999 ? "999+" : count.toString();
}

export default function CommunityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const postId = id ? parseInt(id, 10) : undefined;
  const { t } = useTranslation();

  const { data: post, isLoading, isError } = useCommunityPostDetail(postId);
  const { data: comments = [] } = usePostComments(postId);
  const toggleLike = useTogglePostLike();
  const toggleBookmark = useTogglePostBookmark();
  const createComment = useCreatePostComment();

  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  if (postId === undefined || Number.isNaN(postId)) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <Spinner className="w-8 h-8 text-white" />
      </div>
    );
  }

  if (isError || !post) {
    notFound();
  }

  const displayLikeCount = likeCount ?? post.likeCount;
  const displayBookmarkCount = bookmarkCount ?? post.bookmarkCount;

  function handleLike() {
    if (!postId || toggleLike.isPending) return;
    gtag.postLike(postId);
    toggleLike.mutate(postId, {
      onSuccess: res => {
        setLikeCount(res.isLiked ? displayLikeCount + 1 : displayLikeCount - 1);
      },
    });
  }

  function handleBookmark() {
    if (!postId || toggleBookmark.isPending) return;
    toggleBookmark.mutate(postId, {
      onSuccess: res => {
        setBookmarkCount(
          res.isBookmarked ? displayBookmarkCount + 1 : displayBookmarkCount - 1
        );
      },
    });
  }

  function handleSubmitComment() {
    const content = commentText.trim();
    if (!content || !postId || createComment.isPending) return;
    createComment.mutate(
      { postId, body: { content } },
      {
        onSuccess: () => {
          gtag.commentCreate(postId);
          setCommentText("");
        },
      }
    );
  }

  return (
    <div className="bg-background text-white flex flex-col min-h-screen pb-[80px]">
      <article className="px-4 pb-4">
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 pb-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded border border-gray-outline caption-md text-gray_1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Author */}
        <div className="flex items-start gap-3 mt-3">
          <div className="rounded-full flex-shrink-0 w-10 h-10 bg-gray-container flex items-center justify-center overflow-hidden">
            <Image
              src="/main-icon.png"
              alt=""
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-md text-white font-medium">
              {post.authorDisplayName}
            </p>
            <p className="caption-md text-gray_1 mt-0.5">
              {format(new Date(post.createdAt), "yy.MM.dd HH:mm")}
            </p>
          </div>
        </div>

        {/* Title */}
        <h1 className="title-sm text-white font-semibold mt-4 break-keep">
          {post.title}
        </h1>

        {/* Content */}
        <div className="mt-4 text-md text-white leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Images */}
        {post.imageUrls?.length > 0 && (
          <div className="mt-6 space-y-3">
            {post.imageUrls.map((url, index) => (
              <div
                key={index}
                className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-container"
              >
                <Image
                  src={getSafeImageSrc(url)}
                  alt={`첨부 이미지 ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 412px) 100vw, 412px"
                  unoptimized={url.startsWith("http")}
                />
              </div>
            ))}
          </div>
        )}

        {/* Like / Bookmark counts */}
        <div className="flex items-center gap-5 mt-6 pb-4 border-b border-gray-outline">
          <button
            onClick={handleLike}
            disabled={toggleLike.isPending}
            className="flex items-center gap-1.5 text-gray_1 caption-md"
          >
            <HeartIcon width={16} height={16} color="#f92595" />
            {formatCount(displayLikeCount)}
          </button>
          <button
            onClick={handleBookmark}
            disabled={toggleBookmark.isPending}
            className="flex items-center gap-1.5 text-gray_1 caption-md"
          >
            <BookmarkIcon width={12} height={14} color="#bcbcbc" />
            {formatCount(displayBookmarkCount)}
          </button>
        </div>
      </article>

      {/* Comments */}
      <section className="px-4 flex-1">
        <h2 className="text-md text-white font-semibold mb-4">
          {t("boardPage.comments")} {formatCount(post.commentCount)}
        </h2>

        {comments.length === 0 ? (
          <p className="caption-md text-gray_1 py-4">
            {t("communityPage.noComments")}
          </p>
        ) : (
          <ul className="space-y-4">
            {comments.map(comment => (
              <li key={comment.commentId} className="flex gap-3">
                <div className="rounded-full flex-shrink-0 w-8 h-8 bg-gray-container flex items-center justify-center overflow-hidden">
                  <Image
                    src="/main-icon.png"
                    alt=""
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="caption-md text-white font-medium">
                      {comment.authorDisplayName}
                    </span>
                    <span className="caption-md text-gray_1">
                      {format(new Date(comment.createdAt), "yy.MM.dd HH:mm")}
                    </span>
                  </div>
                  <p className="caption-md text-white mt-0.5 break-keep">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ChatBubbleIcon width={10} height={10} color="#bcbcbc" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Comment input - fixed at bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[412px] bg-background border-t border-gray-outline px-4 py-3 flex items-end gap-3 z-20">
        <textarea
          ref={inputRef}
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder={t("communityPage.commentPlaceholder")}
          rows={1}
          className="flex-1 bg-gray-container rounded-2xl px-4 py-2 text-white caption-md resize-none outline-none placeholder:text-gray_1 min-h-[36px] max-h-[100px]"
          onInput={e => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmitComment();
            }
          }}
        />
        <button
          onClick={handleSubmitComment}
          disabled={!commentText.trim() || createComment.isPending}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-pink-font flex items-center justify-center disabled:opacity-40"
        >
          <SendIcon width={16} height={16} color="white" />
        </button>
      </div>
    </div>
  );
}
