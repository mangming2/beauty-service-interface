import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 인증이 필요하지 않은 페이지들 (공개 페이지)
  const publicPages = ["/", "/login", "/auth/callback"];
  const isPublicPage = publicPages.some(page => req.nextUrl.pathname === page);

  // 공개 페이지가 아닌 경우에만 세션 확인
  if (!isPublicPage) {
    try {
      // 쿠키에서 토큰 가져오기
      const token = req.cookies.get("auth_token")?.value;

      if (!token) {
        // 토큰이 없으면 로그인 페이지로 리다이렉트
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/login";
        return NextResponse.redirect(redirectUrl);
      }

      // 백엔드 API로 세션 확인
      const sessionResponse = await fetch(`${API_BASE_URL}/auth/session`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!sessionResponse.ok) {
        // 세션이 유효하지 않으면 로그인 페이지로 리다이렉트
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/login";
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error("Middleware session check error:", error);
      // 에러 발생 시 로그인 페이지로 리다이렉트
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 이미 로그인된 사용자가 로그인 페이지에 접근하려고 하는 경우
  if (isPublicPage && req.nextUrl.pathname === "/login") {
    const token = req.cookies.get("auth_token")?.value;

    if (token) {
      try {
        const sessionResponse = await fetch(`${API_BASE_URL}/auth/session`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (sessionResponse.ok) {
          // 이미 로그인되어 있으면 마이페이지로 리다이렉트
          const redirectUrl = req.nextUrl.clone();
          redirectUrl.pathname = "/my";
          return NextResponse.redirect(redirectUrl);
        }
      } catch (error) {
        // 에러 발생 시 그대로 진행 (로그인 페이지 표시)
        console.error("Middleware login check error:", error);
      }
    }
  }

  return res;
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
