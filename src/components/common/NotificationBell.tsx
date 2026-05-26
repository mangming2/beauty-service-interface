"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { BellIcon, XIcon } from "./Icons";
import { useTranslation } from "@/hooks/useTranslation";
import { useNotificationStream } from "@/hooks/useNotificationStream";
import {
  useUnreadNotificationCount,
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from "@/queries/useNotificationQueries";
import type { NotificationResponse } from "@/api/notification";

function getNotificationTarget(notification: NotificationResponse): string {
  if (notification.targetType === "COMMUNITY_POST") {
    return `/board/community/${notification.targetId}`;
  }
  return `/board/community/${notification.targetId}`;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const router = useRouter();

  useNotificationStream();

  const { data: unreadData } = useUnreadNotificationCount();
  const { data: notifData } = useNotifications({ size: 20 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteOne = useDeleteNotification();
  const deleteAll = useDeleteAllNotifications();

  const unreadCount = unreadData?.unreadCount ?? 0;
  const notifications = notifData?.notifications ?? [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function handleNotificationClick(notification: NotificationResponse) {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }
    setIsOpen(false);
    router.push(getNotificationTarget(notification));
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
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

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[320px] max-h-[480px] overflow-y-auto bg-gray-container border border-gray-outline rounded-xl shadow-lg z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-outline sticky top-0 bg-gray-container">
            <span className="text-white font-semibold text-sm">
              {t("notification.title")}
            </span>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={() => markAllRead.mutate()}
                    className="text-gray_1 text-xs hover:text-white transition-colors"
                  >
                    {t("notification.markAllRead")}
                  </button>
                  <button
                    onClick={() => deleteAll.mutate()}
                    className="text-gray_1 text-xs hover:text-white transition-colors"
                  >
                    {t("notification.deleteAll")}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <p className="text-gray_1 text-sm text-center py-8 px-4">
              {t("notification.noNotifications")}
            </p>
          ) : (
            <ul>
              {notifications.map(notification => (
                <li
                  key={notification.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-outline last:border-0 cursor-pointer hover:bg-white/5 transition-colors ${
                    !notification.isRead ? "bg-pink-font/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.isRead && (
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-pink-font" />
                  )}
                  {notification.isRead && (
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs leading-relaxed break-keep">
                      {notification.message}
                    </p>
                    <p className="text-gray_1 text-[10px] mt-0.5">
                      {format(new Date(notification.createdAt), "MM.dd HH:mm")}
                    </p>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteOne.mutate(notification.id);
                    }}
                    className="flex-shrink-0 p-0.5 text-gray_1 hover:text-white transition-colors"
                    aria-label="삭제"
                  >
                    <XIcon width={12} height={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
