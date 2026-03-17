"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useAnnouncementDetail } from "@/queries/useAnnouncementQueries";
import { HeartIcon } from "@/components/common/Icons";
import { Spinner } from "@/components/ui/spinner";
import { format, parseISO } from "date-fns";

export default function NoticeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const postId = id ? parseInt(id, 10) : undefined;

  const { data: post, isLoading, isError } = useAnnouncementDetail(postId);

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

  const displayDate = post.announcementDate || post.createdAt;
  const parsedDate = displayDate ? parseISO(displayDate) : null;
  const dateStr = parsedDate
    ? format(parsedDate, "yy.MM.dd")
    : (displayDate ?? "");
  const timeStr = parsedDate ? format(parsedDate, "HH:mm") : "";

  return (
    <article className="min-h-screen bg-background text-white px-4 pb-8">
      <p className="text-gray_1 text-sm pt-4 pb-2">공지사항 글 상세</p>

      <div className="flex items-start gap-3 mt-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-container flex items-center justify-center">
          <HeartIcon color="#ff60b3" className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-md text-white font-medium">DOKI 담당자</p>
          <p className="caption-md text-gray_1 mt-0.5">
            {dateStr}
            {timeStr ? ` ${timeStr}` : ""}
          </p>
        </div>
      </div>

      <h1 className="title-lg text-white font-semibold mt-6 break-keep">
        {post.title}
      </h1>

      <div className="mt-4 text-md text-white leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      {post.imageUrls?.length > 0 && (
        <div className="mt-6 space-y-3">
          {post.imageUrls.map((url, index) => (
            <div
              key={index}
              className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-container"
            >
              <Image
                src={url}
                alt={`첨부 이미지 ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 412px) 100vw, 412px"
              />
            </div>
          ))}
        </div>
      )}

      {post.viewCount !== undefined && (
        <p className="caption-md text-gray_1 mt-6">조회수 {post.viewCount}</p>
      )}
    </article>
  );
}
