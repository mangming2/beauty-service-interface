import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Supabase 클라이언트 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 현재 사용자의 세션 확인
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 인증이 필요하지 않은 페이지들 (공개 페이지)
  const publicPages = ["/", "/login", "/auth/callback"];
  const isPublicPage = publicPages.some(page => req.nextUrl.pathname === page);

  // 인증이 필요한 페이지에 접근하려고 하는데 로그인이 안된 경우
  if (!session && !isPublicPage) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // 이미 로그인된 사용자가 로그인 페이지에 접근하려고 하는 경우
  if (session && req.nextUrl.pathname === "/login") {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/my";
    return NextResponse.redirect(redirectUrl);
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
