"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fmt } from "@/lib/data";
import { useSite } from "@/lib/site";
import { Faq, ResponsiveCarousel, Slot, h2Style } from "./ui";
import { ProductCard } from "./product-card";

const IMGS = ["תמונה ראשית", "מרקם", "באריזה", "בשימוש"];

export function ProductPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const router = useRouter();
  const { products, mobile, addToCart } = useSite();
  const p = products.find((x) => x.id === id) || products[0];
  const [img, setImg] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const [atcVisible, setAtcVisible] = useState(true);
  const [ap, setAp] = useState(false);
  const atcRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImg(0); setQty(1); setVariant(null); setZoom(false); setSlide(0);
  }, [id]);

  useEffect(() => {
    try {
      const w = window as Window & { ApplePaySession?: { canMakePayments: () => boolean } };
      setAp(!!(w.ApplePaySession && w.ApplePaySession.canMakePayments()));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const el = atcRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAtcVisible(e.isIntersecting || e.boundingClientRect.top > 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [p?.id]);

  if (!p) return null;
  const vId = variant || (p.variants ? p.variants[0].id : null);
  const v = p.variants?.find((x) => x.id === vId);
  const unit = p.price + (v ? v.add : 0);
  const line = fmt(unit * qty);
  const related = products.filter((x) => x.id !== p.id).sort((a, b) => Number(b.cat === p.cat) - Number(a.cat === p.cat) || a.rank - b.rank).slice(0, 4);

  return (
    <div>
      <section style={{ padding: "clamp(96px,11vh,112px) clamp(16px,4vw,48px) clamp(56px,7vw,96px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <nav aria-label="פירורי לחם" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, fontSize: 13, color: "#8A8A8A", marginBottom: 20 }}>
            <Link href="/shop" className="chip" style={{ height: 32, background: "#F7F5F2" }}>→ חנות</Link>
            <span>{p.catName}</span>
          </nav>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "clamp(28px,5vw,72px)", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
              {mobile ? (
                <div style={{ margin: "0 -16px" }}>
                  <div onScroll={(e) => { const el = e.currentTarget; const i = Math.round(Math.abs(el.scrollLeft) / (el.scrollWidth / IMGS.length)); if (i !== slide) setSlide(Math.min(IMGS.length - 1, i)); }} style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "86%", gap: 8, overflowX: "auto", scrollSnapType: "x mandatory", padding: "0 16px" }}>
                    {IMGS.map((label, i) => (
                      <div key={label} style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#F2EBE4", scrollSnapAlign: "center", aspectRatio: "1/1" }}>
                        <Slot id={`p-${p.id}-${i + 1}`} placeholder={label} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
                    {IMGS.map((_, i) => <span key={i} style={{ width: i === slide ? 22 : 6, height: 6, borderRadius: 3, background: i === slide ? "#1C1C1C" : "rgba(41,37,34,.2)", transition: "all .3s" }} />)}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", background: "#F2EBE4", aspectRatio: "1/1" }}>
                    <div style={{ position: "absolute", inset: 0, transform: zoom ? "scale(2)" : "scale(1)", transformOrigin: origin, transition: "transform .4s ease" }}>
                      <Slot id={`p-${p.id}-${img + 1}`} placeholder={IMGS[img]} />
                    </div>
                    {zoom ? <div onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`); }} onClick={() => setZoom(false)} style={{ position: "absolute", inset: 0, cursor: "zoom-out" }} /> : null}
                    <button type="button" aria-label="הגדלת תמונה" onClick={() => setZoom((z) => !z)} style={{ position: "absolute", bottom: 14, left: 14, width: 44, height: 44, borderRadius: "50%", border: 0, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(41,37,34,.08)" }}>
                      <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.3" /><path d="M11.5 11.5L16 16M5.5 7.5h4M7.5 5.5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10 }}>
                    {IMGS.map((label, i) => (
                      <button key={label} type="button" aria-label={label} onClick={() => { setImg(i); setZoom(false); }} style={{ position: "relative", aspectRatio: "1/1", padding: 0, border: 0, borderRadius: 16, outline: `2px solid ${i === img ? "#1C1C1C" : "transparent"}`, outlineOffset: 2, background: "#F2EBE4", cursor: "pointer", overflow: "hidden" }}>
                        <Slot id={`p-${p.id}-${i + 1}`} placeholder=" " />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, position: "sticky", top: 100, minWidth: 0 }}>
              <div>
                <h1 style={{ margin: 0, fontWeight: 300, fontSize: "clamp(30px,3.4vw,46px)", lineHeight: 1.12, letterSpacing: "-.03em" }}>{p.name}</h1>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 500 }}>{fmt(unit)}</span>
                  <span style={{ fontSize: 13, color: "#8A8A8A" }}>כולל מע״מ</span>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "#5A5A5A", maxWidth: 480 }}>{p.short}</p>
              {p.variants ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ fontSize: 14, color: "#5A5A5A" }}>{p.cat === "sets" ? "אריזה" : "גודל"}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {p.variants.map((x) => {
                      const on = x.id === vId;
                      return <button key={x.id} type="button" aria-pressed={on} className="chip" onClick={() => setVariant(x.id)} style={{ height: 44, padding: "0 20px", border: `1px solid ${on ? "#1C1C1C" : "rgba(41,37,34,.12)"}`, background: on ? "#1C1C1C" : "#fff", color: on ? "#fff" : "#1C1C1C" }}>{x.label}</button>;
                    })}
                  </div>
                </div>
              ) : <span className="chip" style={{ height: 34, background: "#F7F5F2", cursor: "default" }}>{p.size}</span>}
              <div ref={atcRef} style={{ display: "flex", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", height: 54, borderRadius: 999, background: "#F7F5F2" }}>
                  <button type="button" aria-label="הוספת יחידה" className="qty tall" onClick={() => setQty((n) => Math.min(10, n + 1))}>+</button>
                  <span style={{ width: 24, textAlign: "center" }}>{qty}</span>
                  <button type="button" aria-label="הפחתת יחידה" className="qty tall" onClick={() => setQty((n) => Math.max(1, n - 1))}>−</button>
                </div>
                <button type="button" className="pill gold" style={{ flex: 1, height: 54 }} onClick={() => addToCart(p.id, vId, qty, true)}>הוספה לסל · {line}</button>
              </div>
              {ap ? (
                <button type="button" aria-label="קנייה עם Apple Pay" dir="ltr" className="apple" onClick={() => { addToCart(p.id, vId, qty, false); router.push("/checkout?pay=applepay"); }}>Buy with <span style={{ fontWeight: 600 }}>Apple Pay</span></button>
              ) : (
                <button type="button" className="pill soft" style={{ height: 54 }} onClick={() => { addToCart(p.id, vId, qty, false); router.push("/checkout"); }}>קנייה מהירה</button>
              )}
              <span style={{ fontSize: 12, color: "#8A8A8A", marginTop: -12 }}>{ap ? "תשלום מהיר ומאובטח עם Apple Pay." : "Apple Pay יוצג אוטומטית במכשירי Apple ובדפדפנים תומכים."}</span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 6 }}>
                {["משלוח לכל הארץ", "תשלום מאובטח", "שירות אישי"].map((t) => <span key={t} style={{ padding: "12px 8px", borderRadius: 14, background: "#F7F5F2", fontSize: 12, textAlign: "center", color: "#4A4A4A" }}>{t}</span>)}
              </div>
              <Faq items={[
                { q: "תיאור המוצר", a: p.short + " [תיאור מלא של המוצר יתווסף כאן, כולל רכיבים מרכזיים ויתרונות מאומתים בלבד.]" },
                { q: "אופן השימוש", a: "[הוראות שימוש יתווספו כאן לפי הנחיות היצרן.]" },
                { q: "משלוחים והחזרות", a: "משלוח לכל הארץ. זמני ועלויות המשלוח יוצגו בקופה. [מדיניות ההחזרות תעודכן כאן.]" },
              ]} />
              <span style={{ fontSize: 12, color: "#8A8A8A" }}>מוצר לדוגמה. המידע יוחלף בפרטי המוצר האמיתיים.</span>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "0 clamp(16px,4vw,48px) clamp(56px,7vw,96px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <h2 style={{ ...h2Style("clamp(26px,2.8vw,36px)"), marginBottom: 24 }}>אולי תאהבי גם</h2>
          {mobile ? (
            <ResponsiveCarousel ariaLabel="מוצרים קשורים" slideWidth="min(72vw, 280px)">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </ResponsiveCarousel>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "clamp(12px,1.6vw,20px)" }}>
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          )}
        </div>
      </section>
      {mobile && !atcVisible ? (
        <div style={{ position: "fixed", right: 10, left: 10, bottom: "calc(10px + env(safe-area-inset-bottom))", zIndex: 45, background: "rgba(255,255,255,.95)", backdropFilter: "blur(14px)", borderRadius: 999, boxShadow: "0 10px 30px rgba(41,37,34,.14)", padding: "8px 8px 8px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}><div style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div><div style={{ fontSize: 15, fontWeight: 500 }}>{line}</div></div>
          <button type="button" className="pill gold" style={{ height: 48, padding: "0 22px" }} onClick={() => addToCart(p.id, vId, qty, true)}>הוספה לסל</button>
        </div>
      ) : null}
    </div>
  );
}
