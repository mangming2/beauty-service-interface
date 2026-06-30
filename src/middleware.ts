import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/auth/callback") {
    const rt = searchParams.get("rt");
    if (rt) {
      // 백엔드가 URL 파라미터로 넘겨준 refreshToken을
      // 프론트 도메인의 HttpOnly 쿠키로 변환한다.
      // Safari ITP 우회: 쿠키가 같은 오리진에서 발급되므로 cross-site 차단 없음.
      const url = request.nextUrl.clone();
      url.searchParams.delete("rt");

      const response = NextResponse.redirect(url);
      response.cookies.set("refreshToken", rt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 14 * 24 * 60 * 60, // 14일
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/auth/callback",
};
