import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    // 백엔드 로그아웃 (실패해도 프론트 쿠키는 지운다)
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    }).catch(() => {});
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete("refreshToken");
  return res;
}
