"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import type { ApiError } from "@/lib/apiClient";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useInfiniteAnnouncements,
  useAnnouncementDetail,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "@/queries/useAnnouncementQueries";
import type { AnnouncementRequestDto } from "@/api/announcement";

function toDatetimeLocalValue(iso: string | undefined): string {
  if (!iso) return "";
  try {
    return parseISO(iso).toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

function announcementAdminMutationMessage(error: unknown): string {
  const e = error as ApiError | undefined;
  if (e?.status === 403) return "관리자 권한이 필요합니다.";
  if (e?.status === 404) return "게시글을 찾을 수 없습니다.";
  return e?.message ?? "요청에 실패했습니다.";
}

export function AdminAnnouncementsPanel() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteAnnouncements({ size: 20 });

  const posts = useMemo(
    () => (data?.pages ?? []).flatMap(p => p.posts),
    [data?.pages]
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const { data: detail, isLoading: detailLoading } = useAnnouncementDetail(
    editingPostId ?? undefined
  );

  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const [title, setTitle] = useState("");
  const [announcementDateLocal, setAnnouncementDateLocal] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const openCreate = () => {
    setEditingPostId(null);
    setTitle("");
    setAnnouncementDateLocal("");
    setContent("");
    setImages([]);
    setDialogOpen(true);
  };

  const openEdit = (postId: number) => {
    setEditingPostId(postId);
    setImages([]);
    setDialogOpen(true);
  };

  useEffect(() => {
    if (!dialogOpen || editingPostId === null) return;
    if (!detail) return;
    setTitle(detail.title);
    setContent(detail.content);
    setAnnouncementDateLocal(
      toDatetimeLocalValue(detail.announcementDate || detail.createdAt)
    );
  }, [dialogOpen, editingPostId, detail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request: AnnouncementRequestDto = {
      title,
      content,
      announcementDate: announcementDateLocal
        ? new Date(announcementDateLocal).toISOString()
        : undefined,
    };

    if (editingPostId === null) {
      createMutation.mutate(
        { request, images: images.length ? images : undefined },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      updateMutation.mutate(
        {
          postId: editingPostId,
          request,
          images: images.length ? images : undefined,
        },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  };

  const handleDelete = (postId: number) => {
    if (!confirm("이 공지를 삭제할까요?")) return;
    deleteMutation.mutate(postId, {
      onError: err => {
        alert(announcementAdminMutationMessage(err));
      },
    });
  };

  const pending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <p className="text-sm text-gray-400">공지사항 CRUD (관리자)</p>
        <Button type="button" size="sm" onClick={openCreate}>
          공지 작성
        </Button>
      </div>

      {isLoading ? (
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-sm">등록된 공지가 없습니다.</p>
      ) : (
        <div className="rounded-lg border border-gray-600 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="text-left p-2">제목</th>
                <th className="text-left p-2 w-24">조회</th>
                <th className="text-right p-2 w-32">작업</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr
                  key={post.postId}
                  className="border-t border-gray-700 hover:bg-gray-800/50"
                >
                  <td className="p-2">
                    <div className="font-medium text-white truncate max-w-[180px]">
                      {post.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(() => {
                        try {
                          return format(
                            parseISO(post.announcementDate || post.createdAt),
                            "yyyy.MM.dd HH:mm"
                          );
                        } catch {
                          return post.announcementDate || post.createdAt;
                        }
                      })()}
                    </div>
                  </td>
                  <td className="p-2 text-gray-400">{post.viewCount}</td>
                  <td className="p-2 text-right space-x-1 whitespace-nowrap">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8"
                      onClick={() => openEdit(post.postId)}
                    >
                      수정
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 text-red-300"
                      onClick={() => handleDelete(post.postId)}
                      disabled={deleteMutation.isPending}
                    >
                      삭제
                    </Button>
                  </td>
                </tr>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg text-white border-gray-600 bg-[#1a1c20]">
          <DialogHeader>
            <DialogTitle>
              {editingPostId === null ? "공지 작성" : "공지 수정"}
            </DialogTitle>
          </DialogHeader>
          {editingPostId !== null && detailLoading ? (
            <p className="text-gray-400 text-sm">상세 불러오는 중...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  제목 *
                </label>
                <input
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  공지 일시 (선택, 미입력 시 서버 기본)
                </label>
                <input
                  type="datetime-local"
                  value={announcementDateLocal}
                  onChange={e => setAnnouncementDateLocal(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  내용 *
                </label>
                <textarea
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
                />
              </div>
              {editingPostId !== null &&
              detail?.imageUrls &&
              detail.imageUrls.length > 0 ? (
                <div>
                  <p className="text-xs text-gray-400 mb-2">
                    현재 첨부 이미지
                  </p>
                  <div className="flex flex-col gap-2">
                    {detail.imageUrls.map((url, idx) => (
                      <div
                        key={`${url}-${idx}`}
                        className="relative w-full aspect-video rounded border border-gray-600 overflow-hidden bg-gray-900"
                      >
                        <Image
                          src={url}
                          alt={`첨부 ${idx + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 512px) 100vw, 512px"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  이미지 (선택)
                </label>
                {editingPostId !== null ? (
                  <p className="text-xs text-gray-500 mb-1">
                    새 파일을 넣지 않으면 기존 첨부가 유지되는 경우가 많습니다.
                    (서버 설정에 따름)
                  </p>
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e =>
                    setImages(e.target.files ? [...e.target.files] : [])
                  }
                  className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:bg-gray-700 file:text-white file:border-0"
                />
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending ? "저장 중..." : "저장"}
                </Button>
              </DialogFooter>
              {(createMutation.isError || updateMutation.isError) && (
                <p className="text-red-400 text-xs">
                  {announcementAdminMutationMessage(
                    createMutation.error ?? updateMutation.error
                  )}
                </p>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
