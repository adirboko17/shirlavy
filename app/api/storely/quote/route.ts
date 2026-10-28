import { NextResponse } from "next/server";
import { quoteShop, type StoreLine } from "@/lib/storely";

function linesOf(value: unknown): StoreLine[] | null {
  if (!Array.isArray(value)) return null;
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
  if (!lines) return NextResponse.json({ ok: false, reason: "העגלה לא תקינה" }, { status: 400 });
  const quote = await quoteShop({
    hostHeader: request.headers.get("host"),
    lines,
    code: typeof body?.code === "string" ? body.code.trim() : "",
    shippingName: typeof body?.shippingName === "string" ? body.shippingName.trim() : "",
    email: typeof body?.email === "string" ? body.email.trim() : "",
    giftCode: typeof body?.giftCode === "string" ? body.giftCode.trim() : "",
  });
  return NextResponse.json(quote, { status: quote.ok ? 200 : 400 });
}
