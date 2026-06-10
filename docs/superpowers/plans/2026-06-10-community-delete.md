# Community Delete 기능 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 커뮤니티 게시글/댓글/답글에 본인 삭제 기능(... 메뉴)과 관리자 삭제 패널을 추가한다.

**Architecture:** 공통 `KebabMenu` 컴포넌트로 `...` 드롭다운을 구현하고, `ReplyCommentCard`·`TopLevelComment`·게시글 헤더에 주입한다. 관리자 패널은 `AdminCommunityPanel`로 신규 생성해 기존 Announcements 패턴을 그대로 따른다. 삭제 API·React Query 훅은 이미 존재하므로 UI 연결만 하면 된다.

**Tech Stack:** Next.js 14 App Router, React Query, Zustand (useAuthStore), Tailwind CSS, shadcn/ui (Button, Dialog)

---

## File Map

| 상태 | 파일                                                        | 역할                                     |
| ---- | ----------------------------------------------------------- | ---------------------------------------- |
| 신규 | `src/components/community/KebabMenu.tsx`                    | `...` 버튼 + 삭제 드롭다운 공통 컴포넌트 |
| 수정 | `src/components/community/ReplyCommentCard.tsx`             | `onDelete` prop 추가                     |
| 수정 | `src/app/board/community/[id]/page.tsx`                     | 게시글·최상위 댓글 삭제 연결             |
| 수정 | `src/app/board/community/[id]/comment/[commentId]/page.tsx` | 부모 댓글·답글 삭제 연결                 |
| 신규 | `src/components/admin/AdminCommunityPanel.tsx`              | 관리자 게시글/댓글 삭제 패널             |
| 수정 | `src/app/admin/page.tsx`                                    | 커뮤니티 탭 추가                         |

---

### Task 1: KebabMenu 공통 컴포넌트

**Files:**

- Create: `src/components/community/KebabMenu.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface KebabMenuProps {
  onDelete: () => void;
}

export function KebabMenu({ onDelete }: KebabMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={e => {
          e.stopPropagation();
          setOpen(v => !v);
        }}
        className="w-7 h-7 flex items-center justify-center text-gray_1 hover:text-white rounded-full hover:bg-white/10"
        aria-label="더보기"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-30 min-w-[80px] rounded-lg bg-gray-800 border border-gray-600 shadow-lg py-1">
          <button
            onClick={e => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

```bash
cd /Users/jiho/Documents/GitHub/beauty-service-interface && npx tsc --noEmit 2>&1 | head -20
```

에러 없으면 통과.

- [ ] **Step 3: 커밋**

```bash
git add src/components/community/KebabMenu.tsx
git commit -m "feat: add KebabMenu component for community delete actions"
```

---

### Task 2: ReplyCommentCard에 onDelete 연결

**Files:**

- Modify: `src/components/community/ReplyCommentCard.tsx`

현재 파일 내용 (linter 적용 후):

```tsx
// 현재 interface
interface ReplyCommentCardProps {
  comment: CommunityCommentView;
  deletedLabel?: string;
  onClick?: () => void;
}
```

- [ ] **Step 1: `onDelete` prop 추가 및 KebabMenu 렌더링**

`src/components/community/ReplyCommentCard.tsx` 전체를 다음으로 교체:

```tsx
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { CommunityCommentView } from "@/api/community";
import { KebabMenu } from "@/components/community/KebabMenu";

function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), {
    addSuffix: true,
    locale: ko,
  });
}

function Avatar() {
  return (
    <div className="rounded-full flex-shrink-0 bg-gray-container flex items-center justify-center overflow-hidden w-6 h-6">
      <Image
        src="/main-icon.png"
        alt=""
        width={24}
        height={24}
        className="object-contain"
      />
    </div>
  );
}

interface ReplyCommentCardProps {
  comment: CommunityCommentView;
  deletedLabel?: string;
  onClick?: () => void;
  onDelete?: () => void;
}

