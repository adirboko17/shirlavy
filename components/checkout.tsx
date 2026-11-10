"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { formatMoney, formatShippingPrice, isPickupZone, lineKey, storefrontLine, type CartLine, type Currency } from "@/lib/shop-model";
import { readCustomerDraft, useSite, writeCustomerDraft } from "@/lib/site";
import { cartSubtotal } from "./cart-drawer";
import { LegalLinks } from "./legal-controls";
import { CommerceIcon } from "./commerce-icon";

type Quote = {
  ok: true; total: number; currency: Currency; shipping: number | null; discount: number;
  addGift: boolean; giftVariantId: string; giftQuantity: number; giftTitle: string; bundleBlocked: boolean;
};

export function CheckoutPage() {
  const site = useSite();
  const recoverId = useSearchParams().get("recover") ?? "";
  const recovering = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(recoverId);
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const submitting = useRef(false);
  const restored = useRef("");
  const siteRef = useRef(site);
  siteRef.current = site;
  const statusRef = useRef<HTMLDivElement>(null);
  const { name, email, phone, street, addressExtra, city, zip, shippingName } = customer;
  const setField = (field: keyof typeof customer) => (value: string) => setCustomer(current => ({ ...current, [field]: value }));

  const shipping = site.shop.shipping.find(method => method.name === shippingName) ?? null;
  const pickup = shipping ? isPickupZone(shipping.zone) : false;
  const quoteKey = JSON.stringify({ lines: site.cart.map(storefrontLine), ...appliedCodes, shippingName, email: email.trim() });
  const quote = quoted?.key === quoteKey ? quoted.value : null;
  const currentQuoteError = quoteError?.key === quoteKey ? quoteError.message : "";
  const calculating = !!shipping && !!site.cart.length && !quote && !currentQuoteError;
  const codesChanged = code.trim() !== appliedCodes.code || giftCode.trim() !== appliedCodes.giftCode;

  useEffect(() => {
    if (recovering) return;
    setCustomer(readCustomerDraft());
    setDraftReady(true);
  }, [recovering]);

  useEffect(() => {
    if (!recovering || restored.current === recoverId || siteRef.current.shop.products.length === 0) return;
    restored.current = recoverId;
    let active = true;
    void fetch("/api/storely/checkout/recover", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: recoverId }),
    })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!active) return;
        if (!response.ok || !body?.ok || !Array.isArray(body.lines)) {
          setReason(typeof body?.reason === "string" ? body.reason : "העגלה לא נמצאה");
          return;
        }
        const lines = body.lines.flatMap((item: Record<string, unknown>) => {
          const id = typeof item.id === "string" ? item.id : "";
          const product = siteRef.current.shop.products.find((entry) => entry.variants.some((variant) => variant.id === id) || entry.id === id);
          const variant = product?.variants.find((entry) => entry.id === id) ?? product?.variants[0];
          const quantity = Number(item.quantity);
          if (!product || !variant || !Number.isInteger(quantity) || quantity < 1) return [];
          const line: CartLine = {
            key: lineKey(variant.id, undefined, Number(item.price) === 0),
            variantId: variant.id,
            productId: product.id,
            name: typeof item.name === "string" && item.name ? item.name : product.name,
            detail: typeof item.detail === "string" ? item.detail : "",
            image: typeof item.image === "string" && item.image ? item.image : product.images[0] ?? "",
            unitPrice: Number(item.price) || variant.price || product.price,
            quantity,
            bundle: false,
            gift: Number(item.price) === 0,
          };
          return [line];
        });
        if (!lines.length) {
          setReason("העגלה לא נמצאה");
          return;
        }
        siteRef.current.restoreCart(lines);
        const next = {
          name: typeof body.name === "string" ? body.name : "",
          email: typeof body.email === "string" ? body.email : "",
          phone: typeof body.phone === "string" ? body.phone : "",
          street: typeof body.street === "string" ? body.street : "",
          addressExtra: "",
          city: typeof body.city === "string" ? body.city : "",
          zip: typeof body.zip === "string" ? body.zip : "",
          shippingName: "",
        };
        writeCustomerDraft(next);
        setCustomer(next);
      })
      .catch(() => {
        if (active) setReason("העגלה לא נמצאה");
      })
      .finally(() => {
        if (active) setDraftReady(true);
      });
    return () => {
      active = false;
    };
  }, [recoverId, recovering, site.shop.products.length]);
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
        body: JSON.stringify({ lines: site.cart.map(storefrontLine), name: name.trim(), email: email.trim(), phone: phone.trim(), city: pickup ? "" : city.trim(), street: pickup ? "" : [street.trim(), addressExtra.trim()].filter(Boolean).join(", "), zip: pickup ? "" : zip.trim(), shippingName, ...appliedCodes, policies: termsAccepted ? ["terms"] : [] }),
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
  const canSubmit = !pending && !!quote && !quote.addGift && !!shipping && termsAccepted && !codesChanged && site.cart.length > 0;
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
              <p className="checkout-privacy">הפרטים נמסרים מרצונך לשיר לביא לצורך טיפול בהזמנה, תשלום ומשלוח, ויועברו לספקי השירות הנדרשים לכך. ללא פרטי החובה לא ניתן להשלים הזמנה. לפרטי קשר ולזכויות עיון ותיקון: <Link href="/policies/privacy" target="_blank" rel="noopener noreferrer">מדיניות הפרטיות (נפתחת בחלון חדש)</Link>.</p>
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
              <p className="checkout-note">משלוחים לכל הארץ עד 5 ימי עסקים. <Link href="/policies/shipping" target="_blank" rel="noopener noreferrer">לתנאי המשלוח (חלון חדש)</Link></p>
              {pickup ? <p className="checkout-note">בחרת באיסוף עצמי — אין צורך בכתובת למשלוח.</p> : <div className="checkout-grid checkout-address">
                <Field id="checkout-street" label="רחוב ומספר בית" value={street} onChange={setField("street")} autoComplete="address-line1" required className="checkout-grid__wide" placeholder="שם הרחוב ומספר הבית" />
                <Field id="checkout-address-extra" label="דירה, קומה או כניסה" optional value={addressExtra} onChange={setField("addressExtra")} autoComplete="address-line2" className="checkout-grid__wide" />
                <Field id="checkout-city" label="עיר / יישוב" value={city} onChange={setField("city")} autoComplete="address-level2" required />
                <Field id="checkout-zip" label="מיקוד" optional value={zip} onChange={setField("zip")} autoComplete="postal-code" inputMode="numeric" dir="ltr" />
              </div>}
            </section>
            <section className="checkout-block checkout-confirm" aria-label="אישור ותשלום">
              {codesChanged ? <p className="checkout-note">לחצי על „החלת הקודים” בסיכום ההזמנה כדי לעדכן את הסכום.</p> : null}
              {currentQuoteError ? <div className="checkout-error" role="alert">{currentQuoteError} <button type="button" onClick={() => { setQuoteError(null); setRetry(value => value + 1); }}>לנסות שוב</button></div> : null}
              {reason ? <div className="checkout-error" role="alert" ref={statusRef} tabIndex={-1}>{reason}</div> : null}
              <div className="checkout-consent"><input id="checkout-terms" type="checkbox" required aria-labelledby="checkout-terms-label" aria-describedby="checkout-terms-help" checked={termsAccepted} onChange={event => setTermsAccepted(event.target.checked)} /><div><span id="checkout-terms-label"><label htmlFor="checkout-terms">קראתי ואני מסכימה ל</label><Link href="/policies/terms" target="_blank" rel="noopener noreferrer">תקנון האתר</Link>, הכולל את תנאי הרכישה, המשלוחים והביטולים.</span><small id="checkout-terms-help">התקנון נפתח בחלון חדש. האישור אינו הרשמה לדיוור פרסומי.</small></div></div>
              <button type="submit" className="checkout-primary checkout-pay" disabled={!canSubmit} aria-busy={pending || calculating}><span>{pending ? "מעבירים לתשלום…" : calculating ? "מחשבים את הסכום…" : "לתשלום"}</span><span>{quote ? displayedTotal : <CommerceIcon name="arrow" />}</span></button>
            </section>
          </fieldset>
        </form>
        <footer className="checkout-footer"><LegalLinks /><span>SHIR LAVY · Aesthetics & Academy</span></footer>
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
