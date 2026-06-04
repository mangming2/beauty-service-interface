"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  usePostComments,
  useCreatePostComment,
} from "@/queries/useCommunityQueries";
import { Spinner } from "@/components/ui/spinner";
import { ChatBubbleIcon, SendIcon } from "@/components/common/Icons";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { gtag } from "@/lib/gtag";
import type { CommunityCommentView } from "@/api/community";

function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), {
    addSuffix: true,
    locale: ko,
  });
}

function Avatar({ size = 44 }: { size?: number }) {
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

function ParentCommentCard({ comment }: { comment: CommunityCommentView }) {
  return (
    <div className="px-4 py-4 border-b border-gray-outline">
      <div className="flex gap-3">
        <Avatar size={64} />
        <div className="flex-1 min-w-0 pt-1">
          <p className="text-sm text-white font-semibold leading-tight">
            {comment.authorDisplayName}
          </p>
          <p className="text-sm text-white mt-1 break-keep leading-relaxed">
            {comment.content}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2 ml-1">
        <span className="caption-md text-gray_1">
          {format(new Date(comment.createdAt), "yy.MM.dd  HH:mm")}
        </span>
        <div className="flex items-center gap-1.5 caption-md text-gray_1">
          <ChatBubbleIcon width={11} height={11} color="#bcbcbc" />
        </div>
      </div>
    </div>
  );
}

function ReplyItem({ comment }: { comment: CommunityCommentView }) {
  if (comment.isDeleted) {
    return (
      <li className="ml-10">
        <div className="rounded-2xl bg-gray-container px-4 py-3">
          <p className="caption-md text-gray_1 italic">삭제된 답글입니다.</p>
        </div>
      </li>
    );
  }

  return (
    <li className="ml-10">
      <div className="rounded-2xl bg-gray-container px-4 py-3">
        <div className="flex gap-3 items-start">
          <Avatar size={44} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="caption-md text-white font-semibold">
                {comment.authorDisplayName}
              </span>
              <span className="caption-md text-gray_1">│</span>
              <span className="caption-md text-gray_1">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-white break-keep leading-relaxed">
              {comment.content}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function CommentReplyPage() {
  const params = useParams();
  const id = params.id as string;
  const commentId = params.commentId as string;
  const postId = id ? parseInt(id, 10) : undefined;
  const parentCommentId = commentId ? parseInt(commentId, 10) : undefined;

  const { data: comments = [], isLoading } = usePostComments(postId);
  const createComment = useCreatePostComment();

  const [commentText, setCommentText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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

  const parentComment = comments.find(c => c.commentId === parentCommentId);
  const replies = comments.filter(c => c.parentCommentId === parentCommentId);

  if (!parentComment) {
    notFound();
  }

  function handleSubmit() {
    const content = commentText.trim();
    if (!content || !postId || !parentCommentId || createComment.isPending)
      return;
    createComment.mutate(
      {
        postId,
        body: { content, parentCommentId },
      },
      {
        onSuccess: () => {
          gtag.commentCreate(postId!);
          setCommentText("");
        },
      }
    );
  }

  return (
    <div className="bg-background text-white flex flex-col min-h-screen pb-[80px]">
      <ParentCommentCard comment={parentComment} />

      <section className="px-4 pt-4 flex-1">
        {replies.length === 0 ? (
          <p className="caption-md text-gray_1 py-4">아직 답글이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {replies.map(reply => (
              <ReplyItem key={reply.commentId} comment={reply} />
            ))}
          </ul>
        )}
      </section>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[412px] bg-background border-t border-gray-outline px-4 py-3 flex items-end gap-3 z-20">
        <textarea
          ref={inputRef}
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder={`${parentComment.authorDisplayName}에게 답글 달기...`}
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
              handleSubmit();
            }
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!commentText.trim() || createComment.isPending}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-font flex items-center justify-center disabled:opacity-40"
        >
          <SendIcon width={16} height={16} color="white" />
        </button>
      </div>
    </div>
  );
}
