import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { isAdminAuthBypassed } from "@/lib/admin-auth-bypass";
import { COOKIE_NAME } from "@/lib/auth-constants";

export async function assertAdminSession(): Promise<void> {
  if (isAdminAuthBypassed()) {
    return;
  }
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("Unauthorized");
  }
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) {
    throw new Error("Unauthorized");
  }
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  if (payload.admin !== true) {
    throw new Error("Unauthorized");
  }
}
