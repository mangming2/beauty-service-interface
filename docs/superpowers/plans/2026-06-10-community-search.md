# Community Search Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/board` 하위 페이지 헤더 검색 버튼 클릭 시 커뮤니티 게시글을 `query` 파라미터로 서버 검색하는 전용 페이지(`/board/search`) 구현

**Architecture:** `GET /boards/community/posts?query=...` 서버사이드 검색 활용. 기존 `useInfiniteCommunityPosts` hook에 `query` 파라미터 추가. Header에서 board 페이지 진입 시 `/board/search`로 라우팅 분기. 공지글 검색은 TODO 주석으로 남김.

**Tech Stack:** Next.js 14 (App Router), React, TypeScript, TailwindCSS, TanStack Query v5, date-fns

---

## File Map

| 파일 | 변경 |
|------|------|
| `src/api/community.ts` | `GetCommunityPostsParams`에 `query?: string` 추가 |
| `src/queries/useCommunityQueries.ts` | `useInfiniteCommunityPosts`에 `enabled` 옵션 추가 |
| `src/app/board/search/page.tsx` | 신규 생성 |
| `src/components/common/Header.tsx` | board 페이지 검색 링크 → `/board/search`, 타이틀 처리 추가 |

---

### Task 1: community API에 `query` 파라미터 추가

**Files:**
- Modify: `src/api/community.ts`

- [ ] **Step 1: `GetCommunityPostsParams` 인터페이스에 `query` 필드 추가**

`src/api/community.ts` 의 `GetCommunityPostsParams` 인터페이스를 아래로 교체:

```ts
export interface GetCommunityPostsParams {
  cursor?: string;
  size?: number;
  tag?: string;
  query?: string;
}
```

- [ ] **Step 2: `getCommunityPosts` 함수에서 `query` URLSearchParams append**

`getCommunityPosts` 함수 내 `queryParams` 빌드 블록에 아래 라인 추가 (`tag` append 직후):

```ts
if (params.query !== undefined && params.query !== "") {
  queryParams.append("query", params.query);
}
```

최종 함수 내 파라미터 빌드 블록 전체:

```ts
const queryParams = new URLSearchParams();
if (params.cursor !== undefined) {
  queryParams.append("cursor", params.cursor);
}
if (params.size !== undefined) {
  queryParams.append("size", String(params.size));
}
if (params.tag !== undefined) {
  queryParams.append("tag", params.tag);
}
if (params.query !== undefined && params.query !== "") {
  queryParams.append("query", params.query);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/api/community.ts
git commit -m "feat: add query param support to getCommunityPosts API"
```

---

### Task 2: `useInfiniteCommunityPosts`에 `enabled` 옵션 추가

**Files:**
- Modify: `src/queries/useCommunityQueries.ts`

- [ ] **Step 1: 함수 시그니처에 `options` 파라미터 추가**

`useCommunityQueries.ts`의 `useInfiniteCommunityPosts` 함수를 아래로 교체:

```ts
export function useInfiniteCommunityPosts(
  params: Omit<GetCommunityPostsParams, "cursor"> = {},
  options?: { enabled?: boolean }
) {
  return useInfiniteQuery<CommunityListResponse>({
    queryKey: [...communityKeys.lists(), "infinite", params],
    queryFn: ({ pageParam }) =>
      getCommunityPosts({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
    enabled: options?.enabled ?? true,
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/queries/useCommunityQueries.ts
git commit -m "feat: add enabled option to useInfiniteCommunityPosts"
```

---

### Task 3: `/board/search` 페이지 생성

**Files:**
- Create: `src/app/board/search/page.tsx`

- [ ] **Step 1: 파일 생성**

`src/app/board/search/page.tsx` 를 아래 내용으로 생성:

