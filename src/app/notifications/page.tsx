"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { MessageCircle, Heart, Bell } from "lucide-react";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteAllNotifications,
} from "@/queries/useNotificationQueries";
import { useTranslation } from "@/hooks/useTranslation";
import type { NotificationResponse, NotificationType } from "@/api/notification";

function timeAgo(dateStr: string) {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ko });
}

function NotificationIcon({ type }: { type: NotificationType }) {
  const isLike = type === "POST_LIKE";
  return (
    <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gray-container flex items-center justify-center">
      {isLike ? (
        <Heart className="w-5 h-5 text-white fill-white" />
      ) : (
        <MessageCircle className="w-5 h-5 text-white fill-white" />
      )}
    </div>
  );
}

function notificationTitle(type: NotificationType, lang: string): string {
  const map: Record<NotificationType, Record<string, string>> = {
    POST_COMMENT: {
      Ko: "회원님의 게시글에 새로운 댓글이 달렸습니다.",
      En: "Someone commented on your post.",
      Ja: "投稿にコメントが届きました。",
      Zh: "您的帖子收到了新评论。",
    },
    COMMENT_REPLY: {
      Ko: "회원님의 댓글에 새로운 답글이 달렸습니다.",
      En: "Someone replied to your comment.",
      Ja: "コメントに返信が届きました。",
      Zh: "您的评论收到了新回复。",
    },
    POST_LIKE: {
      Ko: "회원님의 게시글을 좋아합니다.",
      En: "Someone liked your post.",
      Ja: "投稿にいいねが届きました。",
      Zh: "有人喜欢了您的帖子。",
    },
  };
  return map[type]?.[lang] ?? map[type]?.["Ko"] ?? "";
}

function getTarget(n: NotificationResponse): string {
  return `/board/community/${n.targetId}`;
}

export default function NotificationsPage() {
  const { t, currentLanguage } = useTranslation();
  const router = useRouter();

  const { data } = useNotifications({ size: 50 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteAll = useDeleteAllNotifications();

  const notifications = data?.notifications ?? [];

  function handleClick(n: NotificationResponse) {
    if (!n.isRead) markRead.mutate(n.id);
    router.push(getTarget(n));
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] bg-background text-white">
      {/* Action bar */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-end gap-3 px-5 py-2 border-b border-gray-outline">
          <button
            onClick={() => markAllRead.mutate()}
            className="caption-md text-gray_1 hover:text-white transition-colors"
          >
            {t("notification.markAllRead")}
          </button>
          <button
            onClick={() => deleteAll.mutate()}
            className="caption-md text-gray_1 hover:text-white transition-colors"
          >
            {t("notification.deleteAll")}
          </button>
        </div>
      )}

      {/* List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray_1">
          <Bell className="w-10 h-10 opacity-30" />
          <p className="caption-md">{t("notification.noNotifications")}</p>
        </div>
      ) : (
        <ul>
          {notifications.map((n, idx) => (
            <li
              key={n.id}
              onClick={() => handleClick(n)}
              className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-white/5 ${
                idx < notifications.length - 1 ? "border-b border-gray-outline" : ""
              } ${!n.isRead ? "bg-pink-font/5" : ""}`}
            >
              <NotificationIcon type={n.type} />

              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium leading-snug break-keep">
                  {notificationTitle(n.type, currentLanguage)}
                </p>
                <p className="caption-md text-gray_1 mt-0.5 truncate">
                  {n.message}
                </p>
                <p className="caption-md text-gray_1 mt-1 text-right">
                  {timeAgo(n.createdAt)}
                </p>
              </div>

              {!n.isRead && (
                <span className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-pink-font" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
