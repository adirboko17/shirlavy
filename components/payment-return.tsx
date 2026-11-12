"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatMoney, type Currency } from "@/lib/shop-model";
import { useSite } from "@/lib/site";
import { CommerceIcon } from "./commerce-icon";

type ReceiptLine = { title: string; quantity: number; unitPrice: number };

type Receipt = {
  orderNumber: string;
  total: number;
  discount: number;
  shipping: number;
  shippingName: string;
  email: string;
  currency: Currency;
  lines: ReceiptLine[];
};

function moneyOf(value: unknown) {
  const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : 0;
}

function currencyOf(value: unknown): Currency {
  return value === "USD" || value === "EUR" ? value : "ILS";
}

export function PaymentReturn() {
  const started = useRef(false);
  const site = useSite();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const query = window.location.search.startsWith("?") ? window.location.search.slice(1) : window.location.search;
    if (!query) {
      setReason("לא התקבל אישור תשלום.");
      return;
    }
    void fetch("/api/storely/payment/complete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        const orderNumber = body?.orderNumber;
        const number = typeof orderNumber === "string" || typeof orderNumber === "number" ? String(orderNumber).trim() : "";
        if (!response.ok || !body?.ok || !number) {
          setReason(typeof body?.reason === "string" ? body.reason : "לא הצלחנו לאשר את התשלום.");
          return;
        }
        localStorage.setItem("shirlavy-cart", "[]");
        site.clearCart();
        site.closeCart();
        const lines = Array.isArray(body.lines)
          ? body.lines.flatMap((item: unknown) => {
              if (!item || typeof item !== "object") return [];
              const row = item as { title?: unknown; quantity?: unknown; unitPrice?: unknown };
              const title = typeof row.title === "string" ? row.title.trim() : "";
              const quantity = Number(row.quantity);
              const unitPrice = moneyOf(row.unitPrice);
              if (!title || !Number.isInteger(quantity) || quantity < 1) return [];
              return [{ title, quantity, unitPrice }];
            })
          : [];
        setReceipt({
          orderNumber: number,
          total: moneyOf(body.total),
          discount: moneyOf(body.discount),
          shipping: moneyOf(body.shipping),
          shippingName: typeof body.shippingName === "string" ? body.shippingName : "",
          email: typeof body.email === "string" ? body.email : "",
          currency: currencyOf(body.currency),
          lines,
        });
      })
      .catch(() => setReason("לא התקבל אישור מהשרת. רענני את העמוד לפני ניסיון נוסף."));
  }, []);

  if (receipt) {
    const subtotal = receipt.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    return (
      <section className="checkout-page pay-done">
        <div className="pay-card">
          <span className="checkout-state-icon" aria-hidden="true">✓</span>
          <span className="checkout-eyebrow">תודה שבחרת ב־SHIR LAVY</span>
          <h1>ההזמנה התקבלה</h1>
          <p className="pay-number">מספר הזמנה <bdi>{receipt.orderNumber}</bdi></p>
          {receipt.email ? <p>שלחנו אישור אל <bdi>{receipt.email}</bdi></p> : null}
          {receipt.lines.length ? (
            <ul className="pay-lines">
              {receipt.lines.map((line) => (
                <li key={`${line.title}-${line.quantity}-${line.unitPrice}`}>
                  <span>
                    <strong>{line.title}</strong>
                    <small>כמות {line.quantity}</small>
                  </span>
                  <b>{formatMoney(line.unitPrice * line.quantity, receipt.currency)}</b>
                </li>
              ))}
            </ul>
          ) : null}
          <dl className="pay-totals">
            {receipt.lines.length ? <div><dt>סכום ביניים</dt><dd>{formatMoney(subtotal, receipt.currency)}</dd></div> : null}
            {receipt.discount > 0 ? <div><dt>הנחה</dt><dd>−{formatMoney(receipt.discount, receipt.currency)}</dd></div> : null}
            <div><dt>{receipt.shippingName || "משלוח"}</dt><dd>{receipt.shipping === 0 ? "ללא עלות" : formatMoney(receipt.shipping, receipt.currency)}</dd></div>
            <div className="is-total"><dt>לתשלום</dt><dd>{formatMoney(receipt.total, receipt.currency)}</dd></div>
          </dl>
          <Link href="/" className="checkout-primary">חזרה לאתר <CommerceIcon name="arrow" /></Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page pay-done">
      <div className="pay-card">
        {reason ? <span className="checkout-state-icon" aria-hidden="true">!</span> : <span className="pay-spin" aria-hidden="true" />}
        <span className="checkout-eyebrow">התשלום</span>
        <h1>{reason ? "התשלום לא הושלם" : "מאשרים את התשלום"}</h1>
        <p>{reason || "רק עוד רגע, בודקים את האישור מול חברת הסליקה."}</p>
        {reason ? <Link href="/checkout" className="checkout-primary">חזרה להזמנה <CommerceIcon name="arrow" /></Link> : null}
      </div>
    </section>
  );
}
