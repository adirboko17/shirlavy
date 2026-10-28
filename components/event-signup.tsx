"use client";

import { useState, type CSSProperties } from "react";
import { formatMoney, type Currency } from "@/lib/shop-model";

export function EventSignup({ slug, price, currency, open }: { slug: string; price: number; currency: Currency; open: boolean }) {
  const [stage, setStage] = useState<"pregnant" | "gave_birth">("pregnant");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [done, setDone] = useState("");

  if (!open) return <p style={{ color: "#5A5A5A" }}>ההרשמה לאירוע הזה סגורה.</p>;
  if (done) return <p>{done}</p>;

  async function register(form: FormData) {
    setPending(true);
    setMessage("");
    const response = await fetch("/api/storely/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventSlug: slug,
        fullName: form.get("fullName"),
        phone: form.get("phone"),
        email: form.get("email"),
        stage,
        dueDate: stage === "pregnant" ? form.get("dueDate") || null : null,
        pregnancyWeek: stage === "pregnant" ? Number(form.get("pregnancyWeek")) || null : null,
        babyBirthDate: stage === "gave_birth" ? form.get("babyBirthDate") || null : null,
        termsAccepted: form.get("terms") === "on",
        marketingConsent: form.get("marketing") === "on",
      }),
    });
    const body = await response.json().catch(() => null);
    setPending(false);
    if (!body?.ok) {
      setMessage(body?.reason || "ההרשמה לא נשמרה");
      return;
    }
    if (body.pending && body.registrationId) {
      setRegistrationId(body.registrationId);
      return;
    }
    setDone("ההרשמה נסגרה. אישור יישלח מהחנות.");
  }

  async function pay() {
    setPending(true);
    const response = await fetch("/api/storely/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "confirm", registrationId }),
    });
    const body = await response.json().catch(() => null);
    setPending(false);
    if (!body?.ok) {
      setMessage(body?.reason || "התשלום לא נרשם");
      return;
    }
    setDone(body.orderNumber ? `התשלום אושר. מספר הזמנה ${body.orderNumber}.` : "התשלום אושר וההרשמה נסגרה.");
  }

  if (registrationId) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ margin: 0 }}>ההרשמה ממתינה לתשלום של {formatMoney(price, currency)}.</p>
        <button type="button" className="pill gold" style={{ height: 52, alignSelf: "flex-start" }} disabled={pending} onClick={() => void pay()}>אישור תשלום</button>
        {message ? <p style={{ color: "#8A3A3A" }}>{message}</p> : null}
      </div>
    );
  }

  return (
    <form action={(form) => void register(form)} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 460 }}>
      <input name="fullName" required placeholder="שם מלא" aria-label="שם מלא" style={field} />
      <input name="phone" required placeholder="טלפון" aria-label="טלפון" style={field} />
      <input name="email" type="email" required placeholder="אימייל" aria-label="אימייל" style={field} />
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" className="chip" onClick={() => setStage("pregnant")} style={{ background: stage === "pregnant" ? "#F5EEE7" : "#F7F5F2" }}>בהריון</button>
        <button type="button" className="chip" onClick={() => setStage("gave_birth")} style={{ background: stage === "gave_birth" ? "#F5EEE7" : "#F7F5F2" }}>אחרי לידה</button>
      </div>
      {stage === "pregnant" ? (
        <>
          <input name="dueDate" type="date" aria-label="תאריך לידה משוער" style={field} />
          <input name="pregnancyWeek" inputMode="numeric" placeholder="שבוע הריון (4–42)" aria-label="שבוע הריון" style={field} />
        </>
      ) : (
        <input name="babyBirthDate" type="date" required aria-label="תאריך לידה של התינוק" style={field} />
      )}
      <label style={{ display: "flex", gap: 8, fontSize: 14 }}>
        <input name="terms" type="checkbox" required />
        קראתי ואני מסכימה לתנאים
      </label>
      <label style={{ display: "flex", gap: 8, fontSize: 14 }}>
        <input name="marketing" type="checkbox" />
        אני מסכימה לקבל דיוור
      </label>
      {message ? <p style={{ margin: 0, color: "#8A3A3A" }}>{message}</p> : null}
      <button type="submit" className="pill gold" style={{ height: 52, alignSelf: "flex-start" }} disabled={pending}>
        {price === 0 ? "הרשמה" : `המשך לתשלום ${formatMoney(price, currency)}`}
      </button>
    </form>
  );
}

const field: CSSProperties = { height: 48, border: 0, borderRadius: 999, background: "#F7F5F2", padding: "0 16px", font: "inherit" };
