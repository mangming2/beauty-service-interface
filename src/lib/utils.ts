import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * API에서 오는 이미지 URL을 안전한 절대 URL로 변환한다.
 * - http/https: 그대로 반환
 * - /images/...: API 서버 경로이므로 API base URL 붙여 반환
 * - file:// 또는 빈 값: fallback 반환
 */
export function getSafeImageSrc(
  src: string | null | undefined,
  fallback = "/dummy-logo.png"
): string {
  if (!src) return fallback;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/images/")) return `${API_BASE_URL}${src}`;
  if (src.startsWith("/")) return src; // 로컬 정적 파일 (/dummy-logo.png 등)
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
