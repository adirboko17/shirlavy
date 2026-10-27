"use client";

import { useRef, useState } from "react";
import { useSite } from "@/lib/site";
import { SHOP_INTRO } from "@/lib/content";
import { PageHero, SectionLabel, h2Style } from "./ui";
import { ProductCard } from "./product-card";

const CATS = [
  ["all", "הכל"],
  ["aftercare", "טיפוח לאחר טיפול"],
  ["skin", "טיפוח העור"],
  ["sets", "ערכות"],
  ["tools", "כלים ואביזרים"],
] as const;

export function ShopPage() {
  const { products, mobile } = useSite();
  const gridRef = useRef<HTMLElement>(null);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("rec");
  const best = products.filter((p) => p.best);
  let list = products.filter((p) => (cat === "all" || p.cat === cat) && (!q.trim() || (p.name + " " + p.catName + " " + p.short).includes(q.trim())));
  const sorters: Record<string, (a: (typeof products)[0], b: (typeof products)[0]) => number> = {
    rec: (a, b) => a.rank - b.rank,
    new: (a, b) => Number(b.isNew) - Number(a.isNew) || a.rank - b.rank,
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
  };
  list = list.slice().sort(sorters[sort]);

  return (
    <div>
      <PageHero kicker="החנות שלנו" title="טיפוח שממשיך הביתה." text={SHOP_INTRO}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 6 }}>
          {CATS.map(([k, label]) => (
            <button key={k} type="button" className="chip shop-jump" onClick={() => { setCat(k); const el = gridRef.current; if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }}>{label}</button>
          ))}
        </div>
      </PageHero>
      <section style={{ padding: "clamp(24px,4vw,48px) clamp(16px,4vw,48px) 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionLabel>הנמכרים ביותר</SectionLabel>
          <h2 style={{ ...h2Style("clamp(28px,3vw,42px)"), margin: "12px 0 clamp(24px,3vw,36px)" }}>האהובים של הלקוחות</h2>
          <div className="hscroll" style={{ gridAutoColumns: "minmax(min(72vw,280px),1fr)" }}>
            {best.map((p) => <div key={p.id} style={{ scrollSnapAlign: "start", minWidth: 0 }}><ProductCard product={p} /></div>)}
          </div>
        </div>
      </section>
      <section ref={gridRef} style={{ padding: "clamp(64px,8vw,112px) clamp(16px,4vw,48px) clamp(48px,6vw,80px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionLabel>קטלוג</SectionLabel>
          <h2 style={{ ...h2Style("clamp(28px,3vw,42px)"), margin: "12px 0 clamp(20px,3vw,32px)" }}>כל המוצרים</h2>
          <div style={{ position: "sticky", top: 84, zIndex: 10, margin: "0 calc(-1 * clamp(16px,4vw,48px)) clamp(24px,3vw,36px)", padding: "10px clamp(16px,4vw,48px)", background: "rgba(255,255,255,.94)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(28,28,28,.08)" }}>
            <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div role="tablist" aria-label="קטגוריות" style={{ display: "flex", gap: "clamp(14px,2vw,28px)", overflowX: "auto", flex: "1 1 auto", minWidth: 0 }}>
                {CATS.map(([k, label]) => (
                  <button key={k} type="button" role="tab" aria-selected={cat === k} onClick={() => setCat(k)} style={{ height: 44, padding: 0, border: 0, borderBottom: `1.5px solid ${cat === k ? "#8F6A4B" : "transparent"}`, background: "transparent", fontSize: 14, fontWeight: cat === k ? 500 : 400, cursor: "pointer", whiteSpace: "nowrap", color: cat === k ? "#1C1C1C" : "#6B6B6B", fontFamily: "inherit" }}>{label}</button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ width: 220, maxWidth: "100%", display: "flex", alignItems: "center", gap: 8, height: 44, padding: "0 16px", borderRadius: 999, background: "#F7F5F2" }}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="7" cy="7" r="5.2" stroke="#5A5A5A" strokeWidth="1.3" /><path d="M11 11l3.5 3.5" stroke="#5A5A5A" strokeWidth="1.3" strokeLinecap="round" /></svg>
                  <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש מוצר" aria-label="חיפוש מוצר" style={{ flex: 1, minWidth: 0, border: 0, background: "transparent", fontSize: 14, color: "#1C1C1C", outline: "none", height: 42, fontFamily: "inherit" }} />
                </label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="מיון" style={{ height: 44, padding: "0 16px", borderRadius: 999, border: 0, background: "#F7F5F2", fontSize: 14, color: "#1C1C1C", fontFamily: "inherit" }}>
                  <option value="rec">מומלצים</option>
                  <option value="new">חדשים</option>
                  <option value="low">מחיר: מהנמוך</option>
                  <option value="high">מחיר: מהגבוה</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#8A8A8A", marginBottom: 18 }}>{list.length === 1 ? "מוצר אחד" : `${list.length} מוצרים`}</div>
          {list.length ? (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${mobile ? "150px" : "260px"},1fr))`, gap: "clamp(36px,4vw,56px) clamp(12px,1.6vw,20px)" }}>
              {list.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div style={{ borderTop: "1px solid rgba(28,28,28,.1)", borderBottom: "1px solid rgba(28,28,28,.1)", padding: "72px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
              <span style={{ fontSize: 24, fontWeight: 200 }}>לא נמצאו מוצרים</span>
              <span style={{ fontSize: 15, color: "#5A5A5A" }}>נסי חיפוש או קטגוריה אחרת.</span>
              <button type="button" className="pill gold" onClick={() => { setCat("all"); setQ(""); }}>ניקוי הסינון</button>
            </div>
          )}
          <div style={{ marginTop: 28, fontSize: 12, color: "#8A8A8A" }}>המוצרים, המחירים והתמונות הם דוגמאות לעיצוב בלבד.</div>
        </div>
      </section>
      <section style={{ padding: "0 clamp(16px,4vw,48px) clamp(56px,7vw,96px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", columnGap: "clamp(24px,4vw,56px)" }}>
          {[
            ["משלוח לכל הארץ", "זמני ועלויות המשלוח יוצגו בקופה."],
            ["תשלום מאובטח", "כרטיס אשראי ו־Apple Pay במכשירים תומכים."],
            ["ייעוץ אישי", "לא בטוחה מה מתאים לך? כתבי לנו."],
          ].map(([t, d]) => (
            <div key={t} style={{ borderTop: "1px solid rgba(28,28,28,.14)", padding: "20px 0" }}>
              <div style={{ fontSize: 17 }}>{t}</div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: "#5A5A5A" }}>{d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
