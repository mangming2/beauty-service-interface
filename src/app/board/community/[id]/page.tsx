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
import type { CommunityCommentView } from "@/api/community";

function formatCount(count: number): string {
  return count >= 999 ? "999+" : count.toString();
}

function CommentItem({
  comment,
  onReply,
  t,
}: {
  comment: CommunityCommentView;
  onReply: (comment: CommunityCommentView) => void;
  t: (key: string) => string;
}) {
  const indent = Math.min(comment.depth, 4) * 20;

  return (
    <li
      className="flex gap-3"
      style={{ paddingLeft: `${indent}px` }}
    >
      <div className="rounded-full flex-shrink-0 w-8 h-8 bg-gray-container flex items-center justify-center overflow-hidden">
        <Image src="/main-icon.png" alt="" width={32} height={32} className="object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        {comment.isDeleted ? (
          <p className="caption-md text-gray_1 italic mt-0.5">
            {t("communityPage.deletedComment")}
          </p>
        ) : (
          <>
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
            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={() => onReply(comment)}
                className="flex items-center gap-1 caption-md text-gray_1 hover:text-white transition-colors"
              >
                <ChatBubbleIcon width={10} height={10} color="#bcbcbc" />
                <span className="text-[10px]">{t("communityPage.reply")}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
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
  const [replyTarget, setReplyTarget] = useState<CommunityCommentView | null>(null);
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

  function handleReply(comment: CommunityCommentView) {
    setReplyTarget(comment);
    inputRef.current?.focus();
  }

  function handleCancelReply() {
    setReplyTarget(null);
    setCommentText("");
  }

  function handleSubmitComment() {
    const content = commentText.trim();
    if (!content || !postId || createComment.isPending) return;
    createComment.mutate(
      {
        postId,
        body: {
          content,
          ...(replyTarget ? { parentCommentId: replyTarget.commentId } : {}),
        },
      },
      {
        onSuccess: () => {
          gtag.commentCreate(postId);
          setCommentText("");
          setReplyTarget(null);
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
              <CommentItem
                key={comment.commentId}
                comment={comment}
                onReply={handleReply}
                t={t}
              />
            ))}
          </ul>
        )}
      </section>

      {/* Comment input - fixed at bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[412px] bg-background border-t border-gray-outline px-4 py-3 flex flex-col gap-2 z-20">
        {replyTarget && (
          <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-gray-container">
            <span className="caption-md text-gray_1 truncate">
              {replyTarget.authorDisplayName}
              {t("communityPage.replyPlaceholder")}
            </span>
            <button
              onClick={handleCancelReply}
              className="ml-2 caption-md text-gray_1 hover:text-white flex-shrink-0"
            >
              {t("communityPage.cancelReply")}
            </button>
          </div>
        )}
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder={
              replyTarget
                ? `${replyTarget.authorDisplayName}${t("communityPage.replyPlaceholder")}`
                : t("communityPage.commentPlaceholder")
            }
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
    </div>
  );
}
