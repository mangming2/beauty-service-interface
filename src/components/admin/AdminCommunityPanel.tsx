"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  useInfiniteCommunityPosts,
  usePostComments,
  useDeleteCommunityPost,
  useDeletePostComment,
} from "@/queries/useCommunityQueries";
import type { ApiError } from "@/lib/apiClient";

function communityMutationMessage(error: unknown): string {
  const e = error as ApiError | undefined;
  if (e?.status === 403) return "관리자 권한이 필요합니다.";
  if (e?.status === 404) return "리소스를 찾을 수 없습니다.";
  return e?.message ?? "요청에 실패했습니다.";
}

function CommentRows({ postId }: { postId: number }) {
  const { data: comments = [], isLoading } = usePostComments(postId);
  const deleteComment = useDeletePostComment();

  if (isLoading) {
    return (
      <tr>
        <td colSpan={4} className="px-4 py-2 text-xs text-gray-500">
          댓글 불러오는 중...
        </td>
      </tr>
    );
  }

  if (comments.length === 0) {
    return (
      <tr>
        <td colSpan={4} className="px-4 py-2 text-xs text-gray-500">
          댓글 없음
        </td>
      </tr>
    );
  }

  return (
    <>
      {comments.map(c => (
        <tr
          key={c.commentId}
          className="border-t border-gray-700/50 bg-gray-900/40"
        >
          <td className="pl-8 pr-2 py-2 text-xs text-gray-400">
            {c.isReply ? "↳ 답글" : "댓글"}
          </td>
          <td className="px-2 py-2 text-xs text-gray-300">
            {c.isDeleted ? (
              <span className="italic text-gray-600">삭제됨</span>
            ) : (
              <span className="line-clamp-1">{c.content}</span>
            )}
          </td>
          <td className="px-2 py-2 text-xs text-gray-500">
            {c.authorDisplayName}
          </td>
          <td className="px-2 py-2 text-right">
            {!c.isDeleted && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-6 text-xs text-red-300 px-2"
                disabled={deleteComment.isPending}
                onClick={() => {
                  if (!confirm("이 댓글을 삭제할까요?")) return;
                  deleteComment.mutate(
                    { postId, commentId: c.commentId },
                    { onError: err => alert(communityMutationMessage(err)) }
                  );
                }}
              >
                삭제
              </Button>
            )}
          </td>
        </tr>
      ))}
    </>
  );
}

export function AdminCommunityPanel() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCommunityPosts({ size: 20 });

  const posts = useMemo(
    () => (data?.pages ?? []).flatMap(p => p.posts),
    [data?.pages]
  );

  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const deletePost = useDeleteCommunityPost();

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        커뮤니티 게시글/댓글 관리 (관리자)
      </p>

      {isLoading ? (
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-sm">게시글이 없습니다.</p>
      ) : (
        <div className="rounded-lg border border-gray-600 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="text-left p-2">제목</th>
                <th className="text-left p-2 w-24 hidden sm:table-cell">
                  작성자
                </th>
                <th className="text-left p-2 w-20 hidden sm:table-cell">
                  댓글
                </th>
                <th className="text-right p-2 w-24">작업</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <React.Fragment key={post.postId}>
                  <tr
                    className="border-t border-gray-700 hover:bg-gray-800/50 cursor-pointer"
                    onClick={() =>
                      setExpandedPostId(v =>
                        v === post.postId ? null : post.postId
                      )
                    }
                  >
                    <td className="p-2">
                      <div className="font-medium text-white truncate max-w-[160px]">
                        {expandedPostId === post.postId ? "▾ " : "▸ "}
                        {post.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(() => {
                          try {
                            return format(
                              new Date(post.createdAt),
                              "yyyy.MM.dd HH:mm"
                            );
                          } catch {
                            return post.createdAt;
                          }
                        })()}
                      </div>
                    </td>
                    <td className="p-2 text-gray-400 hidden sm:table-cell">
                      {post.authorDisplayName}
                    </td>
                    <td className="p-2 text-gray-400 hidden sm:table-cell">
                      {post.commentCount}
                    </td>
                    <td className="p-2 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8 text-red-300"
                        disabled={deletePost.isPending}
                        onClick={e => {
                          e.stopPropagation();
                          if (!confirm("이 게시글을 삭제할까요?")) return;
                          deletePost.mutate(post.postId, {
                            onError: err =>
                              alert(communityMutationMessage(err)),
                          });
                        }}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                  {expandedPostId === post.postId && (
                    <CommentRows postId={post.postId} />
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasNextPage && (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
        </Button>
      )}
    </div>
  );
}
