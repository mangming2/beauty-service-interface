"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useCommunityPostDetail } from "@/queries/useCommunityQueries";
import { getSafeImageSrc } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { useTranslation } from "@/hooks/useTranslation";

export default function CommunityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const postId = id ? parseInt(id, 10) : undefined;
  const { t } = useTranslation();

  const { data: post, isLoading, isError } = useCommunityPostDetail(postId);

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

  return (
    <article className="bg-background text-white px-4 pb-8">
      <div className="flex items-start gap-3 mt-4">
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

      <div className="caption-md text-gray_1 mt-6 flex gap-4">
        <span>
          {t("boardPage.likes")} {post.likeCount}
        </span>
        <span>
          {t("boardPage.comments")} {post.commentCount}
        </span>
      </div>
    </article>
  );
}
