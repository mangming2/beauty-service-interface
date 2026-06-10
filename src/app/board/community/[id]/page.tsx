"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef } from "react";
import {
  useCommunityPostDetail,
  usePostComments,
  useTogglePostLike,
  useTogglePostBookmark,
  useCreatePostComment,
  useDeleteCommunityPost,
  useDeletePostComment,
} from "@/queries/useCommunityQueries";
import { useAuthStore } from "@/store/useAuthStore";
import { KebabMenu } from "@/components/community/KebabMenu";
import { getSafeImageSrc } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleIcon,
  SendIcon,
} from "@/components/common/Icons";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useTranslation } from "@/hooks/useTranslation";
import { gtag } from "@/lib/gtag";
import type { CommunityCommentView } from "@/api/community";
import { ReplyCommentCard } from "@/components/community/ReplyCommentCard";

function formatCount(count: number): string {
  return count >= 999 ? "999+" : count.toString();
}

function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), {
    addSuffix: true,
    locale: ko,
  });
}

function Avatar({ size = 64 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex-shrink-0 bg-gray-container flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      <Image
        src="/main-icon.png"
        alt=""
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  );
}

function TopLevelComment({
  comment,
  replyCount,
  onReply,
  onDelete,
  t,
}: {
  comment: CommunityCommentView;
  replyCount: number;
  onReply: (comment: CommunityCommentView) => void;
  onDelete?: () => void;
  t: (key: string) => string;
}) {
  if (comment.isDeleted) {
    return (
      <li className="py-3">
        <p className="caption-md text-gray_1 italic">
          {t("communityPage.deletedComment")}
        </p>
      </li>
    );
  }

  return (
    <li>
      <div className="flex gap-3">
        <Avatar size={64} />
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-start justify-between gap-1">
            <p className="text-sm text-white font-semibold leading-tight">
              {comment.authorDisplayName}
            </p>
            {onDelete && <KebabMenu onDelete={onDelete} />}
          </div>
          <p className="text-sm text-white mt-1 break-keep leading-relaxed">
            {comment.content}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2 ml-1">
        <span className="caption-md text-gray_1">
          {format(new Date(comment.createdAt), "yy.MM.dd  HH:mm")}
        </span>
        <button
          onClick={() => onReply(comment)}
          className="flex items-center gap-1.5 caption-md text-gray_1 hover:text-white transition-colors"
        >
          <ChatBubbleIcon width={11} height={11} color="#bcbcbc" />
          <span className="text-[11px]">
            {replyCount === 0 ? "답글쓰기" : replyCount}
          </span>
        </button>
      </div>
    </li>
  );
}


export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const postId = id ? parseInt(id, 10) : undefined;
  const { t } = useTranslation();

  const { data: post, isLoading, isError } = useCommunityPostDetail(postId);
  const { data: comments = [] } = usePostComments(postId);
  const toggleLike = useTogglePostLike();
  const toggleBookmark = useTogglePostBookmark();
  const createComment = useCreatePostComment();

  const { user } = useAuthStore();
  const deletePost = useDeleteCommunityPost();
  const deleteComment = useDeletePostComment();

  const isMyContent = (authorId: number) =>
    !!user && parseInt(user.id, 10) === authorId;

  function handleDeletePost() {
    if (!postId || !confirm("게시글을 삭제할까요?")) return;
    deletePost.mutate(postId, {
      onSuccess: () => router.back(),
    });
  }

  function handleDeleteComment(commentId: number) {
    if (!postId || !confirm("댓글을 삭제할까요?")) return;
    deleteComment.mutate({ postId, commentId });
  }

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

  function handleReply(comment: CommunityCommentView) {
    router.push(`/board/community/${id}/comment/${comment.commentId}`);
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
          {isMyContent(post.authorId) && (
            <KebabMenu onDelete={handleDeletePost} />
          )}
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
                  unoptimized={getSafeImageSrc(url).startsWith("http")}
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
        <h2 className="text-md text-white font-semibold mb-5">
          {t("boardPage.comments")} {formatCount(post.commentCount)}
        </h2>

        {comments.length === 0 ? (
          <p className="caption-md text-gray_1 py-4">
            {t("communityPage.noComments")}
          </p>
        ) : (
          <ul className="space-y-5">
            {comments.map(comment => {
              const replyCount = comments.filter(
                c => c.parentCommentId === comment.commentId
              ).length;
              return comment.isReply ? (
                <ReplyCommentCard
                  key={comment.commentId}
                  comment={comment}
                  deletedLabel={t("communityPage.deletedComment")}
                  onClick={() => handleReply(comment)}
                  onDelete={
                    isMyContent(comment.authorId)
                      ? () => handleDeleteComment(comment.commentId)
                      : undefined
                  }
                />
              ) : (
                <TopLevelComment
                  key={comment.commentId}
                  comment={comment}
                  replyCount={replyCount}
                  onReply={handleReply}
                  onDelete={
                    isMyContent(comment.authorId)
                      ? () => handleDeleteComment(comment.commentId)
                      : undefined
                  }
                  t={t}
                />
              );
            })}
          </ul>
        )}
      </section>

      {/* Comment input - fixed at bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[412px] bg-background border-t border-gray-outline px-4 py-3 flex items-end gap-3 z-20">
        <textarea
          ref={inputRef}
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          rows={1}
          className="flex-1 bg-gray-container rounded-2xl px-4 py-2 text-white caption-md resize-none outline-none placeholder:text-gray_1 min-h-[40px] max-h-[100px]"
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
          className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-font flex items-center justify-center disabled:opacity-40"
        >
          <SendIcon width={16} height={16} color="white" />
        </button>
      </div>
    </div>
  );
}
