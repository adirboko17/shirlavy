"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { formatMoney, formatShippingPrice, isPickupZone, requiredPolicyIds, storefrontLine, type Currency } from "@/lib/shop-model";
import { readCustomerDraft, useSite, writeCustomerDraft } from "@/lib/site";
import { PolicyRow, cartSubtotal } from "./cart-drawer";
import { CommerceIcon } from "./commerce-icon";

type Quote = {
  ok: true; total: number; currency: Currency; shipping: number | null; discount: number;
  addGift: boolean; giftVariantId: string; giftQuantity: number; giftTitle: string; bundleBlocked: boolean;
};

export function CheckoutPage() {
  const site = useSite();
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", street: "", addressExtra: "", city: "", zip: "", shippingName: "" });
  const [draftReady, setDraftReady] = useState(false);
  const [code, setCode] = useState("");
  const [giftCode, setGiftCode] = useState("");
  const [appliedCodes, setAppliedCodes] = useState({ code: "", giftCode: "" });
  const [quoted, setQuoted] = useState<{ key: string; value: Quote } | null>(null);
  const [quoteError, setQuoteError] = useState<{ key: string; message: string } | null>(null);
  const [retry, setRetry] = useState(0);
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const submitting = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const { name, email, phone, street, addressExtra, city, zip, shippingName } = customer;
  const setField = (field: keyof typeof customer) => (value: string) => setCustomer(current => ({ ...current, [field]: value }));

  const shipping = site.shop.shipping.find(method => method.name === shippingName) ?? null;
  const pickup = shipping ? isPickupZone(shipping.zone) : false;
  const needed = requiredPolicyIds(site.shop.policies, "both");
  const policiesReady = needed.every(id => site.acceptedPolicies.includes(id));
  const checkoutPolicies = site.shop.policies.filter(policy => policy.checkout !== "hidden" || needed.includes(policy.id));
  const quoteKey = JSON.stringify({ lines: site.cart.map(storefrontLine), ...appliedCodes, shippingName, email: email.trim() });
  const quote = quoted?.key === quoteKey ? quoted.value : null;
  const currentQuoteError = quoteError?.key === quoteKey ? quoteError.message : "";
  const calculating = !!shipping && !!site.cart.length && !quote && !currentQuoteError;
  const codesChanged = code.trim() !== appliedCodes.code || giftCode.trim() !== appliedCodes.giftCode;

  useEffect(() => { setCustomer(readCustomerDraft()); setDraftReady(true); }, []);
  useEffect(() => {
    if (draftReady) {
      try { writeCustomerDraft(customer); } catch { /* Checkout remains usable without session storage. */ }
    }
  }, [customer, draftReady]);

  useEffect(() => {
    if (!site.cart.length || !shipping) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/storely/quote", { method: "POST", headers: { "content-type": "application/json" }, body: quoteKey, signal: controller.signal });
        const body = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok || !body?.ok) throw new Error(body?.reason || "לא הצלחנו לחשב את הסכום. נסי שוב.");
        setQuoteError(null);
        setQuoted({ key: quoteKey, value: body });
        if ((appliedCodes.code || appliedCodes.giftCode) && body.addGift && body.giftVariantId && !site.cart.some(line => line.gift && line.variantId === body.giftVariantId)) {
          site.addLine({ key: `gift:${body.giftVariantId}:1`, variantId: body.giftVariantId, productId: "", name: body.giftTitle || "מתנה", detail: "מתנה", image: "", unitPrice: 0, quantity: body.giftQuantity || 1, bundle: false, gift: true }, false, false);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setQuoted(null);
        setQuoteError({ key: quoteKey, message: error instanceof Error && !(error instanceof TypeError) ? error.message : "לא הצלחנו לחשב את הסכום. בדקי את החיבור ונסי שוב." });
      }
    }, 300);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [quoteKey, retry, shipping, site.cart, site.addLine, appliedCodes.code, appliedCodes.giftCode]);

  function applyCodes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedCodes({ code: code.trim(), giftCode: giftCode.trim() });
    setQuoteError(null); setQuoted(null); setRetry(value => value + 1);
    if (!code.trim() && !giftCode.trim()) site.cart.filter(line => line.gift).forEach(line => site.removeLine(line.key));
  }

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !canSubmit) return;
    submitting.current = true; setPending(true); setReason("");
    let leaving = false;
    try {
      const response = await fetch("/api/storely/order", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ lines: site.cart.map(storefrontLine), name: name.trim(), email: email.trim(), phone: phone.trim(), city: pickup ? "" : city.trim(), street: pickup ? "" : [street.trim(), addressExtra.trim()].filter(Boolean).join(", "), zip: pickup ? "" : zip.trim(), shippingName, ...appliedCodes, policies: site.acceptedPolicies }),
      });
      const body = await response.json().catch(() => null);
      const paymentUrl = typeof body?.url === "string" ? body.url : "";
      if (response.ok && body?.ok && paymentUrl.startsWith("https://pay.hyp.co.il/p/?")) {
        leaving = true;
        window.location.assign(paymentUrl);
        return;
      }
      if (!response.ok || !body?.ok || !body.orderNumber) { setReason(body?.reason || "ההזמנה לא נשמרה. הפרטים שלך נשארו כאן, ואפשר לנסות שוב."); return; }
      setOrderNumber(String(body.orderNumber)); site.clearCart();
    } catch {
      setReason("לא התקבל אישור מהשרת. הפרטים נשמרו כאן; לפני ניסיון נוסף, בדקי אם התקבל אישור הזמנה.");
    } finally { if (!leaving) { submitting.current = false; setPending(false); } }
  }

  useEffect(() => { if (reason || orderNumber) statusRef.current?.focus(); }, [reason, orderNumber]);
  const currency = site.shop.currency;
  const subtotal = cartSubtotal(site.cart);
  const count = site.cart.reduce((sum, line) => sum + line.quantity, 0);
  const canSubmit = !pending && !!quote && !quote.addGift && !!shipping && policiesReady && !codesChanged && site.cart.length > 0;
  const displayedTotal = quote ? formatMoney(quote.total, quote.currency) : formatMoney(subtotal, currency);

  if (orderNumber) return <section className="checkout-page checkout-done" ref={statusRef} tabIndex={-1}>
    <span className="checkout-state-icon" aria-hidden="true">✓</span><span className="checkout-eyebrow">תודה שבחרת ב־SHIR LAVY</span><h1>ההזמנה התקבלה</h1><p>מספר ההזמנה שלך: <bdi>{orderNumber}</bdi></p><Link href="/shop" className="checkout-primary">בחזרה לחנות <CommerceIcon name="arrow" /></Link>
  </section>;
  if (draftReady && !site.cart.length) return <section className="checkout-page checkout-empty">
    <span className="checkout-state-icon"><CommerceIcon name="bag" width={30} height={30} /></span><h1>העגלה שלך מחכה לך</h1><p>בחרי את המוצרים שלך, וניפגש כאן להשלמת ההזמנה.</p><Link href="/shop" className="checkout-primary">לגלות את החנות <CommerceIcon name="arrow" /></Link>
  </section>;

  return <section className="checkout-page">
    <div className="checkout">
      <div className="checkout__main">
        <header className="checkout-intro"><span className="checkout-eyebrow">הפרטים הקטנים, בדרך אלייך</span><h1>השלמת ההזמנה</h1><p>עוד כמה פרטים, ואנחנו כמעט שם.</p></header>
        <form id="checkout-form" onSubmit={placeOrder}>
          <fieldset className="checkout-form-fields" disabled={pending}>
            <section className="checkout-block" aria-labelledby="checkout-contact-title">
              <div className="checkout-block__heading"><span aria-hidden="true">01</span><div><h2 id="checkout-contact-title">פרטי קשר</h2><p>כדי שנוכל לעדכן אותך לגבי ההזמנה.</p></div></div>
              <div className="checkout-grid">
                <Field id="checkout-name" label="שם מלא" value={name} onChange={setField("name")} autoComplete="name" required placeholder="שם פרטי ושם משפחה" />
                <Field id="checkout-phone" label="טלפון נייד" value={phone} onChange={setField("phone")} autoComplete="tel" inputMode="tel" type="tel" dir="ltr" required pattern="(?:[^0-9]*[0-9]){9,}[^0-9]*" title="מספר טלפון עם 9 ספרות לפחות" placeholder="050-0000000" />
                <Field id="checkout-email" label="כתובת אימייל" value={email} onChange={setField("email")} autoComplete="email" type="email" inputMode="email" dir="ltr" required className="checkout-grid__wide" placeholder="you@example.com" />
              </div>
            </section>
            <section className="checkout-block" aria-labelledby="checkout-shipping-title">
              <div className="checkout-block__heading"><span aria-hidden="true">02</span><div><h2 id="checkout-shipping-title">משלוח ואיסוף</h2><p>בחרי איך ההזמנה תגיע אלייך.</p></div></div>
              {site.shop.shipping.length ? <fieldset className="ship-list"><legend className="checkout-sr-only">אפשרויות משלוח ואיסוף</legend>
                {site.shop.shipping.map(method => <label key={method.name} className={`ship-option${shippingName === method.name ? " is-on" : ""}`}>
                  <input type="radio" name="shipping" value={method.name} checked={shippingName === method.name} onChange={() => setField("shippingName")(method.name)} required /><span>{method.name}</span><b>{method.price === 0 && isPickupZone(method.zone) ? "ללא עלות" : formatShippingPrice(method.price, currency)}</b>
                </label>)}
              </fieldset> : <div className="checkout-notice"><CommerceIcon name="delivery" /><div><strong>המשלוחים אינם זמינים כרגע</strong><p>לא ניתן להשלים הזמנה כרגע. <Link href="/contact">צרי איתנו קשר לעזרה</Link>.</p></div></div>}
              {pickup ? <p className="checkout-note">בחרת באיסוף עצמי — אין צורך בכתובת למשלוח.</p> : <div className="checkout-grid checkout-address">
                <Field id="checkout-street" label="רחוב ומספר בית" value={street} onChange={setField("street")} autoComplete="address-line1" required className="checkout-grid__wide" placeholder="שם הרחוב ומספר הבית" />
                <Field id="checkout-address-extra" label="דירה, קומה או כניסה" optional value={addressExtra} onChange={setField("addressExtra")} autoComplete="address-line2" className="checkout-grid__wide" />
                <Field id="checkout-city" label="עיר / יישוב" value={city} onChange={setField("city")} autoComplete="address-level2" required />
                <Field id="checkout-zip" label="מיקוד" optional value={zip} onChange={setField("zip")} autoComplete="postal-code" inputMode="numeric" dir="ltr" />
              </div>}
            </section>
            <section className="checkout-block checkout-confirm" aria-labelledby="checkout-confirm-title">
              <div className="checkout-block__heading"><span aria-hidden="true">03</span><div><h2 id="checkout-confirm-title">בדיקה ואישור</h2><p>בדקי שהפרטים וסיכום ההזמנה נכונים.</p></div></div>
              {checkoutPolicies.map(policy => <PolicyRow key={policy.id} id={policy.id} title={policy.title} mode={needed.includes(policy.id) ? "checkbox" : policy.checkout} />)}
              {!policiesReady ? <p className="checkout-note">יש לאשר את התנאים לפני השלמת ההזמנה.</p> : null}
              {codesChanged ? <p className="checkout-note">לחצי על „החלת הקודים” בסיכום ההזמנה כדי לעדכן את הסכום.</p> : null}
              {currentQuoteError ? <div className="checkout-error" role="alert">{currentQuoteError} <button type="button" onClick={() => { setQuoteError(null); setRetry(value => value + 1); }}>לנסות שוב</button></div> : null}
              {reason ? <div className="checkout-error" role="alert" ref={statusRef} tabIndex={-1}>{reason}</div> : null}
              <button type="submit" className="checkout-primary checkout-pay" disabled={!canSubmit} aria-busy={pending || calculating}><span>{pending ? "מעבירים לתשלום…" : calculating ? "מחשבים את הסכום…" : "לתשלום"}</span><span>{quote ? displayedTotal : <CommerceIcon name="arrow" />}</span></button>
            </section>
          </fieldset>
        </form>
        <footer className="checkout-footer"><Link href="/shop">חזרה לחנות</Link><span>SHIR LAVY · Aesthetics & Academy</span></footer>
      </div>
      <aside className={`checkout__summary${summaryOpen ? " is-open" : ""}`} aria-label="סיכום הזמנה">
        <button className="checkout-summary-toggle" type="button" aria-expanded={summaryOpen} aria-controls="checkout-summary-body" onClick={() => setSummaryOpen(value => !value)}><span><CommerceIcon name="bag" /> סיכום ההזמנה <span aria-hidden="true">{summaryOpen ? "−" : "+"}</span></span><b>{displayedTotal}</b></button>
        <div id="checkout-summary-body" className="checkout-summary-body">
          <div className="checkout-summary-heading"><h2>ההזמנה שלך</h2><span>{count === 1 ? "פריט אחד" : `${count} פריטים`}</span><button type="button" disabled={pending} onClick={site.openCart}>עריכה</button></div>
          <ul className="summary-lines">{site.cart.map(line => <li key={line.key}>
            <span className="summary-lines__photo">{line.image ? <img src={line.image} alt="" /> : <CommerceIcon name="bag" />}<i aria-label={`כמות: ${line.quantity}`}>{line.quantity}</i></span>
            <span className="summary-lines__name"><strong>{line.name}</strong>{line.detail ? <small>{line.detail}</small> : null}</span><b>{formatMoney(line.unitPrice * line.quantity, currency)}</b>
          </li>)}</ul>
          <form className="summary-codes" onSubmit={applyCodes}>
            <Field id="checkout-code" label="קוד הנחה" optional value={code} onChange={setCode} disabled={pending} autoComplete="off" />
            <details className="summary-gift"><summary>יש לך גם קוד מתנה?</summary><Field id="checkout-gift-code" label="קוד מתנה" value={giftCode} onChange={setGiftCode} disabled={pending} autoComplete="off" /></details>
            <button className="summary-codes__apply" type="submit" disabled={pending || (!codesChanged && !currentQuoteError)}>החלת הקודים <span aria-hidden="true">←</span></button>
            <div className="checkout-code-status" role="status">{codesChanged ? "הקודים טרם הוחלו." : currentQuoteError || ((appliedCodes.code || appliedCodes.giftCode) ? (quote ? "הקודים נבדקו והסיכום מעודכן." : shipping ? "בודקים את הקודים…" : "הקודים ייבדקו לאחר בחירת משלוח.") : null)}</div>
          </form>
          {quote?.bundleBlocked ? <p className="checkout-error">הקוד לא חל כי המוצר הנדרש נקנה בבאנדל.</p> : null}
          <dl className="summary-totals">
            <div><dt>סכום ביניים</dt><dd>{formatMoney(subtotal, currency)}</dd></div>
            {quote && quote.discount > 0 ? <div className="summary-totals__discount"><dt>הנחה</dt><dd>−{formatMoney(quote.discount, quote.currency)}</dd></div> : null}
            <div><dt>{pickup ? "איסוף עצמי" : "משלוח"}</dt><dd>{quote ? (quote.shipping == null ? "לפי שיטת המשלוח" : quote.shipping === 0 ? "ללא עלות" : formatMoney(quote.shipping, quote.currency)) : shipping ? "בחישוב" : "טרם נבחר"}</dd></div>
            <div className="is-total"><dt>{quote ? "סה״כ להזמנה" : "סכום ביניים"}</dt><dd><small>{quote?.currency || currency}</small>{displayedTotal}</dd></div>
          </dl>
          {!quote ? <p className="checkout-note">הסכום הסופי יחושב לאחר בחירת משלוח והחלת קודים.</p> : null}
        </div>
      </aside>
    </div>
  </section>;
}

function Field({ label, value, onChange, className, optional, ...input }: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & { id: string; label: string; value: string; onChange: (value: string) => void; optional?: boolean }) {
  return <label className={`checkout-field${className ? ` ${className}` : ""}`} htmlFor={input.id}><span>{label}{optional ? <small> (לא חובה)</small> : null}</span><input {...input} value={value} onChange={event => onChange(event.target.value)} /></label>;
}
