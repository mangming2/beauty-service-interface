"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useAnnouncementDetail } from "@/queries/useAnnouncementQueries";
import { getSafeImageSrc } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { format, parseISO } from "date-fns";
import { useTranslation } from "@/hooks/useTranslation";

export default function NoticeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const postId = id ? parseInt(id, 10) : undefined;
  const { t } = useTranslation();

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
    <article className="bg-background text-white px-4 pb-8">
      <div className="flex items-start gap-3 mt-4">
        <div className="rounded-full flex-shrink-0 w-14 h-14 bg-black overflow-hidden relative">
          <Image
            src="/main-icon.png"
            alt=""
            width={56}
            height={56}
            className="object-contain w-full h-full"
          />
        </div>
        <div className="flex flex-col h-full gap-1 ">
          <p className="text-lg text-white font-medium">DOKI 담당자</p>
          <p className="caption-md text-gray_1 flex-shrink-0">
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

      {post.viewCount !== undefined && (
        <p className="caption-md text-gray_1 mt-6">
          {t("boardPage.viewCount")} {post.viewCount}
        </p>
      )}
    </article>
  );
}
