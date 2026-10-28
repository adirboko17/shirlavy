import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { saveCheckout, type StoreLine } from "@/lib/storely";
import { createVisitorKey, validVisitorKey, VISITOR_COOKIE, visitorCookieOptions } from "@/lib/visitor";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const raw = Array.isArray(body?.lines) ? body.lines : [];
  const lines: StoreLine[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const variantId = typeof row.variantId === "string" ? row.variantId.trim() : "";
    const quantity = row.quantity;
    if (!variantId || !Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > 99) continue;
    const line: StoreLine = { variantId, quantity: quantity as number };
    if (row.bundle === true && Number.isInteger(row.bundleQty)) {
      line.bundle = true;
      line.bundleQty = row.bundleQty as number;
    }
    lines.push(line);
  }
  if (!lines.length) return NextResponse.json({ ok: true });

  const jar = await cookies();
  const current = jar.get(VISITOR_COOKIE)?.value;
  const visitorKey = validVisitorKey(current) ? current : createVisitorKey();
  const customer = body?.customer && typeof body.customer === "object" ? body.customer as Record<string, unknown> : {};
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  await saveCheckout({
    hostHeader: request.headers.get("host"),
    visitorKey,
    lines,
    shippingName: text(body?.shippingName),
    customer: {
      name: text(customer.name),
      email: text(customer.email),
      phone: text(customer.phone),
      street: text(customer.street),
      city: text(customer.city),
      zip: text(customer.zip),
    },
  });
  const response = NextResponse.json({ ok: true });
  if (!validVisitorKey(current)) {
    response.cookies.set(VISITOR_COOKIE, visitorKey, visitorCookieOptions(request.headers.get("x-forwarded-proto") === "https"));
  }
  return response;
}
