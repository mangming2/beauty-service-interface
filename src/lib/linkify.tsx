import type { ReactNode } from "react";

const URL_SPLIT_PATTERN = /(https?:\/\/[^\s]+|www\.[^\s]+\.[^\s]+)/g;
const URL_MATCH_PATTERN = /^(https?:\/\/[^\s]+|www\.[^\s]+\.[^\s]+)$/;

function toHref(url: string): string {
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
}

/** 본문 텍스트 안의 URL(http/https, www.로 시작하는 도메인)을 클릭 가능한 링크로 변환한다 */
export function linkifyText(text: string): ReactNode[] {
  return text.split(URL_SPLIT_PATTERN).map((part, index) =>
    URL_MATCH_PATTERN.test(part) ? (
      <a
        key={index}
        href={toHref(part)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}
