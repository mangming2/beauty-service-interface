# 커뮤니티 카테고리 필수화 + 전체 탭 + 본문 하이퍼링크 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 커뮤니티 글쓰기 시 카테고리(태그) 선택을 필수화하고, 목록 페이지에 태그 필터 없이 전체 글을 보는 "전체" 탭을 기본 탭으로 추가하고, 게시글/공지사항 상세 본문의 URL을 클릭 가능한 링크로 렌더링한다.

**Architecture:** 세 변경 모두 기존 컴포넌트에 대한 국소적 수정이다. 새 파일은 URL 링크화를 위한 순수 유틸 `src/lib/linkify.tsx` 하나뿐이며, 나머지는 기존 write/list/detail 페이지 로직에 조건을 추가하거나 렌더링 분기를 바꾸는 수준이다. 백엔드는 이미 `tag` 파라미터 생략 시 전체 글을 반환하므로 API/백엔드 변경은 없다.

**Tech Stack:** Next.js (App Router) + React 19 + TypeScript(strict) + Tailwind. 상태관리는 로컬 `useState` + TanStack Query(`useInfiniteCommunityPosts`).

## Global Constraints

- 이 저장소에는 자동화된 테스트 러너가 설정되어 있지 않다(jest/vitest 등 없음, `package.json`에 test 스크립트 없음). 각 태스크의 검증은 `npx tsc --noEmit`(타입 체크)과 `npm run dev` 실행 후 브라우저 수동 확인으로 대체한다. 새로 테스트 프레임워크를 도입하지 않는다(스펙 범위 밖).
- 하이퍼링크 색상: `text-primary` (전역 토큰 `--primary: #f92595`, `src/app/globals.css:86`)를 그대로 사용한다. 새 색상 값을 하드코딩하지 않는다.
- 글쓰기 화면의 `PRESET_TAGS`에는 "전체"를 추가하지 않는다 ("전체"는 목록 페이지 필터 전용 개념).
- 댓글/답글 본문에는 하이퍼링크를 적용하지 않는다. 게시글 본문(커뮤니티 상세, 공지사항 상세)에만 적용한다.
- 외부 라이브러리(linkifyjs 등)를 추가하지 않고 정규식 기반으로 직접 구현한다.

---

### Task 1: 글쓰기 화면 — 카테고리 필수 선택

**Files:**
- Modify: `src/app/board/community/write/page.tsx:53-54` (`handleSubmit` 가드), `src/app/board/community/write/page.tsx:85-91` (Complete 버튼), `src/app/board/community/write/page.tsx:94-114` (카테고리 섹션)

**Interfaces:**
- Consumes: 기존 `selectedTags: string[]` state (line 32), `toggleTag` (line 36-40) — 변경 없음.
- Produces: 없음 (다른 태스크가 의존하는 새 export 없음).

- [ ] **Step 1: Complete 버튼 disabled 조건에 카테고리 미선택 추가**

`src/app/board/community/write/page.tsx:85-91`을 다음으로 교체:

```tsx
        <button
          onClick={handleSubmit}
          disabled={
            !title.trim() ||
            !content.trim() ||
            selectedTags.length === 0 ||
            createPost.isPending
          }
          className="text-white text-md font-medium disabled:opacity-40"
        >
          Complete
        </button>
```

- [ ] **Step 2: `handleSubmit` 가드에 동일 조건 추가**

`src/app/board/community/write/page.tsx:53-54`을 다음으로 교체:

```tsx
  async function handleSubmit() {
    if (!title.trim() || !content.trim() || selectedTags.length === 0) return;
```

- [ ] **Step 3: 카테고리 미선택 안내 문구 추가**

`src/app/board/community/write/page.tsx:94-114` (Category 섹션 전체)을 다음으로 교체:

```tsx
      {/* Category */}
      <div className="px-5 pt-2 pb-4">
        <p className="text-lg font-bold text-white mb-3">
          카테고리를 선택해주세요
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                selectedTags.includes(tag)
                  ? "bg-pink-font border-pink-font text-white"
                  : "bg-transparent border-gray-outline text-gray_1"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {selectedTags.length === 0 && (
          <p className="mt-2 caption-md text-red-400">
            카테고리를 1개 이상 선택해주세요
          </p>
        )}
      </div>
```

- [ ] **Step 4: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 5: 브라우저 수동 확인**

Run: `npm run dev` 후 `http://localhost:3000/board/community/write` 접속.

