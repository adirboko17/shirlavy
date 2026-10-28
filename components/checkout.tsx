"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney, formatShippingPrice, isPickupZone, requiredPolicyIds, storefrontLine, type Currency } from "@/lib/shop-model";
import { useSite, writeCustomerDraft } from "@/lib/site";
import { PolicyRow } from "./cart-drawer";
import { h2Style } from "./ui";

type Quote = {
  ok: true;
  total: number;
  currency: Currency;
  shipping: number | null;
  discount: number;
  addGift: boolean;
  giftVariantId: string;
  giftQuantity: number;
  giftTitle: string;
  bundleBlocked: boolean;
};

export function CheckoutPage() {
  const site = useSite();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [shippingName, setShippingName] = useState("");
  const [code, setCode] = useState("");
  const [giftCode, setGiftCode] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const shipping = site.shop.shipping.find((method) => method.name === shippingName) ?? null;
  const pickup = shipping ? isPickupZone(shipping.zone) : false;
  const needed = requiredPolicyIds(site.shop.policies, "both");
  const policiesReady = needed.every((id) => site.acceptedPolicies.includes(id));
  const checkoutPolicies = site.shop.policies.filter((policy) => policy.checkout !== "hidden");

  useEffect(() => {
    writeCustomerDraft({ name, email, phone, street, city, zip, shippingName });
  }, [name, email, phone, street, city, zip, shippingName]);

  useEffect(() => {
    if (!site.cart.length || !shippingName) {
      setQuote(null);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const response = await fetch("/api/storely/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lines: site.cart.map(storefrontLine),
          code,
          giftCode,
          shippingName,
          email,
        }),
        signal: controller.signal,
      }).catch(() => null);
      if (!response) return;
      const body = await response.json().catch(() => null);
      if (!body?.ok) {
        setQuote(null);
        setReason(body?.reason || "לא הצלחנו לחשב את הסכום לתשלום");
        return;
      }
      setReason("");
      setQuote(body);
      if ((code || giftCode) && body.addGift && body.giftVariantId && !site.cart.some((line) => line.gift && line.variantId === body.giftVariantId)) {
        site.addLine({
          key: `gift:${body.giftVariantId}:1`,
          variantId: body.giftVariantId,
          productId: "",
          name: body.giftTitle || "מתנה",
          detail: "מתנה",
          image: "",
          unitPrice: 0,
          quantity: body.giftQuantity || 1,
          bundle: false,
          gift: true,
        }, false, false);
      }
      if (!code && !giftCode && site.cart.some((line) => line.gift)) {
        site.cart.filter((line) => line.gift).forEach((line) => site.removeLine(line.key));
      }
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [site.cart, site.addLine, site.removeLine, code, giftCode, shippingName, email]);

  async function pay() {
    setPending(true);
    setReason("");
    const response = await fetch("/api/storely/order", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        lines: site.cart.map(storefrontLine),
        name,
        email,
        phone,
        city,
        street,
        zip,
        shippingName,
        code,
        giftCode,
        policies: site.acceptedPolicies,
      }),
    });
    const body = await response.json().catch(() => null);
    setPending(false);
    if (!response.ok || !body?.ok) {
      setReason(body?.reason || "ההזמנה לא נשמרה");
      return;
    }
    setOrderNumber(body.orderNumber);
    site.clearCart();
  }

  if (orderNumber) {
    return (
      <section style={{ padding: "clamp(120px,14vh,140px) 16px 80px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
          <h1 style={h2Style("clamp(28px,3.2vw,40px)")}>ההזמנה התקבלה</h1>
          <p style={{ margin: 0, color: "#5A5A5A" }}>מספר ההזמנה הוא {orderNumber}.</p>
          <Link href="/shop" className="text-link">חזרה לחנות</Link>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "clamp(120px,14vh,140px) clamp(16px,4vw,48px) clamp(64px,8vw,96px)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>
        <h1 style={h2Style("clamp(28px,3.2vw,40px)")}>תשלום</h1>
        {site.cart.length === 0 ? (
          <div>
            <p style={{ color: "#5A5A5A" }}>העגלה ריקה.</p>
            <Link href="/shop" className="text-link">לחנות</Link>
          </div>
        ) : (
          <>
            {site.cart.map((line) => (
              <div key={line.key} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>{line.name}{line.detail ? ` · ${line.detail}` : ""} × {line.quantity}</span>
                <span>{formatMoney(line.unitPrice, site.shop.currency)}</span>
              </div>
            ))}
            <fieldset style={{ border: 0, padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <legend style={{ fontWeight: 500, marginBottom: 8 }}>משלוח</legend>
              {site.shop.shipping.length === 0 ? <p style={{ color: "#8A3A3A" }}>אין אפשרות משלוח כרגע, ואי אפשר להמשיך לתשלום.</p> : site.shop.shipping.map((method) => (
                <label key={method.name} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 14px", borderRadius: 16, background: shippingName === method.name ? "#F5EEE7" : "#F7F5F2" }}>
                  <span style={{ display: "flex", gap: 8 }}>
                    <input type="radio" name="shipping" checked={shippingName === method.name} onChange={() => setShippingName(method.name)} />
                    {method.name}
                  </span>
                  <span>{formatShippingPrice(method.price, site.shop.currency)}</span>
                </label>
              ))}
            </fieldset>
            <div style={{ display: "grid", gap: 10 }}>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="שם מלא" aria-label="שם מלא" style={field} />
              <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="טלפון" aria-label="טלפון" style={field} />
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="אימייל" aria-label="אימייל" style={field} />
              {pickup ? null : (
                <>
                  <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="עיר" aria-label="עיר" style={field} />
                  <input value={street} onChange={(event) => setStreet(event.target.value)} placeholder="רחוב ומספר" aria-label="רחוב" style={field} />
                  <input value={zip} onChange={(event) => setZip(event.target.value)} placeholder="מיקוד" aria-label="מיקוד" style={field} />
                </>
              )}
              <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="קוד הנחה" aria-label="קוד הנחה" style={field} />
              <input value={giftCode} onChange={(event) => setGiftCode(event.target.value)} placeholder="קוד מתנה" aria-label="קוד מתנה" style={field} />
            </div>
            {quote ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 15 }}>
                {quote.discount > 0 ? <span>הנחה {formatMoney(quote.discount, quote.currency)}</span> : null}
                <span>משלוח {quote.shipping == null ? "" : formatShippingPrice(quote.shipping, quote.currency)}</span>
                <strong style={{ fontSize: 20, fontWeight: 500 }}>לתשלום {formatMoney(quote.total, quote.currency)}</strong>
              </div>
            ) : null}
            {quote?.bundleBlocked ? <p style={{ margin: 0, color: "#8A3A3A" }}>הקוד לא חל כי המוצר הנדרש נקנה בבאנדל.</p> : null}
            {checkoutPolicies.map((policy) => <PolicyRow key={policy.id} id={policy.id} title={policy.title} mode={policy.checkout} />)}
            {reason ? <p style={{ margin: 0, color: "#8A3A3A" }}>{reason}</p> : null}
            <button type="button" className="pill gold" style={{ height: 54, alignSelf: "flex-start" }} disabled={pending || !quote || !policiesReady || !site.shop.shipping.length} onClick={() => void pay()}>
              {pending ? "שומרים את ההזמנה..." : "אישור ותשלום"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

const field: CSSProperties = {
  height: 48,
  border: 0,
  borderRadius: 999,
  background: "#F7F5F2",
  padding: "0 16px",
  font: "inherit",
  color: "#1C1C1C",
};
