import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  const upstream = await fetch(`${API_BASE}/auth/reissue`, {
    method: "POST",
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await upstream.json();
  const res = NextResponse.json(data);

  // 백엔드가 refreshToken을 갱신했으면 프론트 쿠키도 업데이트
  const setCookie = upstream.headers.get("set-cookie");
  const newRt = setCookie?.match(/refreshToken=([^;]+)/)?.[1];
  if (newRt) {
    res.cookies.set("refreshToken", newRt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 14 * 24 * 60 * 60,
    });
  }

  return res;
}
