import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { loadShop, placeOrder, quoteShop, type StoreLine } from "@/lib/storely";
import { isPickupZone, requiredPolicyIds } from "@/lib/shop-model";
import { createVisitorKey, validVisitorKey, VISITOR_COOKIE, visitorCookieOptions } from "@/lib/visitor";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function linesOf(value: unknown): StoreLine[] | null {
  if (!Array.isArray(value) || !value.length) return null;
  const lines: StoreLine[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const row = item as Record<string, unknown>;
    const variantId = typeof row.variantId === "string" ? row.variantId.trim() : "";
    const quantity = row.quantity;
    if (!variantId || !Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > 99) return null;
    const line: StoreLine = { variantId, quantity: quantity as number };
    if (row.bundle === true) {
      const bundleQty = row.bundleQty;
      if (!Number.isInteger(bundleQty) || (bundleQty as number) < 2) return null;
      line.bundle = true;
      line.bundleQty = bundleQty as number;
    }
    lines.push(line);
  }
  return lines;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const lines = linesOf(body?.lines);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const city = typeof body?.city === "string" ? body.city.trim() : "";
  const street = typeof body?.street === "string" ? body.street.trim() : "";
  const zip = typeof body?.zip === "string" ? body.zip.trim() : "";
  const shippingName = typeof body?.shippingName === "string" ? body.shippingName.trim() : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  const giftCode = typeof body?.giftCode === "string" ? body.giftCode.trim() : "";
  const accepted = Array.isArray(body?.policies) ? body.policies.filter((item: unknown): item is string => typeof item === "string") : [];
  if (!lines || !name || !EMAIL_RE.test(email) || phone.replace(/\D/g, "").length < 9 || !shippingName) {
    return NextResponse.json({ ok: false, reason: "חסרים פרטים להזמנה" }, { status: 400 });
  }

  const shop = await loadShop(request.headers.get("host"));
  const choice = shop.shipping.find((method) => method.name === shippingName);
  if (!choice) return NextResponse.json({ ok: false, reason: "אפשרות המשלוח לא זמינה" }, { status: 400 });
  if (!isPickupZone(choice.zone) && !street) {
    return NextResponse.json({ ok: false, reason: "חסרה כתובת למשלוח" }, { status: 400 });
  }
  if (!city && !isPickupZone(choice.zone)) {
    return NextResponse.json({ ok: false, reason: "חסרה עיר" }, { status: 400 });
  }
  const needed = requiredPolicyIds(shop.policies, "both");
  if (needed.some((id) => !accepted.includes(id))) {
    return NextResponse.json({ ok: false, reason: "צריך לאשר את המדיניות לפני התשלום" }, { status: 400 });
  }

  const quoted = await quoteShop({
    hostHeader: request.headers.get("host"),
    lines,
    code,
    shippingName,
    email,
    giftCode,
  });
  if (!quoted.ok) return NextResponse.json({ ok: false, reason: quoted.reason }, { status: 400 });
  if (quoted.addGift) return NextResponse.json({ ok: false, reason: "המתנה עדיין לא נכנסה לעגלה" }, { status: 400 });

  const jar = await cookies();
  const current = jar.get(VISITOR_COOKIE)?.value;
  const visitorKey = validVisitorKey(current) ? current : createVisitorKey();
  const placed = await placeOrder({
    hostHeader: request.headers.get("host"),
    visitorKey,
    lines,
    customer: { name, email, phone, street, city, zip },
    shippingName,
    code,
    giftCode,
  });
  if (!placed.ok) return NextResponse.json(placed, { status: 400 });
  const response = NextResponse.json({ ok: true, orderNumber: placed.orderNumber, total: placed.total, currency: placed.currency });
  if (!validVisitorKey(current)) {
    response.cookies.set(VISITOR_COOKIE, visitorKey, visitorCookieOptions(request.headers.get("x-forwarded-proto") === "https"));
  }
  return response;
}