export function ReplyCommentCard({
  comment,
  deletedLabel = "삭제된 답글입니다.",
  onClick,
  onDelete,
}: ReplyCommentCardProps) {
  if (comment.isDeleted) {
    return (
      <li className="ml-10">
        <div className="rounded-2xl bg-gray-container px-4 py-3">
          <p className="caption-md text-gray_1">{deletedLabel}</p>
        </div>
      </li>
    );
  }

  return (
    <li className="ml-10">
      <div
        className={`rounded-2xl bg-gray-container px-4 py-3 ${onClick ? "cursor-pointer active:opacity-80 transition-opacity" : ""}`}
        onClick={onClick}
      >
        <div className="flex gap-3 items-start">
          <Avatar />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                <p className="caption-md text-white font-semibold leading-tight">
                  {comment.authorDisplayName}
                </p>
                <p className="caption-sm text-gray-2 mt-0.5">
                  {timeAgo(comment.createdAt)}
                </p>
              </div>
              {onDelete && <KebabMenu onDelete={onDelete} />}
            </div>
            <p className="text-md text-white break-keep leading-relaxed mt-1">
              {comment.content}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
```

- [ ] **Step 2: 타입 체크**

```bash
cd /Users/jiho/Documents/GitHub/beauty-service-interface && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: 커밋**

```bash
git add src/components/community/ReplyCommentCard.tsx
git commit -m "feat: add onDelete prop to ReplyCommentCard"
```

---

### Task 3: 게시글 상세 페이지 — 게시글 삭제

**Files:**

- Modify: `src/app/board/community/[id]/page.tsx`

`user.id`는 `string`, `post.authorId`는 `number`이므로 `parseInt(user.id, 10) === post.authorId`로 비교한다.

- [ ] **Step 1: import 추가**

파일 상단 import 블록을 다음과 같이 수정 (기존 import에 추가):

```tsx
import {
  useCommunityPostDetail,
  usePostComments,
  useTogglePostLike,
  useTogglePostBookmark,
  useCreatePostComment,
  useDeleteCommunityPost,
  useDeletePostComment,
} from "@/queries/useCommunityQueries";
import { useAuthStore } from "@/store/useAuthStore";
import { KebabMenu } from "@/components/community/KebabMenu";
```

- [ ] **Step 2: `CommunityDetailPage` 컴포넌트에 훅·핸들러 추가**

기존 훅 선언들 아래에 추가 (아래 코드를 `const [likeCount, ...` 앞에 삽입):

```tsx
const { user } = useAuthStore();
const deletePost = useDeleteCommunityPost();
const deleteComment = useDeletePostComment();

const isMyContent = (authorId: number) =>
  !!user && parseInt(user.id, 10) === authorId;

function handleDeletePost() {
  if (!postId || !confirm("게시글을 삭제할까요?")) return;
  deletePost.mutate(postId, {
    onSuccess: () => router.back(),
  });
}

function handleDeleteComment(commentId: number) {
  if (!postId || !confirm("댓글을 삭제할까요?")) return;
  deleteComment.mutate({ postId, commentId });
}
```

- [ ] **Step 3: 게시글 헤더 영역에 KebabMenu 추가**

`{/* Author */}` 섹션의 author 블록을 찾아 수정:

```tsx
{
  /* Author */
}
<div className="flex items-start gap-3 mt-3">
  <div className="rounded-full flex-shrink-0 w-10 h-10 bg-gray-container flex items-center justify-center overflow-hidden">
    <Image
      src="/main-icon.png"
      alt=""
      width={40}
      height={40}
      className="object-contain"
    />
  </div>
  <div className="min-w-0 flex-1">
    <p className="text-md text-white font-medium">{post.authorDisplayName}</p>
    <p className="caption-md text-gray_1 mt-0.5">
      {format(new Date(post.createdAt), "yy.MM.dd HH:mm")}
    </p>
  </div>
  {isMyContent(post.authorId) && <KebabMenu onDelete={handleDeletePost} />}
</div>;
```

- [ ] **Step 4: 타입 체크**

```bash
cd /Users/jiho/Documents/GitHub/beauty-service-interface && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: 커밋**

```bash
git add src/app/board/community/\[id\]/page.tsx
git commit -m "feat: add delete button to community post"
```

---

### Task 4: 게시글 상세 페이지 — 최상위 댓글 삭제

**Files:**

- Modify: `src/app/board/community/[id]/page.tsx`
- Modify: `TopLevelComment` 함수 컴포넌트

- [ ] **Step 1: `TopLevelComment` props에 `onDelete` 추가**

```tsx
function TopLevelComment({
  comment,
  replyCount,
  onReply,
  onDelete,
  t,
}: {
  comment: CommunityCommentView;
  replyCount: number;
  onReply: (comment: CommunityCommentView) => void;
  onDelete?: () => void;
  t: (key: string) => string;
}) {
  if (comment.isDeleted) {
    return (
      <li className="py-3">
        <p className="caption-md text-gray_1 italic">
          {t("communityPage.deletedComment")}
        </p>
      </li>
    );
  }

  return (
    <li>
      <div className="flex gap-3">
        <Avatar size={64} />
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-start justify-between gap-1">
            <p className="text-sm text-white font-semibold leading-tight">
              {comment.authorDisplayName}
            </p>
            {onDelete && <KebabMenu onDelete={onDelete} />}
          </div>
          <p className="text-sm text-white mt-1 break-keep leading-relaxed">
            {comment.content}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2 ml-1">
        <span className="caption-md text-gray_1">
          {format(new Date(comment.createdAt), "yy.MM.dd  HH:mm")}
        </span>
        <button
          onClick={() => onReply(comment)}
          className="flex items-center gap-1.5 caption-md text-gray_1 hover:text-white transition-colors"
        >
          <ChatBubbleIcon width={11} height={11} color="#bcbcbc" />
          <span className="text-[11px]">
            {replyCount === 0 ? "답글쓰기" : replyCount}
          </span>
        </button>
      </div>
    </li>
  );
}
```

- [ ] **Step 2: 렌더링 부분에서 `onDelete` 전달**

`comments.map` 안의 `TopLevelComment` 호출에 `onDelete` 추가:

```tsx
<TopLevelComment
  key={comment.commentId}
  comment={comment}
  replyCount={replyCount}
  onReply={handleReply}
  onDelete={
    isMyContent(comment.authorId)
      ? () => handleDeleteComment(comment.commentId)
      : undefined
  }
  t={t}
/>
```

- [ ] **Step 3: 렌더링 부분에서 `ReplyCommentCard`에 `onDelete` 전달**

```tsx
<ReplyCommentCard
  key={comment.commentId}
  comment={comment}
  deletedLabel={t("communityPage.deletedComment")}
  onClick={() => handleReply(comment)}
  onDelete={
    isMyContent(comment.authorId)
      ? () => handleDeleteComment(comment.commentId)
      : undefined
  }
/>
```

- [ ] **Step 4: 타입 체크**

```bash
cd /Users/jiho/Documents/GitHub/beauty-service-interface && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: 커밋**

```bash
git add src/app/board/community/\[id\]/page.tsx
git commit -m "feat: add delete button to community comments and replies"
```

---

### Task 5: 답글 상세 페이지 — 삭제 연결

**Files:**

- Modify: `src/app/board/community/[id]/comment/[commentId]/page.tsx`

- [ ] **Step 1: import 추가**

기존 import에 아래를 추가:

```tsx
import { useDeletePostComment } from "@/queries/useCommunityQueries";
import { useAuthStore } from "@/store/useAuthStore";
```

- [ ] **Step 2: `ParentCommentCard`에 `onDelete` prop 추가**

```tsx
function ParentCommentCard({
  comment,
  onDelete,
}: {
  comment: CommunityCommentView;
  onDelete?: () => void;
}) {
  return (
    <div className="px-4 py-4 border-b border-gray-outline">
      <div className="flex gap-3">
        <Avatar size={64} />
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-start justify-between gap-1">
            <p className="text-sm text-white font-semibold leading-tight">
              {comment.authorDisplayName}
            </p>
            {onDelete && <KebabMenu onDelete={onDelete} />}
          </div>
          <p className="text-sm text-white mt-1 break-keep leading-relaxed">
            {comment.content}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2 ml-1">
        <span className="caption-md text-gray_1">
          {format(new Date(comment.createdAt), "yy.MM.dd  HH:mm")}
        </span>
        <div className="flex items-center gap-1.5 caption-md text-gray_1">
          <ChatBubbleIcon width={11} height={11} color="#bcbcbc" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: `CommentReplyPage`에 훅·핸들러 추가**

`const createComment = useCreatePostComment();` 아래에 추가:

```tsx
const { user } = useAuthStore();
const deleteComment = useDeletePostComment();

const isMyContent = (authorId: number) =>
  !!user && parseInt(user.id, 10) === authorId;

function handleDeleteComment(commentId: number) {
  if (!postId || !confirm("댓글을 삭제할까요?")) return;
  deleteComment.mutate({ postId, commentId });
}
```

- [ ] **Step 4: `ParentCommentCard` 렌더링에 `onDelete` 전달**

```tsx
<ParentCommentCard
  comment={parentComment}
  onDelete={
    isMyContent(parentComment.authorId)
      ? () => handleDeleteComment(parentComment.commentId)
      : undefined
  }
/>
```

- [ ] **Step 5: 답글 목록 `ReplyCommentCard`에 `onDelete` 전달**

```tsx
{
  replies.map(reply => (
    <ReplyCommentCard
      key={reply.commentId}
      comment={reply}
      onDelete={
        isMyContent(reply.authorId)
          ? () => handleDeleteComment(reply.commentId)
          : undefined
      }
    />
  ));
}
```

- [ ] **Step 6: KebabMenu import 추가**

파일 상단에:

```tsx
import { KebabMenu } from "@/components/community/KebabMenu";
```

- [ ] **Step 7: 타입 체크**

```bash
cd /Users/jiho/Documents/GitHub/beauty-service-interface && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 8: 커밋**

```bash
git add src/app/board/community/\[id\]/comment/\[commentId\]/page.tsx
git commit -m "feat: add delete buttons to reply detail page"
```

---

### Task 6: AdminCommunityPanel 생성

**Files:**

- Create: `src/components/admin/AdminCommunityPanel.tsx`

게시글 목록 무한스크롤 + 행 클릭 시 댓글/답글 확장 표시. 각 항목에 삭제 버튼.

- [ ] **Step 1: 파일 생성**

```tsx
"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  useInfiniteCommunityPosts,
  usePostComments,
  useDeleteCommunityPost,
  useDeletePostComment,
} from "@/queries/useCommunityQueries";
import type { ApiError } from "@/lib/apiClient";

function communityMutationMessage(error: unknown): string {
  const e = error as ApiError | undefined;
  if (e?.status === 403) return "관리자 권한이 필요합니다.";
  if (e?.status === 404) return "리소스를 찾을 수 없습니다.";
  return e?.message ?? "요청에 실패했습니다.";
}

function CommentRows({ postId }: { postId: number }) {
  const { data: comments = [], isLoading } = usePostComments(postId);
  const deleteComment = useDeletePostComment();

  if (isLoading) {
    return (
      <tr>
        <td colSpan={4} className="px-4 py-2 text-xs text-gray-500">
          댓글 불러오는 중...
        </td>
      </tr>
    );
  }

  if (comments.length === 0) {
    return (
      <tr>
        <td colSpan={4} className="px-4 py-2 text-xs text-gray-500">
          댓글 없음
        </td>
      </tr>
    );
  }

  return (
    <>
      {comments.map(c => (
        <tr
          key={c.commentId}
          className="border-t border-gray-700/50 bg-gray-900/40"
        >
          <td className="pl-8 pr-2 py-2 text-xs text-gray-400">
            {c.isReply ? "↳ 답글" : "댓글"}
          </td>
          <td className="px-2 py-2 text-xs text-gray-300">
            {c.isDeleted ? (
              <span className="italic text-gray-600">삭제됨</span>
            ) : (
              <span className="line-clamp-1">{c.content}</span>
            )}
          </td>
          <td className="px-2 py-2 text-xs text-gray-500">
            {c.authorDisplayName}
          </td>
          <td className="px-2 py-2 text-right">
            {!c.isDeleted && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-6 text-xs text-red-300 px-2"
                disabled={deleteComment.isPending}
                onClick={() => {
                  if (!confirm("이 댓글을 삭제할까요?")) return;
                  deleteComment.mutate(
                    { postId, commentId: c.commentId },
                    { onError: err => alert(communityMutationMessage(err)) }
                  );
                }}
              >
                삭제
              </Button>
            )}
          </td>
        </tr>
      ))}
    </>
  );
}

export function AdminCommunityPanel() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCommunityPosts({ size: 20 });

  const posts = useMemo(
    () => (data?.pages ?? []).flatMap(p => p.posts),
    [data?.pages]
  );

  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const deletePost = useDeleteCommunityPost();

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        커뮤니티 게시글/댓글 관리 (관리자)
      </p>

      {isLoading ? (
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-sm">게시글이 없습니다.</p>
      ) : (
        <div className="rounded-lg border border-gray-600 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="text-left p-2">제목</th>
                <th className="text-left p-2 w-24 hidden sm:table-cell">
                  작성자
                </th>
                <th className="text-left p-2 w-20 hidden sm:table-cell">
                  댓글
                </th>
                <th className="text-right p-2 w-24">작업</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <React.Fragment key={post.postId}>
                  <tr
                    className="border-t border-gray-700 hover:bg-gray-800/50 cursor-pointer"
                    onClick={() =>
                      setExpandedPostId(v =>
                        v === post.postId ? null : post.postId
                      )
                    }
                  >
                    <td className="p-2">
                      <div className="font-medium text-white truncate max-w-[160px]">
                        {expandedPostId === post.postId ? "▾ " : "▸ "}
                        {post.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(() => {
                          try {
                            return format(
                              new Date(post.createdAt),
                              "yyyy.MM.dd HH:mm"
                            );
                          } catch {
                            return post.createdAt;
                          }
                        })()}
                      </div>
                    </td>
                    <td className="p-2 text-gray-400 hidden sm:table-cell">
                      {post.authorDisplayName}
                    </td>
                    <td className="p-2 text-gray-400 hidden sm:table-cell">
                      {post.commentCount}
                    </td>
                    <td className="p-2 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8 text-red-300"
                        disabled={deletePost.isPending}
                        onClick={e => {
                          e.stopPropagation();
                          if (!confirm("이 게시글을 삭제할까요?")) return;
                          deletePost.mutate(post.postId, {
                            onError: err =>
                              alert(communityMutationMessage(err)),
                          });
                        }}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                  {expandedPostId === post.postId && (
                    <CommentRows postId={post.postId} />
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasNextPage && (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
        </Button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

```bash
cd /Users/jiho/Documents/GitHub/beauty-service-interface && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: 커밋**

```bash
git add src/components/admin/AdminCommunityPanel.tsx
git commit -m "feat: add AdminCommunityPanel for post and comment management"
```

---

### Task 7: 관리자 페이지에 커뮤니티 탭 추가

**Files:**

- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: import 추가**

파일 상단의 import 목록에 추가:

```tsx
import { AdminCommunityPanel } from "@/components/admin/AdminCommunityPanel";
```

- [ ] **Step 2: TabsTrigger 추가**

기존 `<TabsTrigger value="tour-surveys" ...>설문 관리</TabsTrigger>` 바로 다음에 추가:

```tsx
<TabsTrigger value="community" className={adminTabTriggerClass}>
  커뮤니티
</TabsTrigger>
```

- [ ] **Step 3: TabsContent 추가**

기존 `<TabsContent value="tour-surveys" ...>` 바로 다음에 추가:

```tsx
<TabsContent value="community" className="mt-6">
  <AdminCommunityPanel />
</TabsContent>
```

- [ ] **Step 4: 타입 체크**

```bash
cd /Users/jiho/Documents/GitHub/beauty-service-interface && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: 커밋**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add community tab to admin page"
```
