import { NextResponse } from "next/server";

import { getEmailPreviewDocuments } from "@/lib/send-email-previews";
import { assertAdminSession } from "@/lib/verify-admin-session";

export async function GET() {
  try {
    await assertAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const previews = await getEmailPreviewDocuments();
    return NextResponse.json({ previews });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load email previews";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
