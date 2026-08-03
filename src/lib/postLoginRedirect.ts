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
