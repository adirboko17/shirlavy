"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fmt } from "@/lib/data";
import { useSite } from "@/lib/site";
import { Slot } from "./ui";

type Done = { method: string; total: number; email: string; name: string; ship: string; address: string };

export function CheckoutPage() {
  const { lines, subtotal, mobile, clearCart } = useSite();
  const router = useRouter();
  const search = useSearchParams();
  const [form, setForm] = useState({ email: "", phone: "", fullName: "", city: "", street: "", house: "", apt: "", zip: "", notes: "", card: "", exp: "", cvv: "", idn: "", ship: "courier", installments: "1", terms: false });
  const [tried, setTried] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const [sumOpen, setSumOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [ap, setAp] = useState(false);
  const [apFocus, setApFocus] = useState(false);
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState("");

  useEffect(() => {
    try {
      const w = window as Window & { ApplePaySession?: { canMakePayments: () => boolean } };
      setAp(!!(w.ApplePaySession && w.ApplePaySession.canMakePayments()));
    } catch { /* ignore */ }
    if (search.get("pay") === "applepay") setApFocus(true);
  }, [search]);

  const shipCost = form.ship === "courier" ? 35 : 0;
  const total = subtotal + shipCost;
  const needs = form.ship === "courier";
  const E = {
    email: !/^\S+@\S+\.\S+$/.test(form.email) ? "נא למלא כתובת אימייל תקינה" : "",
    phone: !/^0\d{8,9}$/.test(form.phone.replace(/[\s-]/g, "")) ? "נא למלא מספר נייד תקין" : "",
    fullName: form.fullName.trim().length < 2 ? "נא למלא שם מלא" : "",
    city: needs && !form.city.trim() ? "נא למלא עיר" : "",
    street: needs && !form.street.trim() ? "נא למלא רחוב" : "",
    house: needs && !form.house.trim() ? "חובה" : "",
  };
  const cardBad = form.card.replace(/\D/g, "").length < 12 || !/^\d{2}\/?\d{2}$/.test(form.exp) || form.cvv.length < 3 || form.idn.replace(/\D/g, "").length < 8;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const finish = (method: string) => {
    setDone({ method, total, email: form.email, name: form.fullName, ship: form.ship, address: form.ship === "courier" ? [form.street, form.house, form.city].filter(Boolean).join(" ") || "—" : "הקליניקה" });
    setSheet(false);
    clearCart();
    window.scrollTo(0, 0);
  };

  if (done) {
    return (
      <section style={{ padding: "clamp(110px,14vh,140px) 16px 100px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", borderRadius: 28, background: "#fff", border: "1px solid rgba(41,37,34,.08)", padding: "clamp(28px,5vw,56px)", display: "flex", flexDirection: "column", gap: 18, alignItems: "center", textAlign: "center" }}>
          <span style={{ width: 64, height: 64, borderRadius: "50%", background: "#F7F5F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✓</span>
          <h1 style={{ margin: 0, fontWeight: 300, fontSize: "clamp(32px,4.4vw,52px)", lineHeight: 1.1, letterSpacing: "-.03em" }}>{done.name.trim() ? `תודה, ${done.name.trim().split(" ")[0]}.` : "תודה."}<br />ההזמנה התקבלה.</h1>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "#5A5A5A" }}>אישור יישלח אל {done.email || "כתובת האימייל שלך"}.</p>
          <div style={{ width: "100%", borderRadius: 20, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10, fontSize: 14, textAlign: "right" }}>
            <Row k="מספר הזמנה" v={"SL-DEMO-" + String(1000 + ((done.email.length * 37) % 9000))} ltr />
            <Row k="תשלום" v={done.method} />
            <Row k="משלוח" v={done.ship === "courier" ? "שליח עד הבית" : "איסוף עצמי"} />
            <Row k="כתובת" v={done.address} />
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(41,37,34,.08)", paddingTop: 10, fontSize: 16, fontWeight: 500 }}><span>סה״כ</span><span>{fmt(done.total)}</span></div>
          </div>
          <span style={{ fontSize: 12, color: "#8A8A8A" }}>תצוגת עיצוב: לא בוצע חיוב.</span>
          <button type="button" className="pill gold" onClick={() => router.push("/shop")}>להמשך קנייה</button>
        </div>
      </section>
    );
  }

  if (!lines.length) {
    return (
      <section style={{ padding: "180px 24px 140px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
        <h1 style={{ margin: 0, fontWeight: 300, fontSize: 40, letterSpacing: "-.03em" }}>הסל ריק</h1>
        <button type="button" className="pill gold" onClick={() => router.push("/shop")}>חזרה לחנות</button>
      </section>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(E).some(Boolean) || cardBad || !form.terms) { setTried(true); return; }
    setError(false);
    finish("כרטיס אשראי");
  };

  return (
    <section style={{ padding: "clamp(96px,11vh,112px) clamp(12px,3vw,48px) 96px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
        {mobile ? (
          <div style={{ flex: "1 1 100%", borderRadius: 22, background: "#F7F5F2" }}>
            <button type="button" onClick={() => setSumOpen((v) => !v)} aria-expanded={sumOpen} style={{ width: "100%", height: 58, padding: "0 20px", border: 0, background: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
              <span>{sumOpen ? "הסתרת סיכום ההזמנה ▴" : "הצגת סיכום ההזמנה ▾"}</span>
              <span style={{ fontSize: 17, fontWeight: 500 }}>{fmt(total)}</span>
            </button>
            {sumOpen ? <div style={{ padding: "0 20px 18px", display: "flex", flexDirection: "column", gap: 10 }}>{lines.map((l) => <div key={l.key} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14 }}><span>{l.name} × {l.qty}</span><span>{l.total}</span></div>)}</div> : null}
          </div>
        ) : null}
        <form onSubmit={submit} noValidate style={{ flex: "1.4 1 520px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <h1 style={{ margin: "0 0 8px", padding: "0 6px", fontWeight: 300, fontSize: "clamp(34px,3.8vw,48px)", letterSpacing: "-.03em" }}>תשלום</h1>
          {error ? <div role="alert" style={{ borderRadius: 20, background: "#F6E7E1", padding: "16px 20px", color: "#7A2E1C" }}><div style={{ fontWeight: 600 }}>התשלום לא אושר</div><div style={{ fontSize: 14, lineHeight: 1.6 }}>לא בוצע חיוב. אפשר לנסות שוב, לבדוק את פרטי הכרטיס או לבחור אמצעי תשלום אחר.</div></div> : null}
          <div className="panel" style={{ alignItems: "stretch" }}>
            <span style={{ fontSize: 13, color: "#5A5A5A", textAlign: "center" }}>תשלום מהיר</span>
            {ap ? (
              <button type="button" aria-label="תשלום עם Apple Pay" dir="ltr" className="apple" style={{ outline: apFocus ? "2px solid #A47B58" : "none", outlineOffset: 3 }} onClick={() => setSheet(true)}>Pay with <span style={{ fontWeight: 600 }}>Apple Pay</span></button>
            ) : (
              <div style={{ minHeight: 54, borderRadius: 999, border: "1px dashed rgba(41,37,34,.18)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13, color: "#5A5A5A", padding: "8px 18px", textAlign: "center" }}><span dir="ltr" style={{ fontWeight: 600, color: "#1C1C1C" }}>Apple Pay</span><span>יוצג במכשירי Apple ובדפדפנים תומכים</span></div>
            )}
          </div>
          <fieldset className="panel">
            <legend className="sr">פרטי התקשרות</legend>
            <Step n="1" title="פרטי התקשרות" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 14 }}>
              <Box label="אימייל" name="email" type="email" dir="ltr" value={form.email} onChange={set("email")} bad={tried && !!E.email} err={E.email} ac="email" />
              <Box label="טלפון נייד" name="phone" type="tel" dir="ltr" value={form.phone} onChange={set("phone")} bad={tried && !!E.phone} err={E.phone} ac="tel" />
            </div>
          </fieldset>
          <fieldset className="panel">
            <legend className="sr">משלוח</legend>
            <Step n="2" title="משלוח" />
            {[
              ["courier", "שליח עד הבית", "[זמן אספקה משוער]", 35],
              ["pickup", "איסוף עצמי מהקליניקה", "[כתובת ושעות איסוף]", 0],
            ].map(([k, label, sub, price]) => (
              <button key={k as string} type="button" role="radio" aria-checked={form.ship === k} onClick={() => setForm((s) => ({ ...s, ship: k as string }))} style={{ display: "flex", alignItems: "center", gap: 14, minHeight: 64, padding: "12px 18px", borderRadius: 18, border: `1px solid ${form.ship === k ? "#1C1C1C" : "rgba(41,37,34,.08)"}`, background: "#fff", cursor: "pointer", textAlign: "right", color: "#1C1C1C", fontFamily: "inherit" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", border: "1.5px solid #1C1C1C", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: form.ship === k ? "#1C1C1C" : "transparent" }} /></span>
                <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}><span style={{ fontSize: 15 }}>{label}</span><span style={{ fontSize: 13, color: "#8A8A8A" }}>{sub}</span></span>
                <span style={{ fontSize: 14 }}>{price ? fmt(price as number) : "ללא עלות"}</span>
              </button>
            ))}
            {needs ? (
              <div className="addr">
                <Box label="שם מלא" name="fullName" value={form.fullName} onChange={set("fullName")} bad={tried && !!E.fullName} err={E.fullName} span={6} ac="name" />
                <Box label="עיר / יישוב" name="city" value={form.city} onChange={set("city")} bad={tried && !!E.city} err={E.city} span={3} ac="address-level2" />
                <Box label="רחוב" name="street" value={form.street} onChange={set("street")} bad={tried && !!E.street} err={E.street} span={3} ac="address-line1" />
                <Box label="מספר בית" name="house" value={form.house} onChange={set("house")} bad={tried && !!E.house} err={E.house} span={2} />
                <Box label="דירה (לא חובה)" name="apt" value={form.apt} onChange={set("apt")} span={2} />
                <Box label="מיקוד (לא חובה)" name="zip" value={form.zip} onChange={set("zip")} span={2} ac="postal-code" />
                <Box label="הערות לשליח (לא חובה)" name="notes" value={form.notes} onChange={set("notes")} span={6} />
              </div>
            ) : null}
          </fieldset>
          <fieldset className="panel">
            <legend className="sr">תשלום בכרטיס</legend>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <Step n="3" title="כרטיס אשראי" />
              <span dir="ltr" style={{ fontSize: 11, letterSpacing: ".04em", color: "#8A8A8A" }}>VISA · MASTERCARD · ISRACARD · AMEX</span>
            </div>
            <div className="addr">
              <Box label="מספר כרטיס" name="card" value={form.card} onChange={set("card")} dir="ltr" ph="0000 0000 0000 0000" span={6} ac="cc-number" bad={tried && cardBad} />
              <Box label="תוקף" name="exp" value={form.exp} onChange={set("exp")} dir="ltr" ph="MM/YY" span={2} ac="cc-exp" bad={tried && cardBad} />
              <Box label="CVV" name="cvv" value={form.cvv} onChange={set("cvv")} dir="ltr" ph="•••" span={2} ac="cc-csc" bad={tried && cardBad} />
              <Box label="ת״ז בעל הכרטיס" name="idn" value={form.idn} onChange={set("idn")} dir="ltr" span={2} bad={tried && cardBad} />
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 220 }}>
              <span style={{ fontSize: 13, color: "#5A5A5A" }}>מספר תשלומים</span>
              <select value={form.installments} onChange={set("installments")} className="box-input" style={{ fontFamily: "inherit" }}>
                <option value="1">תשלום אחד</option>
                <option value="2">2 תשלומים</option>
                <option value="3">3 תשלומים</option>
              </select>
            </label>
            {tried && cardBad ? <span style={{ fontSize: 13, color: "#A0442E" }}>נא להשלים את פרטי הכרטיס.</span> : null}
            <span style={{ fontSize: 12, color: "#8A8A8A", lineHeight: 1.6 }}>בשלב הפיתוח השדות יוחלפו בשדות המאובטחים של ספק הסליקה, ופרטי הכרטיס לא יעברו דרך שרתי האתר.</span>
          </fieldset>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "8px 6px 0" }}>
            <button type="button" role="checkbox" aria-checked={form.terms} onClick={() => setForm((s) => ({ ...s, terms: !s.terms }))} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: 0, padding: "4px 0", cursor: "pointer", textAlign: "right", fontSize: 14, fontFamily: "inherit" }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, border: `1.5px solid ${tried && !form.terms ? "#A0442E" : "#1C1C1C"}`, background: form.terms ? "#1C1C1C" : "#fff", color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{form.terms ? "✓" : ""}</span>
              קראתי ואני מסכימה לתקנון ולמדיניות הפרטיות
            </button>
            <button type="submit" className="pill gold" style={{ height: 58, fontSize: 16 }}>לתשלום {fmt(total)}</button>
            <span style={{ fontSize: 12, color: "#8A8A8A", textAlign: "center" }}>תצוגת עיצוב: התשלום אינו פעיל עד לחיבור ספק סליקה.</span>
          </div>
        </form>
        {!mobile ? (
          <aside style={{ flex: "1 1 340px", minWidth: 0, position: "sticky", top: 100, borderRadius: 28, background: "#F7F5F2", padding: "clamp(20px,2.6vw,28px)", display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>סיכום הזמנה</h2>
            {lines.map((l) => (
              <div key={l.key} style={{ display: "grid", gridTemplateColumns: "60px minmax(0,1fr) auto", gap: 12, alignItems: "center", padding: 8, borderRadius: 18, background: "#fff" }}>
                <div style={{ position: "relative", width: 60, height: 60, borderRadius: 12, overflow: "hidden", background: "#F2EBE4" }}><Slot id={l.slot} fit="contain" /></div>
                <div><div style={{ fontSize: 14, fontWeight: 500 }}>{l.name}</div><div style={{ fontSize: 12, color: "#8A8A8A" }}>{l.meta} · ×{l.qty}</div></div>
                <span style={{ fontSize: 14 }}>{l.total}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6 }}>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="קוד הטבה" aria-label="קוד הטבה" style={{ flex: 1, height: 46, borderRadius: 999, border: 0, background: "#fff", padding: "0 18px", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
              <button type="button" className="pill gold" style={{ height: 46, padding: "0 20px", fontSize: 14 }} onClick={() => setCodeMsg(code.trim() ? "קודי הטבה יופעלו לאחר חיבור מערכת ההנחות." : "נא להזין קוד.")}>החלה</button>
            </div>
            {codeMsg ? <span style={{ fontSize: 12, color: "#5A5A5A" }}>{codeMsg}</span> : null}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
              <Row k="סכום ביניים" v={fmt(subtotal)} />
              <Row k="משלוח" v={shipCost ? fmt(shipCost) : "ללא עלות"} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid rgba(41,37,34,.08)", paddingTop: 12 }}><span>סה״כ</span><span style={{ fontSize: 24, fontWeight: 500 }}>{fmt(total)}</span></div>
              <span style={{ fontSize: 12, color: "#8A8A8A" }}>כולל מע״מ.</span>
            </div>
          </aside>
        ) : null}
      </div>
      {sheet ? (
        <div style={{ position: "fixed", inset: 0, zIndex: 95, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 8px 8px" }}>
          <div role="dialog" aria-modal="true" aria-label="Apple Pay" style={{ width: "min(100%,500px)", background: "#fff", borderRadius: 28, padding: "22px 22px calc(22px + env(safe-area-inset-bottom))", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span dir="ltr" style={{ fontSize: 19, fontWeight: 600 }}>Apple Pay</span>
              <button type="button" onClick={() => setSheet(false)} style={{ height: 40, padding: "0 14px", borderRadius: 999, border: 0, background: "#F2F2F4", color: "#0A66D8", fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>ביטול</button>
            </div>
            <div style={{ background: "#F4F4F6", borderRadius: 18, padding: 16, display: "flex", flexDirection: "column", gap: 10, fontSize: 15 }}>
              <Row k="מוכר" v="SHIR LAVY" ltr />
              <Row k="מטבע" v="ILS · IL" ltr />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}><span>לתשלום</span><span>{fmt(total)}</span></div>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.65, color: "#4A4A50", background: "#FBF6EC", borderRadius: 18, padding: "14px 16px" }}>
              <strong style={{ display: "block", marginBottom: 4 }}>גבול אינטגרציה</strong>
              בגרסה הסופית ייפתח כאן גיליון התשלום המקורי של Apple, לאחר אימות דומיין וחיבור לספק סליקה. כרגע זו הדמיה ולא מתבצע חיוב.
            </div>
            <button type="button" className="apple" onClick={() => finish("Apple Pay")}>הדמיית אישור תשלום</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Step({ n, title }: { n: string; title: string }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 30, height: 30, borderRadius: "50%", background: "#F7F5F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500 }}>{n}</span><span style={{ fontSize: 19, fontWeight: 500 }}>{title}</span></div>;
}

function Row({ k, v, ltr }: { k: string; v: string; ltr?: boolean }) {
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span style={{ color: "#5A5A5A" }}>{k}</span><span dir={ltr ? "ltr" : undefined}>{v}</span></div>;
}

function Box({ label, bad, err, span, ph, ...rest }: { label: string; bad?: boolean; err?: string; span?: number; ph?: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; dir?: "ltr" | "rtl"; ac?: string }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: span ? `span ${span}` : undefined, minWidth: 0 }}>
      <span style={{ fontSize: 13, color: "#5A5A5A" }}>{label}</span>
      <input {...rest} placeholder={ph} autoComplete={rest.ac} aria-invalid={!!bad} className="box-input" style={{ borderColor: bad ? "#A0442E" : "rgba(41,37,34,.12)", textAlign: rest.dir === "ltr" ? "left" : "right" }} />
      {bad && err ? <span style={{ fontSize: 13, color: "#A0442E" }}>{err}</span> : null}
    </label>
  );
}
