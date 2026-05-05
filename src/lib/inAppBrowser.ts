/**
 * 인앱 브라우저 / WebView 환경 감지
 *
 * Google OAuth는 WebView·인앱 브라우저에서 403 disallowed_useragent를 반환하므로
 * 이 환경에서는 외부 브라우저 안내가 필요하다.
 */
export function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;

  // 정상 브라우저 화이트리스트 — 이 아래 검사보다 먼저 통과시킨다
  // Samsung Internet은 일부 모드에서 wv 플래그를 포함할 수 있어 명시적으로 허용
  if (/SamsungBrowser/.test(ua)) return false;

  // Android WebView
  if (/wv/.test(ua)) return true;

  // 국내·글로벌 주요 인앱 브라우저
  if (
    /(KAKAOTALK|Instagram|FBAN|FBAV|FB_IAB|Line\/|NAVER|DaumDevice|NaverSearch|Twitter\/|Snapchat|Musical\.ly|TikTok)/i.test(
      ua
    )
  )
    return true;

  // iOS WKWebView: AppleWebKit 있으나 Safari 없음
  if (
    /iPhone|iPad|iPod/.test(ua) &&
    /AppleWebKit/.test(ua) &&
    !/Safari/.test(ua)
  )
    return true;

  return false;
}

/**
 * 인앱 브라우저에서 외부 브라우저로 열기를 시도한다.
 * - Android: intent:// 스킴 (Chrome 우선)
 * - iOS: 앱별 쿼리 파라미터 추가 후 window.location 교체
 */
export function openInExternalBrowser(url: string): void {
  const ua = navigator.userAgent;

  if (/android/i.test(ua)) {
    // Samsung Internet 인앱 모드: 외부 브라우저로 위임 (package 미지정 → 기본 브라우저)
    if (/SamsungBrowser/.test(ua)) {
      const intent = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;end`;
      window.location.href = intent;
      return;
    }
    // 그 외 Android 인앱 브라우저: Chrome 강제 실행
    const intent = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intent;
    return;
  }

  // KakaoTalk iOS: openExternalBrowser 파라미터 인식
  if (/KAKAOTALK/i.test(ua)) {
    const sep = url.includes("?") ? "&" : "?";
    window.location.href = `${url}${sep}openExternalBrowser=1`;
    return;
  }

  // 그 외 iOS 인앱 브라우저 — 새 탭 시도 (앱에 따라 다름)
  window.open(url, "_blank", "noopener,noreferrer");
}
