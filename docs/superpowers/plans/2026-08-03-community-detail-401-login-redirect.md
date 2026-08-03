# 커뮤니티 상세 401 → 로그인 리다이렉트(returnTo) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 커뮤니티 게시글 상세에서 세션 만료로 401이 발생하면 `notFound()` 대신 `/login`으로 이동시키고, 로그인 완료 후 원래 보던 게시글로 돌아오게 한다.

**Architecture:** 두 부분으로 나뉜다 — (1) 커뮤니티 상세 페이지가 401을 다른 에러와 분리해 `/login?returnTo=<원래 경로>`로 리다이렉트, (2) 로그인 완료 경로(구글 OAuth 왕복 + 이미-로그인 상태 자동 이동)가 `returnTo`를 받아 `sessionStorage`로 중계해 최종적으로 그 경로로 이동. Google OAuth는 `window.location.href`로 백엔드까지 완전히 이탈했다가 `/auth/callback`으로 돌아오므로, 그 구간은 URL 쿼리파라미터가 아니라 `sessionStorage`로 값을 넘긴다.

**Tech Stack:** Next.js App Router, React 19, TypeScript(strict), TanStack Query.

## Global Constraints

- 이 저장소에는 자동화된 테스트 러너가 없다. 검증은 `npx tsc --noEmit` + `npm run dev`로 브라우저 수동 확인.
- 백엔드 변경 없음. OAuth 콜백 URL에 `returnTo`를 직접 실어 보내는 방식은 쓰지 않는다.
- 공지사항 상세 페이지, `middleware.ts`/`ProtectedLayout.tsx`/`apiClient.ts`의 중복 공개 경로 목록 통합은 이번 범위 밖이다.

---

### Task 1: 커뮤니티 상세 401 → `/login?returnTo=...` 리다이렉트

**Files:**
- Modify: `src/app/board/community/[id]/page.tsx:1-31` (import), `src/app/board/community/[id]/page.tsx:113` (훅 구조분해), `src/app/board/community/[id]/page.tsx:154-156` (에러 분기)

**Interfaces:**
- Produces: `/login` 진입 시 사용하는 쿼리파라미터 이름은 정확히 `returnTo`이고 값은 `encodeURIComponent(경로)`로 인코딩된 문자열이다. Task 2는 이 정확한 파라미터 이름과 인코딩 방식을 그대로 소비해야 한다.

- [ ] **Step 1: `ApiError` 타입 import 추가**

`src/app/board/community/[id]/page.tsx:30` (`import type { CommunityCommentView } from "@/api/community";`) 바로 아래에 추가:

```tsx
import type { ApiError } from "@/lib/apiClient";
```

- [ ] **Step 2: `useCommunityPostDetail`에서 `error`도 꺼내기**

`src/app/board/community/[id]/page.tsx:113`을 다음으로 교체:

```tsx
  const { data: post, isLoading, isError, error } = useCommunityPostDetail(postId);
```

- [ ] **Step 3: 401 분기 추가**

`src/app/board/community/[id]/page.tsx:154-156`(현재 `if (isError || !post) { notFound(); }`)을 다음으로 교체:

```tsx
  if (error && (error as ApiError).status === 401) {
    router.replace(
      `/login?returnTo=${encodeURIComponent(window.location.pathname)}`
    );
    return null;
  }

  if (isError || !post) {
    notFound();
  }
```

- [ ] **Step 4: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 5: 브라우저 수동 확인**

Run: `npm run dev` 후, 브라우저 devtools에서 로그인 상태를 만료시키는 방법이 마땅치 않다면 임시로 `getCommunityPostDetail` 호출부(또는 API 응답)를 확인하며 401을 재현하거나, 백엔드/네트워크 탭에서 실제로 401이 오는 시점을 재현해 `/board/community/[id]` 접속 시 `/login?returnTo=%2Fboard%2Fcommunity%2F[id]`로 이동하는지 확인한다. 재현이 어렵다면 최소한 코드가 `error.status === 401`일 때만 이 분기를 타고, 404 등 다른 에러는 여전히 `notFound()`로 가는 것을 코드 레벨에서 확인하고 그 사실을 보고서에 명시한다.

- [ ] **Step 6: Commit**

```bash
git add src/app/board/community/\[id\]/page.tsx
git commit -m "fix: 커뮤니티 상세 401 시 로그인 페이지로 리다이렉트"
```

---

### Task 2: returnTo 유틸 + 로그인/콜백 페이지에서 소비

**Files:**
- Create: `src/lib/postLoginRedirect.ts`
- Modify: `src/app/login/page.tsx` (전체 — `useSearchParams` 도입에 따라 컴포넌트를 Suspense로 감싸는 구조로 변경)
- Modify: `src/app/auth/callback/page.tsx:76` (로그인 완료 후 이동 경로)

**Interfaces:**
- Consumes: `/login?returnTo=<encodeURIComponent된 경로>` — Task 1이 만든 쿼리파라미터 형식.
- Produces: `stashPostLoginRedirect(path: string): void`, `consumePostLoginRedirect(fallback?: string): string` — `src/lib/postLoginRedirect.ts`에서 export. 둘 다 이 태스크 안에서 생성하고 소비한다(다른 태스크가 의존하지 않음).

- [ ] **Step 1: `src/lib/postLoginRedirect.ts` 작성**

```ts
const POST_LOGIN_REDIRECT_KEY = "post_login_redirect";

/** Google OAuth 왕복 동안 살아남아야 하는 로그인 후 이동 경로를 sessionStorage에 잠깐 저장한다 */
export function stashPostLoginRedirect(path: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, path);
}

/** 저장된 경로를 꺼내고 즉시 지운다. 없으면 fallback을 반환한다 */
export function consumePostLoginRedirect(fallback = "/my"): string {
  if (typeof window === "undefined") return fallback;
  const value = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
  sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
  return value || fallback;
}
```

