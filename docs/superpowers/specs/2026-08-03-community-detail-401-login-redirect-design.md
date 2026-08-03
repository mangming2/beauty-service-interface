# 커뮤니티 상세 401 → 로그인 리다이렉트 (returnTo 지원)

## 배경

`/board/community/[id]` 방문 시 세션이 만료된 상태(토큰은 있으나 재발급 실패, 또는 hydration 타이밍 등으로 인증 여부 판단이 꼬이는 경우)에서 API가 401을 반환하면, 현재는 `useCommunityPostDetail`의 `isError`가 다른 모든 에러(404, 500 등)와 뭉뚱그려져 `notFound()`가 호출된다. 사용자는 "존재하지 않는 페이지"처럼 보이는 화면만 보고, 로그인이 필요하다는 안내를 받지 못한다.

기존에도 `apiClient.ts`에 재발급 실패 시 `window.location.href = "/login"`으로 보내는 로직이 있지만, 이는 `middleware.ts`/`ProtectedLayout.tsx`/`apiClient.ts` 세 곳에 각각 독립적으로 하드코딩된 "공개 경로" 목록에 의존하는 부수효과라 타이밍/경로 인식에 따라 신뢰할 수 없다. 페이지 레벨에서 401을 명시적으로 분리해 처리하는 편이 안정적이다.

## 변경 사항

### 1. `src/app/board/community/[id]/page.tsx` — 401 분리 처리

현재:
```ts
if (isError || !post) {
  notFound();
}
```

변경 후, `useCommunityPostDetail`가 반환하는 `error`를 함께 꺼내 401만 분리:
```ts
const { data: post, isLoading, isError, error } = useCommunityPostDetail(postId);
...
if (error && (error as ApiError).status === 401) {
  router.replace(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
  return null;
}

if (isError || !post) {
  notFound();
}
```
`ApiError` 타입은 `@/lib/apiClient`에서 import. 401이 아닌 나머지(404/500/네트워크 에러)는 기존과 동일하게 `notFound()`.

### 2. 신규 유틸 `src/lib/postLoginRedirect.ts`

Google OAuth는 `window.location.href`로 백엔드(`/auth/login/google`)까지 완전히 페이지를 이탈했다가 `/auth/callback`으로 돌아오는 구조라, `/login`의 쿼리파라미터만으로는 이 왕복 동안 값을 유지할 수 없다. `sessionStorage`로 임시 전달한다.

```ts
const KEY = "post_login_redirect";

export function stashPostLoginRedirect(path: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, path);
}

export function consumePostLoginRedirect(fallback = "/my"): string {
  if (typeof window === "undefined") return fallback;
  const value = sessionStorage.getItem(KEY);
  sessionStorage.removeItem(KEY);
  return value || fallback;
}
```

### 3. `src/app/login/page.tsx` — returnTo 저장 및 즉시-리다이렉트 반영

- `useSearchParams()`로 `returnTo` 쿼리파라미터를 읽는다.
- `handleGoogleLogin`에서 `loginWithProvider("google")` 호출 직전, `returnTo`가 있으면 `stashPostLoginRedirect(returnTo)` 호출.
- 이미 인증된 상태로 `/login`에 진입했을 때 자동 이동시키는 기존 이펙트:
  ```ts
  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      router.push("/my");
    }
  }, [isHydrated, isAuthenticated, user, router]);
  ```
  → `router.push(returnTo || "/my")`로 변경 (이 경로는 페이지 이탈이 없으므로 URL 파라미터를 바로 사용).

### 4. `src/app/auth/callback/page.tsx` — 로그인 완료 후 목적지 반영

현재 고정된 `router.replace("/my")` (콜백 처리 성공 시)를 `router.replace(consumePostLoginRedirect())`로 변경. 저장된 값이 없으면 유틸의 기본값(`/my`)으로 폴백.

## 범위 제외

- 백엔드 변경 없음 (OAuth 콜백에 `returnTo`를 직접 실어 보내는 방식은 도입하지 않음 — sessionStorage 핸드오프로 충분).
- `middleware.ts`/`ProtectedLayout.tsx`/`apiClient.ts`의 중복된 공개 경로 목록 통합은 이번 범위에 포함하지 않음(별도 기술부채로 남김).
- 공지사항 상세 페이지(`notice/[id]/page.tsx`)의 401 처리는 이번에 함께 고치지 않음 — 커뮤니티 상세만 범위.
- dev 전용 test-login 흐름(`handleTestLogin`)은 페이지 이탈이 없으므로 로그인 페이지의 기존 자동 리다이렉트 이펙트 수정만으로 자연히 returnTo가 반영됨 — 별도 처리 불필요.
