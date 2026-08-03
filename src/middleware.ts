import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * refreshToken 쿠키는 백엔드(apidoki.store)가 발급하는데, 프론트 도메인
 * (dayofkidol.shop / localhost)과 등록 도메인이 달라 브라우저가 이 쿠키를
 * 프론트 서버로 전송하지 않는다. 즉 이 미들웨어에서는 로그인 여부와 무관하게
 * refreshToken이 항상 없는 것으로 보여, 쿠키 기반 리다이렉트를 켜두면
 * 로그인 상태의 사용자까지 /login으로 튕겨나간다.
 * 프론트/백엔드가 쿠키를 공유할 수 있는 구조(BFF 프록시 등)가 마련되기
 * 전까지는 서버 사이드 게이팅을 비활성화하고, 인증 게이팅은 클라이언트
 * AuthGuard/ProtectedLayout에 맡긴다.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|gif|svg|ico|webp|lottie|json|txt|woff2?|mp4|webm)$).*)",
  ],
};
