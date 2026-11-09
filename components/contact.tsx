"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT_TREATMENT_TOPICS, PHONE, SITE_EMAIL, waLink } from "@/lib/data";
import slotMap from "@/lib/slot-map.json";
import { Socials } from "./ui";

const TOPICS = [
  ...CONTACT_TREATMENT_TOPICS,
  ["academy", "האקדמיה"],
  ["shop", "הזמנה מהחנות"],
] as const;

const QUICK_LINKS = [
  ["ייעוץ לטיפול", "גבות, הסרה ואסתטיקה", "היי שיר, אשמח לתאם ייעוץ ללא עלות לטיפול."],
  ["פרטים על האקדמיה", "מסלולי לימוד והכשרה", "היי שיר, אשמח לפרטים על האקדמיה."],
  ["שאלה על הזמנה", "מוצרים, משלוחים והחזרות", "היי, יש לי שאלה לגבי הזמנה מהחנות."],
] as const;

export function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", msg: "", topic: "brows" });
  const [tried, setTried] = useState(false);
  const [ready, setReady] = useState(false);
  const statusRef = useRef<HTMLHeadingElement>(null);
  const topicLabel = TOPICS.find(([key]) => key === form.topic)?.[1] ?? "";
  const message = [`היי שיר, שמי ${form.name.trim()}.`, `נושא הפנייה: ${topicLabel}`, `טלפון: ${form.phone.trim()}`, form.email.trim() ? `אימייל: ${form.email.trim()}` : "", form.msg.trim()].filter(Boolean).join("\n");
  const errs = {
    name: form.name.trim().length < 2 ? "נא למלא שם מלא" : "",
    phone: !/^0\d{8,9}$/.test(form.phone.replace(/[\s-]/g, "")) ? "נא למלא מספר טלפון תקין" : "",
    email: form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim()) ? "כתובת האימייל אינה תקינה" : "",
  };

  useEffect(() => {
    if (ready) statusRef.current?.focus();
  }, [ready]);

  return (
    <div className="contact-page">
      <section className="contact-intro" aria-labelledby="contact-title">
        <div className="contact-container contact-intro__inner">
          <div>
            <span className="contact-label">יצירת קשר</span>
            <h1 id="contact-title">בואי נדבר.</h1>
            <p className="contact-intro__subtitle">כל התחלה טובה מתחילה בשיחה אישית.</p>
          </div>
          <div className="contact-intro__aside">
            <p>על טיפול, על לימודים או על משהו קטן שרצית לשאול.<br />שיר עונה באופן אישי לכל פנייה.</p>
            <a href={waLink("היי שיר, אשמח לדבר איתך.")} target="_blank" rel="noopener noreferrer" className="contact-button">כתבי לשיר בוואטסאפ <span aria-hidden="true">←</span></a>
            <a className="contact-text-link" href="#contact-form">או השאירי כאן את פרטי הפנייה <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>

      <section className="contact-quick" aria-labelledby="contact-quick-title">
        <div className="contact-container">
          <h2 className="contact-label" id="contact-quick-title">במה אפשר לעזור?</h2>
          <div className="contact-quick-grid">
            {QUICK_LINKS.map(([title, description, msg], index) => (
              <a key={title} href={waLink(msg)} target="_blank" rel="noopener noreferrer" className="contact-quick-link">
                <span className="contact-quick-link__number" aria-hidden="true">0{index + 1}</span>
                <span className="contact-quick-link__copy"><strong>{title}</strong><span>{description}</span></span>
                <span aria-hidden="true" className="contact-quick-link__arrow">←</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-main" aria-labelledby="contact-form-title">
        <div className="contact-container contact-main__grid">
          <div className="contact-form-panel" id="contact-form">
            <div className="contact-form-heading">
              <span className="contact-label">פנייה אישית</span>
              <h2 id="contact-form-title">מה תרצי לשאול?</h2>
              <p>כמה פרטים, ונכין יחד הודעה לשיר.</p>
            </div>
            {ready ? (
              <div className="contact-ready" role="status">
                <span className="contact-ready__mark" aria-hidden="true">✓</span>
                <h3 ref={statusRef} tabIndex={-1}>ההודעה מוכנה, {form.name.trim().split(" ")[0]}.</h3>
                <p>המשיכי לוואטסאפ, בדקי את הפרטים ושלחי את ההודעה לשיר.</p>
                <a href={waLink(message)} target="_blank" rel="noopener noreferrer" className="contact-button">פתיחת ההודעה בוואטסאפ <span aria-hidden="true">←</span></a>
                <button type="button" className="contact-text-link" onClick={() => setReady(false)}>עריכת הפרטים</button>
              </div>
            ) : (
              <form className="contact-form" noValidate onSubmit={(e) => {
                e.preventDefault();
                const invalid = (Object.keys(errs) as (keyof typeof errs)[]).find(key => errs[key]);
                if (invalid) {
                  setTried(true);
                  (e.currentTarget.elements.namedItem(invalid) as HTMLInputElement | null)?.focus();
                } else setReady(true);
              }}>
                <div className="contact-fields">
                  {([
                    ["name", "שם מלא", "text"],
                    ["phone", "טלפון", "tel"],
                    ["email", "אימייל (לא חובה)", "email"],
                  ] as const).map(([key, label, type]) => (
                    <label key={key} className={`contact-field${key === "email" ? " contact-field--wide" : ""}`}>
                      <span>{label}</span>
                      <input name={key} type={type} required={key !== "email"} dir={key === "name" ? "auto" : "ltr"} value={form[key]} onChange={(e) => setForm(s => ({ ...s, [key]: e.target.value }))} autoComplete={key === "name" ? "name" : key === "phone" ? "tel" : "email"} aria-describedby={tried && errs[key] ? `contact-${key}-error` : undefined} aria-invalid={tried && !!errs[key]} />
                      {tried && errs[key] ? <span className="contact-field__error" id={`contact-${key}-error`}>{errs[key]}</span> : null}
                    </label>
                  ))}
                </div>
                <fieldset className="contact-topics">
                  <legend>נושא הפנייה</legend>
                  <div>
                    {TOPICS.map(([key, label]) => <button key={key} type="button" aria-pressed={form.topic === key} onClick={() => setForm(s => ({ ...s, topic: key }))}>{label}</button>)}
                  </div>
                </fieldset>
                <label className="contact-field">
                  <span>הודעה (לא חובה)</span>
                  <textarea name="msg" rows={4} value={form.msg} onChange={(e) => setForm(s => ({ ...s, msg: e.target.value }))} placeholder="מוזמנת לכתוב לי כאן…" />
                </label>
                <div className="contact-form-footer">
                  <button type="submit" className="contact-button">הכנת הודעה לוואטסאפ <span aria-hidden="true">←</span></button>
                  <p className="contact-form-note">השליחה מתבצעת בוואטסאפ, לאחר שתאשרי את ההודעה.</p>
                </div>
              </form>
            )}
          </div>

          <aside className="contact-clinic" aria-label="הקליניקה ופרטי הקשר">
            <figure className="contact-clinic-figure">
              <div className="contact-clinic-photo"><img src={slotMap["contact-clinic"]} alt="פינת הייעוץ בקליניקה של שיר לביא" loading="lazy" width={1536} height={2048} /></div>
              <figcaption><span className="contact-label">הקליניקה של שיר לביא</span><span>קליניקת בוטיק לנשים בלבד</span></figcaption>
            </figure>
            <dl className="contact-details">
              <div><dt>טלפון</dt><dd><a href={`tel:+${PHONE}`} dir="ltr">{PHONE.replace(/^972/, "0").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}</a></dd></div>
              <div><dt>אימייל</dt><dd><a href={`mailto:${SITE_EMAIL}`} dir="ltr">{SITE_EMAIL}</a></dd></div>
            </dl>
            <div className="contact-socials"><span>ניפגש גם כאן</span><Socials /></div>
          </aside>
        </div>
      </section>
    </div>
  );
}
