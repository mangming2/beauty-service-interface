import type { ReactNode } from "react";

// URL pattern using whitelist of legal URL characters (handles all languages uniformly)
// \w matches [a-zA-Z0-9_] only (no CJK/Hangul characters)
const URL_PATTERN =
  /(https?:\/\/[\w\-.~:/?#[\]@!$&'()*+,;=%]+|www\.[\w\-.~:/?#[\]@!$&'()*+,;=%]+\.[\w\-.~:/?#[\]@!$&'()*+,;=%]+)/g;

// Trailing punctuation that should not be part of the URL
const TRAILING_PUNCTUATION = /[.,!?;:)\]'"]$/;

function toHref(url: string): string {
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
}

/** Trim trailing punctuation from a URL and return [trimmedUrl, trailingPunct] */
function trimUrlPunctuation(url: string): [string, string] {
  let trimmed = url;
  let trailing = "";

  while (TRAILING_PUNCTUATION.test(trimmed)) {
    trailing = trimmed[trimmed.length - 1] + trailing;
    trimmed = trimmed.slice(0, -1);
  }

  return [trimmed, trailing];
}

/** 본문 텍스트 안의 URL(http/https, www.로 시작하는 도메인)을 클릭 가능한 링크로 변환한다 */
export function linkifyText(text: string): ReactNode[] {
  // Guard against null/empty content
  if (!text) return [];

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let keyIndex = 0;

  const matches = Array.from(text.matchAll(URL_PATTERN));

  for (const match of matches) {
    const startIndex = match.index!;

    // Add text before the URL
    if (startIndex > lastIndex) {
      nodes.push(text.slice(lastIndex, startIndex));
      keyIndex++;
    }

    // Process the matched URL
    const [trimmedUrl, trailing] = trimUrlPunctuation(match[0]);

    nodes.push(
      <a
        key={`link-${keyIndex}`}
        href={toHref(trimmedUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline"
      >
        {trimmedUrl}
      </a>
    );
    keyIndex++;

    // Add trailing punctuation as text
    if (trailing) {
      nodes.push(trailing);
      keyIndex++;
    }

    lastIndex = startIndex + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
