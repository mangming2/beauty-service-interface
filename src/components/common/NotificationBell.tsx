"use client";

import { useRouter } from "next/navigation";
import { BellIcon } from "./Icons";
import { useTranslation } from "@/hooks/useTranslation";
import { useNotificationStream } from "@/hooks/useNotificationStream";
import { useUnreadNotificationCount } from "@/queries/useNotificationQueries";

export function NotificationBell() {
  const { t } = useTranslation();
  const router = useRouter();

  useNotificationStream();

  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount = unreadData?.unreadCount ?? 0;

  return (
    <button
      onClick={() => router.push("/notifications")}
      aria-label={t("notification.title")}
      className="relative inline-flex items-center justify-center"
    >
      <BellIcon width={20} height={22} color="white" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-pink-font text-white text-[10px] font-bold flex items-center justify-center px-0.5 leading-none">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
