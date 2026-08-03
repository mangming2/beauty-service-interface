import type { ReactNode } from "react";

// URL pattern that excludes whitespace and Korean characters (syllables U+AC00-U+D7AF, jamo U+1100-U+11FF)
const URL_PATTERN = /(https?:\/\/[^\s가-힯ᄀ-ᇿ]+|www\.[^\s가-힯ᄀ-ᇿ]+\.[^\s가-힯ᄀ-ᇿ]+)/g;

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
