# Community Search Page Design

**Date:** 2026-06-10

## Overview

`/board` 하위 페이지에서 헤더 검색 버튼을 누르면 커뮤니티 게시글 전용 검색 페이지(`/board/search`)로 이동한다. 검색어를 서버에 `query` 파라미터로 전달해 결과를 무한스크롤로 보여준다. 공지글 검색은 별도 TODO로 남긴다.

## Scope

- `/board/search` 신규 페이지 생성
- `GET /boards/community/posts` API에 `query` 파라미터 추가 (프론트엔드 레이어)
- Header: board 페이지에서 검색 버튼 → `/board/search`로 변경
- 공지글 검색: TODO 주석 처리

## Architecture

### 1. API Layer — `src/api/community.ts`

`GetCommunityPostsParams`에 `query?: string` 필드 추가.

```ts
export interface GetCommunityPostsParams {
  cursor?: string;
  size?: number;
  tag?: string;
  query?: string; // 추가
}
```

`getCommunityPosts` 함수에서 `query` 값이 있으면 URLSearchParams에 append.

### 2. Query Layer — `src/queries/useCommunityQueries.ts`

기존 `useInfiniteCommunityPosts`가 `Omit<GetCommunityPostsParams, "cursor">`를 받으므로 `query` 파라미터가 자동으로 지원됨. 별도 hook 추가 불필요.

### 3. New Page — `src/app/board/search/page.tsx`

**검색 바**

- 기존 `/search` 페이지와 동일한 스타일 (`bg-[#2E3033] border border-[#3E4043]`)
- debounce 300ms 후 쿼리 파라미터에 반영

**검색 전 상태**

- 빈 화면 (기본 노출 콘텐츠 없음)

**검색 결과**

- `useInfiniteCommunityPosts({ query, size: 20 })` 사용
- 기존 `PostCard` 재사용, 카드 상단에 **"커뮤니티"** 배지 추가 (회색 border, caption-md)
- 결과 없을 때: "검색 결과가 없습니다" 텍스트
- 무한스크롤: IntersectionObserver로 하단 감지 시 `fetchNextPage`

**공지글 TODO**

```ts
// TODO: 공지글 검색 추가 예정 (GET /boards/announcements에 query 파라미터 지원 시)
```

### 4. Header — `src/components/common/Header.tsx`

- `isBoardPage` 조건에서 검색 링크를 `/board/search`로 변경
- `/board/search` 경로 감지(`isBoardSearchPage`) 추가
- 헤더 타이틀: `isBoardSearchPage`일 때 "검색" 표시 (기존 `isSearchPage`와 동일 처리)
- 기존 `/search` 페이지의 검색 버튼은 그대로 `/search` 유지

## Data Flow

```
User types query
  → debounce 300ms
  → useInfiniteCommunityPosts({ query })
  → GET /boards/community/posts?query=...&size=20
  → render PostCard list with "커뮤니티" badge
  → scroll to bottom → fetchNextPage
```

## Out of Scope

- 공지글 검색 (TODO)
- 기존 `/search` 패키지 검색 변경 없음
