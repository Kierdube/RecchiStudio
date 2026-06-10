import { NextResponse } from "next/server";

import { sendEmailPreviews } from "@/lib/send-email-previews";
import { assertAdminSession } from "@/lib/verify-admin-session";

export async function POST() {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sendEmailPreviews();
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not send preview emails";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
