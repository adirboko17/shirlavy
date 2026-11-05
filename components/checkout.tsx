"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney, formatShippingPrice, isPickupZone, requiredPolicyIds, storefrontLine, type Currency } from "@/lib/shop-model";
import { useSite, writeCustomerDraft } from "@/lib/site";
import { PolicyRow, cartSubtotal } from "./cart-drawer";
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

  const currency = site.shop.currency;
  const subtotal = cartSubtotal(site.cart);
  const canPay = !pending && !!quote && policiesReady && site.shop.shipping.length > 0;

  if (orderNumber) {
    return (
      <section className="checkout-done">
        <h1 style={h2Style("clamp(32px,4vw,48px)")}>ההזמנה התקבלה</h1>
        <p>מספר ההזמנה הוא {orderNumber}.</p>
        <Link href="/shop" className="pill gold">חזרה לחנות</Link>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout">
        <div className="checkout__main">
          <h1 style={h2Style("clamp(32px,4vw,48px)")}>קופה</h1>
          {site.cart.length === 0 ? (
            <div className="checkout-empty">
              <p>העגלה ריקה.</p>
              <Link href="/shop" className="pill gold">לחנות</Link>
            </div>
          ) : (
            <>
              <section className="checkout-block">
                <h2>פרטי קשר</h2>
                <div className="checkout-grid">
                  <Field label="שם מלא" value={name} onChange={setName} autoComplete="name" />
                  <Field label="טלפון" value={phone} onChange={setPhone} autoComplete="tel" inputMode="tel" />
                  <Field label="אימייל" value={email} onChange={setEmail} autoComplete="email" type="email" className="checkout-grid__wide" />
                </div>
              </section>
              <section className="checkout-block">
                <h2>משלוח</h2>
                {site.shop.shipping.length === 0 ? (
                  <p className="checkout-error">אין אפשרות משלוח כרגע, ואי אפשר להמשיך לתשלום.</p>
                ) : (
                  <div className="ship-list">
                    {site.shop.shipping.map((method) => (
                      <label key={method.name} className={`ship-option${shippingName === method.name ? " is-on" : ""}`}>
                        <input type="radio" name="shipping" checked={shippingName === method.name} onChange={() => setShippingName(method.name)} />
                        <span>{method.name}</span>
                        <b>{formatShippingPrice(method.price, currency)}</b>
                      </label>
                    ))}
                  </div>
                )}
                {pickup ? <p className="checkout-note">איסוף עצמי, בלי כתובת למשלוח.</p> : site.shop.shipping.length > 0 ? (
                  <div className="checkout-grid">
                    <Field label="עיר" value={city} onChange={setCity} autoComplete="address-level2" />
                    <Field label="מיקוד" value={zip} onChange={setZip} autoComplete="postal-code" />
                    <Field label="רחוב ומספר" value={street} onChange={setStreet} autoComplete="street-address" className="checkout-grid__wide" />
                  </div>
                ) : null}
              </section>
              {checkoutPolicies.length ? (
                <section className="checkout-block">
                  {checkoutPolicies.map((policy) => <PolicyRow key={policy.id} id={policy.id} title={policy.title} mode={policy.checkout} />)}
                </section>
              ) : null}
              {reason ? <p className="checkout-error">{reason}</p> : null}
              {!policiesReady && checkoutPolicies.length ? <p className="checkout-note">כדי לשלם יש לאשר את התנאים.</p> : null}
              <button type="button" className="pill gold checkout-pay" disabled={!canPay} onClick={() => void pay()}>
                {pending ? "שומרים את ההזמנה..." : quote ? `תשלום ${formatMoney(quote.total, quote.currency)}` : "אישור ותשלום"}
              </button>
            </>
          )}
        </div>
        {site.cart.length > 0 ? (
          <aside className="checkout__summary">
            <h2>ההזמנה</h2>
            <ul className="summary-lines">
              {site.cart.map((line) => (
                <li key={line.key}>
                  <span className="summary-lines__photo">
                    {line.image ? <img src={line.image} alt="" /> : null}
                    <i>{line.quantity}</i>
                  </span>
                  <span className="summary-lines__name">
                    <strong>{line.name}</strong>
                    {line.detail ? <small>{line.detail}</small> : null}
                  </span>
                  <b>{formatMoney(line.unitPrice * line.quantity, currency)}</b>
                </li>
              ))}
            </ul>
            <div className="summary-codes">
              <Field label="קוד הנחה" value={code} onChange={setCode} />
              <Field label="קוד מתנה" value={giftCode} onChange={setGiftCode} />
            </div>
            {quote?.bundleBlocked ? <p className="checkout-error">הקוד לא חל כי המוצר הנדרש נקנה בבאנדל.</p> : null}
            <dl className="summary-totals">
              <div><dt>סכום ביניים</dt><dd>{formatMoney(subtotal, currency)}</dd></div>
              {quote && quote.discount > 0 ? <div><dt>הנחה</dt><dd>−{formatMoney(quote.discount, quote.currency)}</dd></div> : null}
              <div><dt>משלוח</dt><dd>{quote ? (quote.shipping == null ? "—" : formatShippingPrice(quote.shipping, quote.currency)) : "בחרי משלוח"}</dd></div>
              <div className="is-total"><dt>לתשלום</dt><dd>{quote ? formatMoney(quote.total, quote.currency) : formatMoney(subtotal, currency)}</dd></div>
            </dl>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
  type = "text",
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "tel" | "text";
}) {
  return (
    <label className={`checkout-field${className ? ` ${className}` : ""}`}>
      <span>{label}</span>
      <input type={type} value={value} autoComplete={autoComplete} inputMode={inputMode} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
