import { NextResponse } from "next/server";
import { completePayment } from "@/lib/storely";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const query = typeof body?.query === "string" ? body.query.trim() : "";
  if (!query || query.length > 8000) {
    return NextResponse.json({ ok: false, reason: "אישור התשלום לא תקין" }, { status: 400 });
  }
  const result = await completePayment({ hostHeader: request.headers.get("host"), query });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
