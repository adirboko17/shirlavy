import { NextResponse } from "next/server";
import { recoverCheckout } from "@/lib/storely";

const checkoutId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id.trim() : "";
  if (!checkoutId.test(id)) {
    return NextResponse.json({ ok: false, reason: "העגלה לא נמצאה" }, { status: 400 });
  }
  const result = await recoverCheckout({ hostHeader: request.headers.get("host"), checkoutId: id });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
