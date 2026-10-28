"use client";

import { useEffect, useState } from "react";
import { shabbatSchedule, type ShabbatSchedule } from "@/lib/shabbat";

type Phase = { ready: false } | { ready: true; schedule: ShabbatSchedule; preview: "shabbat" | "open" | null };

export function ShabbatGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>({ ready: false });

  useEffect(() => {
    const preview = readPreview();
    let timer = 0;
    const tick = () => {
      window.clearTimeout(timer);
      const now = new Date();
      const schedule = shabbatSchedule(now);
      setPhase({ ready: true, schedule, preview });
      if (preview) return;
      const delay = Math.min(Math.max(schedule.changesAt.getTime() - now.getTime() + 400, 1000), 60 * 60 * 1000);
      timer = window.setTimeout(tick, delay);
    };
    tick();
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (!phase.ready) return <div className="reno" aria-hidden />;
  const closed = phase.preview === "open" ? false : phase.preview === "shabbat" || phase.schedule.closed;
  if (!closed) return children;
  return <ShabbatPage opensAt={phase.schedule.opensAt} />;
}

function readPreview(): "shabbat" | "open" | null {
  if (process.env.NODE_ENV === "production") return null;
  const value = new URLSearchParams(window.location.search).get("shabbat");
  if (value === "1") return "shabbat";
  if (value === "0") return "open";
  return null;
}

function ShabbatPage({ opensAt }: { opensAt: Date }) {
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jerusalem",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(opensAt);

  return (
    <main className="reno" aria-labelledby="shabbat-title">
      <img className="reno-mark" src="/assets/monogram-tone.png" alt="" aria-hidden />
      <span />
      <div className="reno-content">
        <img className="reno-logo" src="/assets/logo-foil.png" alt="SHIR LAVY — Aesthetics & Academy" />
        <div className="reno-rule" />
        <div className="reno-copy">
          <h1 id="shabbat-title">האתר שומר שבת</h1>
          <p>האתר ייפתח שוב בצאת השבת.</p>
          <p className="reno-when">
            בשעה <span dir="ltr">{time}</span>
          </p>
        </div>
      </div>
      <footer className="reno-foot">
        <span>קליניקת בוטיק לנשים · אקדמיה לאיפור קבוע</span>
        <span dir="ltr">© SHIR LAVY</span>
      </footer>
    </main>
  );
}
