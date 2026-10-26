"use client";

import { useState } from "react";
import { waLink } from "@/lib/data";
import { PageHero, SectionLabel, Slot, Socials, h2Style } from "./ui";

const TOPICS = [
  ["brows", "טיפולי גבות"],
  ["removal", "הסרת איפור קבוע"],
  ["aesthetics", "אסתטיקה"],
  ["academy", "האקדמיה"],
  ["shop", "הזמנה מהחנות"],
] as const;

export function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", msg: "", topic: "brows" });
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const errs = {
    name: form.name.trim().length < 2 ? "נא למלא שם מלא" : "",
    phone: !/^0\d{8,9}$/.test(form.phone.replace(/[\s-]/g, "")) ? "נא למלא מספר טלפון תקין" : "",
    email: form.email && !/^\S+@\S+\.\S+$/.test(form.email) ? "כתובת האימייל אינה תקינה" : "",
  };
  const quick = [
    ["ייעוץ לטיפול", "גבות, הסרה או אסתטיקה", "היי שיר, אשמח לתאם ייעוץ ללא עלות לטיפול."],
    ["פרטים על האקדמיה", "מסלולי לימוד ומחזורים", "היי שיר, אשמח לפרטים על האקדמיה."],
    ["שאלה על הזמנה", "מוצרים, משלוחים והחזרות", "היי, יש לי שאלה לגבי הזמנה מהחנות."],
  ];

  return (
    <div>
      <PageHero kicker="יצירת קשר" title="בואי נדבר." text="הדרך המהירה ביותר היא וואטסאפ. שיר עונה באופן אישי לכל פנייה.">
        <a href={waLink("היי שיר, אשמח לדבר איתך.")} target="_blank" rel="noopener noreferrer" className="pill gold" style={{ marginTop: 6 }}>כתבי לשיר בוואטסאפ <span aria-hidden>←</span></a>
      </PageHero>
      <section style={{ padding: "clamp(16px,3vw,32px) clamp(16px,4vw,48px) 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionLabel>במה אפשר לעזור?</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", columnGap: "clamp(24px,4vw,56px)" }}>
            {quick.map(([t, d, msg]) => (
              <a key={t} href={waLink(msg)} target="_blank" rel="noopener noreferrer" className="quick">
                <span><span style={{ fontSize: "clamp(20px,1.8vw,24px)", fontWeight: 300 }}>{t}</span><span style={{ fontSize: 14, color: "#5A5A5A" }}>{d}</span></span>
                <span aria-hidden className="round" style={{ background: "#F5EEE7", color: "#7A573C", fontSize: 16 }}>←</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: "clamp(64px,8vw,112px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(40px,6vw,96px)", alignItems: "flex-start" }}>
          <div style={{ flex: "1.1 1 400px", minWidth: 0, display: "flex", flexDirection: "column", gap: 28 }}>
            <SectionLabel>טופס פנייה</SectionLabel>
            <h2 style={h2Style("clamp(28px,3vw,42px)")}>או השאירי פרטים</h2>
            {sent ? (
              <div role="status" style={{ borderRadius: 24, background: "#F5EEE7", padding: "clamp(28px,3vw,40px)", display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 28, fontWeight: 200 }}>תודה, {form.name.trim().split(" ")[0]}.</span>
                <span style={{ fontSize: 15, lineHeight: 1.7, color: "#5A5A5A" }}>הפנייה התקבלה. שיר תחזור אלייך בהקדם.</span>
                <span style={{ fontSize: 12, color: "#6B6B6B" }}>תצוגת עיצוב: חיבור הטופס יושלם בשלב הפיתוח.</span>
                <button type="button" className="pill ghost" onClick={() => { setForm({ name: "", phone: "", email: "", msg: "", topic: "brows" }); setTried(false); setSent(false); }}>פנייה נוספת</button>
              </div>
            ) : (
              <form noValidate onSubmit={(e) => { e.preventDefault(); if (Object.values(errs).some(Boolean)) setTried(true); else setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 24 }}>
                  {([
                    ["name", "שם מלא", "text"],
                    ["phone", "טלפון", "tel"],
                    ["email", "אימייל (לא חובה)", "email"],
                  ] as const).map(([k, label, type]) => (
                    <label key={k} style={{ display: "flex", flexDirection: "column", gap: 4, gridColumn: k === "email" ? "1 / -1" : "auto" }}>
                      <span style={{ fontSize: 13, color: "#5A5A5A" }}>{label}</span>
                      <input name={k} type={type} value={form[k]} onChange={(e) => setForm((s) => ({ ...s, [k]: e.target.value }))} aria-invalid={tried && !!errs[k]} className="line-input" style={{ borderBottomColor: tried && errs[k] ? "#A0442E" : "rgba(41,37,34,.2)" }} />
                      {tried && errs[k] ? <span style={{ fontSize: 13, color: "#A0442E" }}>{errs[k]}</span> : null}
                    </label>
                  ))}
                </div>
                <div>
                  <span style={{ fontSize: 13, color: "#5A5A5A" }}>נושא הפנייה</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                    {TOPICS.map(([k, label]) => {
                      const on = form.topic === k;
                      return <button key={k} type="button" aria-pressed={on} className="chip" onClick={() => setForm((s) => ({ ...s, topic: k }))} style={{ height: 44, border: `1px solid ${on ? "#8F6A4B" : "rgba(28,28,28,.14)"}`, background: on ? "#8F6A4B" : "#fff", color: on ? "#fff" : "#1C1C1C" }}>{label}</button>;
                    })}
                  </div>
                </div>
                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 13, color: "#5A5A5A" }}>הודעה (לא חובה)</span>
                  <textarea name="msg" rows={3} value={form.msg} onChange={(e) => setForm((s) => ({ ...s, msg: e.target.value }))} className="line-input" style={{ padding: "10px 2px", resize: "vertical", lineHeight: 1.6 }} />
                </label>
                <button type="submit" className="pill gold" style={{ alignSelf: "flex-start", padding: "0 40px" }}>שליחה <span aria-hidden>←</span></button>
              </form>
            )}
          </div>
          <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", background: "#F2EBE4", color: "#999", aspectRatio: "4/3" }}>
              <Slot id="contact-clinic" placeholder="צילום הקליניקה" />
            </div>
            <div>
              {[
                ["הקליניקה", "קליניקת בוטיק לנשים בלבד"],
                ["כתובת", "[כתובת הקליניקה]"],
                ["שעות", "[שעות פעילות]"],
                ["טלפון", "[מספר טלפון]"],
                ["אימייל", "[כתובת אימייל]"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(28,28,28,.1)", fontSize: 15 }}>
                  <span style={{ color: "#7A573C", fontSize: 13, fontWeight: 500 }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
            <Socials />
          </div>
        </div>
      </section>
    </div>
  );
}
