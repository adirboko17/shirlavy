import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/storely";
import { createVisitorKey, validVisitorKey, VISITOR_COOKIE, visitorCookieOptions } from "@/lib/visitor";

const EVENTS = new Set(["add_to_cart", "begin_checkout"]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const event = body?.event;
  if (!EVENTS.has(event)) return NextResponse.json({ ok: false }, { status: 400 });
  const jar = await cookies();
  const current = jar.get(VISITOR_COOKIE)?.value;
  const visitorKey = validVisitorKey(current) ? current : createVisitorKey();
  const path = typeof body?.path === "string" ? body.path : "/";
  await recordEvent({
    hostHeader: request.headers.get("host"),
    visitorKey,
    event,
    path,
  });
  const response = NextResponse.json({ ok: true });
  if (!validVisitorKey(current)) {
    response.cookies.set(VISITOR_COOKIE, visitorKey, visitorCookieOptions(false));
  }
  return response;
}
