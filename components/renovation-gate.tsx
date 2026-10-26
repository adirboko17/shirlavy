"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/data";

const STORAGE_KEY = "sl-entry";
const ENTRY_CODE = "252525";
const WA = waLink("היי שיר, אשמח לתאם שיחת ייעוץ.");

export function RenovationGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(localStorage.getItem(STORAGE_KEY) === "ok");
    setReady(true);
  }, []);

  if (!ready) return <div className="reno" aria-hidden />;
  if (!open) return <Renovation onUnlock={() => setOpen(true)} />;
  return children;
}

function Renovation({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = (value: string) => {
    if (value === ENTRY_CODE) {
      localStorage.setItem(STORAGE_KEY, "ok");
      onUnlock();
      return;
    }
    setError(true);
  };

  return (
    <main className="reno">
      <img className="reno-mark" src="/assets/monogram-tone.png" alt="" aria-hidden />
      <span />
      <div className="reno-content">
        <img className="reno-logo" src="/assets/logo-foil.png" alt="SHIR LAVY — Aesthetics & Academy" />
        <div className="reno-rule" />
        <div className="reno-copy">
          <h1>האתר בשיפוצים</h1>
          <p>אנחנו עובדות על הבית החדש לקליניקה, לאקדמיה ולחנות. בינתיים אפשר לדבר איתנו בוואטסאפ.</p>
        </div>
        <a className="reno-wa" href={WA} target="_blank" rel="noopener noreferrer">
          לתיאום ייעוץ בוואטסאפ
        </a>
        <form
          className="reno-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit(code);
          }}
        >
          <label htmlFor="entry-code">קוד כניסה</label>
          <input
            id="entry-code"
            inputMode="numeric"
            autoComplete="off"
            maxLength={6}
            value={code}
            aria-invalid={error}
            onChange={(e) => {
              const next = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(next);
              setError(false);
              if (next.length === 6) submit(next);
            }}
          />
          {error ? <span className="reno-error">הקוד לא נכון</span> : null}
        </form>
      </div>
      <footer className="reno-foot">
        <span>קליניקת בוטיק לנשים · אקדמיה לאיפור קבוע</span>
        <span dir="ltr">© SHIR LAVY</span>
      </footer>
    </main>
  );
}
