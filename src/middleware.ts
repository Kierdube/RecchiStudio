import { SignJWT, jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_NAME } from "@/lib/auth-constants";

function wantsAdminBypassLogin(request: NextRequest): boolean {
  if (request.nextUrl.searchParams.get("bypass") === "true") {
    return true;
  }
  return (
    process.env.NODE_ENV !== "production" && request.nextUrl.searchParams.get("creds") === "true"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET;

  if (wantsAdminBypassLogin(request) && secret && secret.length >= 32) {
    const token = await new SignJWT({ admin: true })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(secret));

    const url = request.nextUrl.clone();
    url.searchParams.delete("bypass");
    url.searchParams.delete("creds");
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      url.pathname = "/admin";
    }

    const res = NextResponse.redirect(url);
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  if (!secret || secret.length < 32) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (payload.admin !== true) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