```tsx
"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { SearchIcon, HeartIcon, BookmarkIcon, ChatBubbleIcon } from "@/components/common/Icons";
import { useInfiniteCommunityPosts } from "@/queries/useCommunityQueries";
import type { CommunityPostListItem } from "@/api/community";

function formatCount(count: number): string {
  return count >= 999 ? "999+" : count.toString();
}

function CommunityPostCard({ post }: { post: CommunityPostListItem }) {
  const firstTag = post.tags?.[0];
  const dateStr = format(new Date(post.createdAt), "yy.MM.dd HH:mm");

  return (
    <Link href={`/board/community/${post.postId}`} className="block py-4 border-b border-gray-outline">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-block px-2 py-0.5 rounded border border-gray-outline caption-md text-gray_1">
          커뮤니티
        </span>
        {firstTag && (
          <span className="inline-block px-2 py-0.5 rounded border border-gray-outline caption-md text-gray_1">
            {firstTag}
          </span>
        )}
      </div>
      <p className="text-md text-white font-semibold line-clamp-1">{post.title}</p>
      <p className="caption-md text-gray_1 mt-0.5 line-clamp-2">{post.previewContent}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="caption-md text-gray_1">
          {post.authorDisplayName}{"  "}|{"  "}{dateStr}
        </p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 caption-md text-gray_1">
            <HeartIcon width={12} height={12} color="#f92595" />
            {formatCount(post.likeCount)}
          </span>
          <span className="flex items-center gap-1 caption-md text-gray_1">
            <BookmarkIcon width={9} height={11} color="#bcbcbc" />
            {formatCount(post.bookmarkCount)}
          </span>
          <span className="flex items-center gap-1 caption-md text-gray_1">
            <ChatBubbleIcon width={12} height={12} color="#bcbcbc" />
            {formatCount(post.commentCount)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BoardSearchPage() {
  const [searchText, setSearchText] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteCommunityPosts(
    { query: debouncedQuery, size: 20 },
    { enabled: !!debouncedQuery }
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  function handleChange(value: string) {
    setSearchText(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(value), 300);
  }

  const posts = data?.pages.flatMap(p => p.posts) ?? [];

  return (
    <div className="min-h-screen text-white px-5 pt-4 pb-5">
      <div className="flex items-center gap-2 rounded-xl bg-[#2E3033] border border-[#3E4043] px-3 py-2.5">
        <input
          type="search"
          placeholder="커뮤니티 검색..."
          value={searchText}
          onChange={e => handleChange(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder:text-gray-400 text-md outline-none min-w-0"
          autoFocus
        />
        <SearchIcon color="#9CA3AF" />
      </div>

      <div className="mt-6">
        {/* TODO: 공지글 검색 추가 예정 (GET /boards/announcements에 query 파라미터 지원 시) */}

        {!debouncedQuery ? null : isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex justify-center py-16">
            <p className="text-gray-400">검색 결과가 없습니다</p>
          </div>
        ) : (
          <div>
            {posts.map(post => (
              <CommunityPostCard key={post.postId} post={post} />
            ))}
            <div ref={bottomRef} className="h-4" />
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/board/search/page.tsx
git commit -m "feat: add community search page at /board/search"
```

---

### Task 4: Header 업데이트

**Files:**
- Modify: `src/components/common/Header.tsx`

- [ ] **Step 1: `isBoardSearchPage` 변수 추가 및 `isBoardPage` 범위 조정**

기존:
```ts
const isBoardPage = pathname === "/board" || pathname.startsWith("/board/");
const isNoticeDetailPage =
  pathname.startsWith("/board/notice/") && pathname !== "/board/notice";
const isSearchPage = pathname === "/search";
```

아래로 교체:
```ts
const isBoardSearchPage = pathname === "/board/search";
const isBoardPage = pathname === "/board" || (pathname.startsWith("/board/") && !isBoardSearchPage);
const isNoticeDetailPage =
  pathname.startsWith("/board/notice/") && pathname !== "/board/notice";
const isSearchPage = pathname === "/search";
```

- [ ] **Step 2: `/board/search` 타이틀 추가**

`{isSearchPage && (...)}` 블록 바로 아래에 추가:

```tsx
{isBoardSearchPage && (
  <h1 className="text-white h-6 title-md">{t("header.searchTitle")}</h1>
)}
```

- [ ] **Step 3: 로고 노출 조건에 `isBoardSearchPage` 제외 추가**

기존 로고 조건:
```tsx
{((!isFormPage &&
  !isWishPage &&
  !isMyEditPage &&
  !isMyPage &&
  !isPackageReviewsPage &&
  !isMyReviewsPage &&
  !isMyScrapsPage &&
  !isSearchPage &&
  !isNotificationsPage &&
  !isCommentReplyPage) ||
  isNoticeDetailPage) && (
```

`!isSearchPage` 뒤에 `!isBoardSearchPage &&` 추가:
```tsx
{((!isFormPage &&
  !isWishPage &&
  !isMyEditPage &&
  !isMyPage &&
  !isPackageReviewsPage &&
  !isMyReviewsPage &&
  !isMyScrapsPage &&
  !isSearchPage &&
  !isBoardSearchPage &&
  !isNotificationsPage &&
  !isCommentReplyPage) ||
  isNoticeDetailPage) && (
```

- [ ] **Step 4: 검색 버튼 링크 분기 처리**

기존:
```tsx
{(isMainPage || isBoardPage || isSearchPage) && (
  <Link
    href="/search"
    aria-label={t("common.search")}
    className="cursor-pointer inline-flex"
  >
    <SearchIcon color="white" />
  </Link>
)}
```

아래로 교체:
```tsx
{(isMainPage || isBoardPage || isBoardSearchPage || isSearchPage) && (
  <Link
    href={isBoardPage || isBoardSearchPage ? "/board/search" : "/search"}
    aria-label={t("common.search")}
    className="cursor-pointer inline-flex"
  >
    <SearchIcon color="white" />
  </Link>
)}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/common/Header.tsx
git commit -m "feat: route board search button to /board/search"
```

---

## 최종 확인

구현 완료 후 아래 경로/동작을 브라우저에서 직접 확인:

1. `/board` 진입 → 헤더 검색 아이콘 클릭 → `/board/search`로 이동
2. `/board/community/[id]` 진입 → 검색 아이콘 클릭 → `/board/search`로 이동
3. `/board/search` 진입 → 헤더 타이틀 "검색" 표시, 로고 없음
4. 검색어 입력 → 300ms 후 API 호출 → 커뮤니티 배지 달린 결과 카드 표시
5. 결과 없을 때 → "검색 결과가 없습니다" 표시
6. 검색어 없을 때 → 빈 화면 (API 호출 없음)
7. `/` 메인 → 검색 아이콘 → 기존 `/search` (패키지 검색) 유지 확인
