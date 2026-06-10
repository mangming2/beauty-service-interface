import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { CommunityCommentView } from "@/api/community";
import { KebabMenu } from "@/components/community/KebabMenu";

function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), {
    addSuffix: true,
    locale: ko,
  });
}

function Avatar() {
  return (
    <div className="rounded-full flex-shrink-0 bg-gray-container flex items-center justify-center overflow-hidden w-6 h-6">
      <Image
        src="/main-icon.png"
        alt=""
        width={24}
        height={24}
        className="object-contain"
      />
    </div>
  );
}

interface ReplyCommentCardProps {
  comment: CommunityCommentView;
  deletedLabel?: string;
  onClick?: () => void;
  onDelete?: () => void;
}

export function ReplyCommentCard({
  comment,
  deletedLabel = "삭제된 답글입니다.",
  onClick,
  onDelete,
}: ReplyCommentCardProps) {
  if (comment.isDeleted) {
    return (
      <li className="ml-10">
        <div className="rounded-2xl bg-gray-container px-4 py-3">
          <p className="caption-md text-gray_1">{deletedLabel}</p>
        </div>
      </li>
    );
  }

  return (
    <li className="ml-10">
      <div
        className={`rounded-2xl bg-gray-container px-4 py-3 ${onClick ? "cursor-pointer active:opacity-80 transition-opacity" : ""}`}
        onClick={onClick}
      >
        <div className="flex gap-3 items-start">
          <Avatar />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                <p className="caption-md text-white font-semibold leading-tight">
                  {comment.authorDisplayName}
                </p>
                <p className="caption-sm text-gray-2 mt-0.5">
                  {timeAgo(comment.createdAt)}
                </p>
              </div>
              {onDelete && <KebabMenu onDelete={onDelete} />}
            </div>
            <p className="text-md text-white break-keep leading-relaxed mt-1">
              {comment.content}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