확인 항목:
- 제목/내용만 입력하고 카테고리를 아무것도 선택하지 않으면: Complete 버튼이 비활성(반투명)이고, 카테고리 섹션 아래 "카테고리를 1개 이상 선택해주세요" 빨간 문구가 보인다.
- 태그를 1개 이상 선택하면: 문구가 사라지고 Complete 버튼이 활성화된다.
- 활성화 상태에서 등록하면 기존과 동일하게 게시글이 생성되고 상세 페이지로 이동한다.

- [ ] **Step 6: Commit**

```bash
git add src/app/board/community/write/page.tsx
git commit -m "feat: 커뮤니티 글쓰기 카테고리 선택 필수화"
```

---

### Task 2: URL 링크화 유틸 생성 + 커뮤니티 상세 본문 적용

**Files:**
- Create: `src/lib/linkify.tsx`
- Modify: `src/app/board/community/[id]/page.tsx:1-30` (import 추가), `src/app/board/community/[id]/page.tsx:241-244` (본문 렌더링)

**Interfaces:**
- Produces: `linkifyText(text: string): ReactNode[]` — export from `src/lib/linkify.tsx`. Task 3이 그대로 import해서 재사용한다.

- [ ] **Step 1: `src/lib/linkify.tsx` 작성**

```tsx
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
```

- [ ] **Step 2: 커뮤니티 상세 페이지에서 사용하도록 import 추가**

`src/app/board/community/[id]/page.tsx`의 기존 import 블록(파일 최상단, `import { getSafeImageSrc } from "@/lib/utils";` 다음 줄) 뒤에 추가:

```tsx
import { linkifyText } from "@/lib/linkify";
```

- [ ] **Step 3: 본문 렌더링을 linkifyText로 교체**

`src/app/board/community/[id]/page.tsx:241-244`을 다음으로 교체:

```tsx
        {/* Content */}
        <div className="mt-4 text-md text-white leading-relaxed whitespace-pre-wrap">
          {linkifyText(post.content)}
        </div>
```

- [ ] **Step 4: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 5: 브라우저 수동 확인**

Run: `npm run dev` 후, `/board/community/write`에서 본문에 `테스트 www.naver.com 링크 확인 https://google.com 끝` 같은 텍스트를 포함한 글을 카테고리 1개 선택 후 등록.

확인 항목:
- 생성된 게시글 상세(`/board/community/[id]`)에서 `www.naver.com`과 `https://google.com` 부분만 핑크색(`#f92595`) 밑줄 텍스트로 렌더링되고, 클릭 시 새 탭에서 각각 `https://www.naver.com`, `https://google.com`으로 열린다.
- 나머지 일반 텍스트("테스트", "링크 확인", "끝")는 기존과 동일하게 흰색 일반 텍스트로 보인다.
- URL이 없는 기존 게시글은 렌더링에 변화가 없다.

- [ ] **Step 6: Commit**

```bash
git add src/lib/linkify.tsx src/app/board/community/\[id\]/page.tsx
git commit -m "feat: 커뮤니티 게시글 상세 본문 URL 하이퍼링크 처리"
```

---

### Task 3: 공지사항 상세 본문에도 동일 적용

**Files:**
- Modify: `src/app/board/notice/[id]/page.tsx:1-9` (import 추가), `src/app/board/notice/[id]/page.tsx:67-69` (본문 렌더링)

**Interfaces:**
- Consumes: `linkifyText` from `src/lib/linkify.tsx` (Task 2에서 생성).

- [ ] **Step 1: import 추가**

`src/app/board/notice/[id]/page.tsx`의 `import { getSafeImageSrc } from "@/lib/utils";` 다음 줄에 추가:

```tsx
import { linkifyText } from "@/lib/linkify";
```

- [ ] **Step 2: 본문 렌더링을 linkifyText로 교체**

`src/app/board/notice/[id]/page.tsx:67-69`을 다음으로 교체:

```tsx
      <div className="mt-4 text-[14px] font-normal text-white leading-relaxed whitespace-pre-wrap">
        {linkifyText(post.content)}
      </div>
```

- [ ] **Step 3: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 4: 브라우저 수동 확인**

Run: `npm run dev` 후 기존 공지사항 목록(`/board`, Notice 탭)에서 URL을 포함한 공지가 있으면 상세 페이지에서 링크가 정상 렌더링되는지 확인. URL을 포함한 기존 공지가 없다면, 공지 본문에 URL이 없는 경우 렌더링이 기존과 동일하게 유지되는지(회귀 없음)만 확인한다 — 링크화 자체는 Task 2에서 이미 동일 함수로 검증됨.

- [ ] **Step 5: Commit**

```bash
git add src/app/board/notice/\[id\]/page.tsx
git commit -m "feat: 공지사항 상세 본문 URL 하이퍼링크 처리"
```

---

### Task 4: 목록 페이지 "전체" 탭 추가 + 기본 탭 변경

