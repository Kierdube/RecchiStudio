import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  normalizeAdminCredential,
  readAdminPassword,
  readAdminUsername,
} from "@/lib/admin-credentials";
import { COOKIE_NAME } from "@/lib/auth-constants";
import { timingSafeEqualString } from "@/lib/auth-password";
import { signAdminSession } from "@/lib/auth-session";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const adminPassword = readAdminPassword();
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Server is not configured for admin login" },
      { status: 500 },
    );
  }

  const expectedUsername = readAdminUsername();
  const username = normalizeAdminCredential(String(body.username ?? ""));
  const password = normalizeAdminCredential(String(body.password ?? ""));

  if (expectedUsername) {
    if (!timingSafeEqualString(username, expectedUsername)) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
  }

  if (!timingSafeEqualString(password, adminPassword)) {
    return NextResponse.json(
      { error: expectedUsername ? "Invalid username or password" : "Invalid password" },
      { status: 401 },
    );
  }

  const token = await signAdminSession();
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
