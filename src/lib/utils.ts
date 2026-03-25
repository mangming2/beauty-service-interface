import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * API에서 오는 이미지 URL이 http/https인지 검사 후 반환.
 * file:// 경로나 빈 값은 fallback으로 대체한다.
 */
export function getSafeImageSrc(
  src: string | null | undefined,
  fallback = "/dummy-logo.png"
): string {
  if (!src) return fallback;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/")) return src; // 로컬 정적 파일
  return fallback;
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