**Files:**
- Modify: `src/app/board/page.tsx:29-34` (`COMMUNITY_CATEGORIES`), `src/app/board/page.tsx:115-118` (`TaggedCommunityTab`), `src/app/board/page.tsx:171, 198-202` (`CommunityTab`)
- Modify: `src/locales/translations.ts` (4개 `communityPage` 블록: Ko, En, Jp, ZH)

**Interfaces:**
- Consumes: 기존 `useInfiniteCommunityPosts(params: Omit<GetCommunityPostsParams, "cursor"> = {})` — `tag`는 이미 optional이라 `undefined`로 호출 가능(`src/api/community.ts:46`, `GetCommunityPostsParams.tag?: string`).
- Produces: 없음.

- [ ] **Step 1: `COMMUNITY_CATEGORIES`에 "전체" 항목 추가**

`src/app/board/page.tsx:29-34`을 다음으로 교체:

```tsx
const COMMUNITY_CATEGORIES = [
  { id: "all", label: "communityPage.all", isHot: false },
  { id: "hot", label: "communityPage.hot", isHot: true },
  { id: "Recruiting", label: "communityPage.recruiting", isHot: false },
  { id: "K-pop News", label: "communityPage.kpopNews", isHot: false },
  { id: "K-Beauty", label: "communityPage.kbeauty", isHot: false },
] as const;
```

- [ ] **Step 2: `TaggedCommunityTab`의 `tag`를 optional로 변경**

`src/app/board/page.tsx:115-118`을 다음으로 교체:

```tsx
function TaggedCommunityTab({ tag }: { tag?: string }) {
  const { t } = useTranslation();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteCommunityPosts({ tag, size: 20 });
```

- [ ] **Step 3: 기본 활성 탭을 "all"로 변경**

`src/app/board/page.tsx:171`을 다음으로 교체:

```tsx
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
```

- [ ] **Step 4: 렌더링 분기에서 "all"이면 tag 없이 호출**

`src/app/board/page.tsx:198-202`을 다음으로 교체:

```tsx
        {activeCat.isHot ? (
          <HotCommunityTab />
        ) : (
          <TaggedCommunityTab
            tag={activeCategory === "all" ? undefined : activeCategory}
          />
        )}
```

- [ ] **Step 5: 4개 로케일에 `communityPage.all` 라벨 추가**

`src/locales/translations.ts`에서 Ko 블록(`writePost: "글쓰기",`로 식별)을 찾아 교체:

```ts
    communityPage: {
      all: "전체",
      hot: "Hot",
      recruiting: "Recruiting",
      kpopNews: "K-pop News",
      kbeauty: "K-Beauty",
      writePost: "글쓰기",
```

En 블록(`writePost: "Write",`로 식별)을 찾아 교체:

```ts
    communityPage: {
      all: "All",
      hot: "Hot",
      recruiting: "Recruiting",
      kpopNews: "K-pop News",
      kbeauty: "K-Beauty",
      writePost: "Write",
```

Jp 블록(`writePost: "投稿する",`로 식별)을 찾아 교체:

```ts
    communityPage: {
      all: "すべて",
      hot: "Hot",
      recruiting: "Recruiting",
      kpopNews: "K-pop News",
      kbeauty: "K-Beauty",
      writePost: "投稿する",
```

ZH 블록(`writePost: "发帖",`로 식별)을 찾아 교체:

```ts
    communityPage: {
      all: "全部",
      hot: "热门",
      recruiting: "招募",
      kpopNews: "K-pop新闻",
      kbeauty: "K-美妆",
      writePost: "发帖",
```

- [ ] **Step 6: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 7: 브라우저 수동 확인**

Run: `npm run dev` 후 `http://localhost:3000/board?tab=community` 접속.

확인 항목:
- 탭 순서가 [전체, 🔥Hot, Recruiting, K-pop News, K-Beauty]이고 "전체"가 기본 선택 상태로 보인다.
- "전체" 탭에는 태그 필터 없이 최신순 전체 글이 무한 스크롤로 로드된다(카테고리 없이 등록된 글도 포함되어야 함 — Task 1 이전에 등록된 무태그 글이 있다면 여기서만 보이는지 확인).
- hot/Recruiting/K-pop News/K-Beauty 탭은 기존과 동일하게 동작한다.
- 언어 설정을 En/Jp/ZH로 바꿔도 "전체" 탭 라벨이 각 언어로 정상 표시된다.

- [ ] **Step 8: Commit**

```bash
git add src/app/board/page.tsx src/locales/translations.ts
git commit -m "feat: 커뮤니티 목록에 전체 탭 추가 및 기본 탭 변경"
```
