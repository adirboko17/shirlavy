import { NextResponse } from "next/server";
import { submitPopupLead } from "@/lib/storely";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const popupId = typeof body?.popupId === "string" ? body.popupId.trim() : "";
  const pagePath = typeof body?.pagePath === "string" ? body.pagePath.slice(0, 300) : "/";
  const source = body?.fields && typeof body.fields === "object" ? body.fields as Record<string, unknown> : {};
  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(source)) {
    if (!/^[a-z][a-z0-9_]{0,40}$/.test(key) || typeof value !== "string") continue;
    fields[key] = value.replace(/\u0000/g, "").trim().slice(0, 500);
  }
  if (!popupId || !Object.keys(fields).length) {
    return NextResponse.json({ ok: false, reason: "חסרים פרטים" }, { status: 400 });
  }
  const result = await submitPopupLead({
    hostHeader: request.headers.get("host"),
    popupId,
    fields,
    pagePath,
  });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
