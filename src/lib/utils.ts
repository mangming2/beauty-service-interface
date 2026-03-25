import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 공지 목록 등에서 본문 미리보기 한 줄 */
export function truncateAnnouncementPreview(
  content: string | undefined,
  maxLength = 80
): string | null {
  if (!content?.trim()) return null;
  const single = content.trim().replace(/\s+/g, " ");
  if (single.length <= maxLength) return single;
  return `${single.slice(0, maxLength)}…`;
}
