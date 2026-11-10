"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LEGAL_LINKS } from "@/lib/legal";
import { browserCookieChoice, CONSENT_COOKIE, CONSENT_EVENT, type CookieChoice } from "@/lib/consent";

export function LegalLinks() {
  return <nav className="legal-links" aria-label="מדיניות ומידע משפטי">
    {LEGAL_LINKS.map(item => <Link key={item.id} href={`/policies/${item.id}`}>{item.title}</Link>)}
    <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}>העדפות עוגיות</button>
  </nav>;
}

export function CookiePreferences() {
  const [showBanner, setShowBanner] = useState(false);
  const [choice, setChoice] = useState<CookieChoice | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const saved = browserCookieChoice();
    setChoice(saved); setShowBanner(!saved);
    const open = () => dialog.current?.showModal();
    window.addEventListener(CONSENT_EVENT, open);
    return () => window.removeEventListener(CONSENT_EVENT, open);
  }, []);
  function save(next: CookieChoice) {
    document.cookie = `${CONSENT_COOKIE}=v1:${next}; Path=/; Max-Age=15552000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    if (next === "essential") document.cookie = "storely_attr=; Path=/; Max-Age=0; SameSite=Lax";
    setChoice(next); setShowBanner(false); dialog.current?.close();
  }
  const actions = <div className="cookie-actions"><button type="button" onClick={() => save("essential")}>חיוניות בלבד</button><button type="button" onClick={() => save("analytics")}>אישור מדידה</button></div>;
  return <>
    {showBanner ? <section className="cookie-banner" aria-labelledby="cookie-banner-title"><div><h2 id="cookie-banner-title">הפרטיות שלך, הבחירה שלך</h2><p>אנו שומרות עגלה והעדפות לתפעול האתר. מדידת גלישה תופעל רק באישורך. אפשר להמשיך עם חיוניות בלבד ולשנות את הבחירה בכל עת. <Link href="/policies/cookies">מידע על עוגיות</Link></p></div>{actions}</section> : null}
    <dialog ref={dialog} className="legal-dialog" aria-labelledby="cookie-dialog-title"><button className="legal-dialog-close" type="button" onClick={() => dialog.current?.close()} aria-label="סגירת העדפות עוגיות">×</button><h2 id="cookie-dialog-title">העדפות עוגיות</h2><p>עוגיות חיוניות משמשות לעגלה, להזמנה ולשמירת העדפות. מדידה אופציונלית מסייעת להבין את השימוש באתר.</p><p>הבחירה הנוכחית: {choice === "analytics" ? "חיוניות ומדידה" : "חיוניות בלבד"}.</p>{actions}<Link href="/policies/cookies" onClick={() => dialog.current?.close()}>למדיניות העוגיות המלאה</Link></dialog>
  </>;
}

const A11Y_KEY = "shirlavy-accessibility-v1";
export function AccessibilityTools() {
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [links, setLinks] = useState(false);
  const [motion, setMotion] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(A11Y_KEY) || "{}");
      setLinks(saved.links === true); setMotion(saved.motion === true);
      document.documentElement.classList.toggle("a11y-links", saved.links === true);
      document.documentElement.classList.toggle("a11y-motion", saved.motion === true);
    } catch { /* Settings remain available when storage is blocked. */ }
  }, []);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pause = (event?: Event) => {
      if (!motion && !preference.matches) return;
      if (event?.target instanceof HTMLVideoElement && event.target.autoplay) event.target.pause();
      document.querySelectorAll<HTMLVideoElement>("video[autoplay]").forEach(video => video.pause());
    };
    pause();
    document.addEventListener("play", pause, true);
    preference.addEventListener("change", pause);
    return () => { document.removeEventListener("play", pause, true); preference.removeEventListener("change", pause); };
  }, [motion, path]);
  function update(nextLinks: boolean, nextMotion: boolean) {
    setLinks(nextLinks); setMotion(nextMotion);
    document.documentElement.classList.toggle("a11y-links", nextLinks);
    document.documentElement.classList.toggle("a11y-motion", nextMotion);
    try { localStorage.setItem(A11Y_KEY, JSON.stringify({ links: nextLinks, motion: nextMotion })); } catch { /* Optional persistence. */ }
  }
  return <>
    <button className="accessibility-fab" type="button" aria-label="פתיחת כלי נגישות" title="נגישות" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M4 8l8 2 8-2M12 10v5m0 0-5 6m5-6 5 6"/></svg></button>
    <dialog ref={dialog} className="legal-dialog" aria-labelledby="accessibility-title"><button className="legal-dialog-close" type="button" onClick={() => dialog.current?.close()} aria-label="סגירת כלי נגישות">×</button><h2 id="accessibility-title">כלי נגישות</h2><p>התאמות לתצוגה שנוחה לך.</p><div className="accessibility-options"><button type="button" aria-pressed={links} onClick={() => update(!links, motion)}>הדגשת קישורים <span aria-hidden="true">{links ? "✓" : "+"}</span></button><button type="button" aria-pressed={motion} onClick={() => update(links, !motion)}>הפחתת תנועה <span aria-hidden="true">{motion ? "✓" : "+"}</span></button><button type="button" onClick={() => update(false, false)}>איפוס ההעדפות</button></div><p>להגדלת התצוגה אפשר להשתמש בהגדרות הדפדפן או במקשים Ctrl ו־+ (ב־Mac: Command ו־+).</p><Link href="/policies/accessibility" onClick={() => dialog.current?.close()}>הצהרת נגישות ודרכי פנייה</Link></dialog>
  </>;
}