- [ ] **Step 2: 타입 체크 (유틸 단독)**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 3: `src/app/login/page.tsx`를 `useSearchParams` + Suspense 구조로 변경**

Next.js는 `useSearchParams()`를 쓰는 페이지 컴포넌트를 Suspense 경계 없이 정적 렌더링하려 하면 빌드 에러를 낸다(`src/app/auth/callback/page.tsx`가 이미 이 패턴을 쓰고 있다 — line 113-118). 같은 패턴을 따른다.

`src/app/login/page.tsx` 최상단 import 블록(`"use client";` 바로 다음 줄들)을 다음으로 교체:

```tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { useHydration } from "@/hooks/useHydration";
import { useRouter, useSearchParams } from "next/navigation";
import MainLogo from "../../../public/main-logo.png";
import { GoogleIcon } from "@/components/common/Icons";
import { AuthLoading } from "@/components/common";
import Image from "next/image";
import { GapY } from "../../components/ui/gap";
import { useGoogleLogin, useUser } from "@/queries/useAuthQueries";
import {
  useTestSignup,
  useTestSignupAdmin,
  useTestLogin,
} from "@/queries/useTestQueries";
import { useTranslation } from "@/hooks/useTranslation";
import { isInAppBrowser, openInExternalBrowser } from "@/lib/inAppBrowser";
import { stashPostLoginRedirect } from "@/lib/postLoginRedirect";
```

기존 `export default function LoginPage() {` 선언(현재 22번째 줄)을 `function LoginPageContent() {`로 이름만 바꾼다 — 함수 본문(현재 23번째 줄부터 파일 끝의 최종 `}`까지)은 이 단계에서는 그대로 둔다(다음 스텝들에서 본문 내용을 수정한다). 그리고 파일 맨 끝에 다음을 추가한다:

```tsx
export default function LoginPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <LoginPageContent />
    </Suspense>
  );
}
```

- [ ] **Step 4: `useSearchParams`로 `returnTo` 읽고, 자동-리다이렉트 이펙트에 반영**

`LoginPageContent` 함수 본문 안, `const router = useRouter();` 바로 다음 줄에 추가:

```tsx
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
```

기존 자동 리다이렉트 이펙트(원래 43-47번째 줄):

```tsx
  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      router.push("/my");
    }
  }, [isHydrated, isAuthenticated, user, router]);
```

를 다음으로 교체:

```tsx
  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      router.push(returnTo || "/my");
    }
  }, [isHydrated, isAuthenticated, user, router, returnTo]);
```

- [ ] **Step 5: 구글 로그인 클릭 시 `returnTo` 저장**

기존 `handleGoogleLogin`(원래 53-66번째 줄):

```tsx
  const handleGoogleLogin = async () => {
    if (inAppBrowser) {
      openInExternalBrowser(window.location.href);
      return;
    }
    try {
      setMessage("");
      await googleLoginMutation.mutateAsync();
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : t("login.loginError")
      );
    }
  };
```

를 다음으로 교체:

```tsx
  const handleGoogleLogin = async () => {
    if (inAppBrowser) {
      openInExternalBrowser(window.location.href);
      return;
    }
    if (returnTo) {
      stashPostLoginRedirect(returnTo);
    }
    try {
      setMessage("");
      await googleLoginMutation.mutateAsync();
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : t("login.loginError")
      );
    }
  };
```

- [ ] **Step 6: `src/app/auth/callback/page.tsx` — 로그인 완료 후 저장된 경로로 이동**

`import { reissueToken } from "@/lib/apiClient";` 다음 줄에 추가:

```tsx
import { consumePostLoginRedirect } from "@/lib/postLoginRedirect";
```

`router.replace("/my")`로 끝나는 성공 분기(현재 76번째 줄 부근, 주석 `// 5. 마이페이지로 이동` 바로 아래)를 다음으로 교체:

```tsx
        // 5. 저장된 경로 또는 마이페이지로 이동
        router.replace(consumePostLoginRedirect());
```

- [ ] **Step 7: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 8: 브라우저 수동 확인**

Run: `npm run dev` 후:
- `/login`에 직접 접속 → 기존처럼 동작(구글 로그인 버튼, 게스트 접근 등)하는지 확인 — returnTo 없는 기본 케이스가 깨지지 않았는지.
- `/login?returnTo=%2Fmy` 접속 후 이미 로그인된 상태라면 `/my`로 자동 이동하는지(기존과 동일한 목적지라 회귀만 확인).
- 가능하다면 dev 전용 test-login(이메일 입력 후 로그인)으로 인증 상태를 만들고, `/login?returnTo=%2Fboard`로 접속했을 때 자동 이펙트가 `/board`로 보내는지 확인.
- 구글 OAuth 전체 왕복(백엔드 연동 필요)은 로컬 환경 제약상 재현이 어려울 수 있다 — 그 경우 `stashPostLoginRedirect`/`consumePostLoginRedirect`가 각각 올바르게 sessionStorage에 쓰고 읽는지를 브라우저 devtools 콘솔에서 직접 호출해 확인하고, 결과를 보고서에 명시한다.

- [ ] **Step 9: Commit**

```bash
git add src/lib/postLoginRedirect.ts src/app/login/page.tsx src/app/auth/callback/page.tsx
git commit -m "feat: 로그인 후 원래 페이지로 돌아가는 returnTo 처리 추가"
```
