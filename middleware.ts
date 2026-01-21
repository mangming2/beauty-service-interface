import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // 인증이 필요하지 않은 페이지들 (공개 페이지)
  const publicPages = ["/", "/login", "/auth/callback"];
  const isPublicPage = publicPages.some(page => req.nextUrl.pathname === page);

  // 쿠키에서 refreshToken 확인 (httpOnly 쿠키)
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // 공개 페이지가 아닌 경우
  if (!isPublicPage) {
    // refreshToken이 없으면 로그인 페이지로 리다이렉트
    if (!refreshToken) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 로그인 페이지 접근 시 - 이미 토큰이 있으면 마이페이지로
  if (req.nextUrl.pathname === "/login" && refreshToken) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/my";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (png, jpg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)",
  ],
};
