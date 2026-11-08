"use client";

import Link from "next/link";
import { useState } from "react";
import { SHOP_INTRO, SHOP_INTRO_SECOND } from "@/lib/content";
import { useSite } from "@/lib/site";
import { ProductCard } from "./product-card";
import { CommerceIcon } from "./commerce-icon";

export function ShopPage() {
  const { products, shop } = useSite();
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("rec");
  const selected = shop.collections.find((collection) => collection.id === cat);
  const search = q.trim().toLocaleLowerCase("he");
  const list = products.filter((p) => (cat === "all" || selected?.productIds.includes(p.id) || p.cat === cat) && (!search || `${p.name} ${p.catName} ${p.short}`.toLocaleLowerCase("he").includes(search))).sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name, "he");
    if (sort === "price") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return a.rank - b.rank;
  });

  return <div className="commerce shop-page">
    <section className="shop-intro">
      <div className="commerce-container shop-intro__inner">
        <div>
          <span className="commerce-eyebrow">החנות שלנו</span>
          <h1>החנות שלנו</h1>
          <p>{SHOP_INTRO}<br />{SHOP_INTRO_SECOND}</p>
          <a className="commerce-text-link" href="#catalog">לכל המוצרים שלנו <CommerceIcon name="arrow" /></a>
        </div>
        <div className="shop-intro__signature" aria-hidden="true">
          <img src="/assets/monogram-gold.png" alt="" />
          <span>A LITTLE MOMENT. JUST FOR YOU.</span>
        </div>
      </div>
    </section>
    <section id="catalog" className="commerce-container shop-catalog">
      <div className="shop-catalog__heading">
        <div><span className="commerce-eyebrow">נבחרו בשבילך</span><h2>{selected?.title || "המוצרים שלנו"}</h2></div>
        <span className="shop-count" role="status" aria-live="polite">{list.length === 1 ? "מוצר אחד" : `${list.length} מוצרים`}</span>
      </div>
      <div className="shop-toolbar">
        <div className="shop-categories" role="group" aria-label="סינון לפי קטגוריה">
          <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")}>הכל</button>
          {shop.collections.map((collection) => <button key={collection.id} type="button" aria-pressed={cat === collection.id} onClick={() => setCat(collection.id)}>{collection.title}</button>)}
        </div>
        <div className="shop-tools">
          <label className="shop-search"><CommerceIcon name="search" width="18" height="18" /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="מה את מחפשת?" aria-label="חיפוש מוצר" /></label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="מיון מוצרים">
            <option value="rec">המומלצים שלנו</option><option value="name">שם (א–ת)</option><option value="price">מחיר: מהנמוך לגבוה</option><option value="price-desc">מחיר: מהגבוה לנמוך</option>
          </select>
        </div>
      </div>
      {list.length ? <div className="commerce-grid">{list.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="shop-empty">
        <CommerceIcon name="search" width="32" height="32" /><h3>לא מצאנו התאמה הפעם</h3><p>נסי מילה אחרת או גלי את כל המוצרים שלנו.</p><button type="button" className="commerce-button" onClick={() => { setCat("all"); setQ(""); }}>לכל המוצרים <CommerceIcon name="arrow" /></button>
      </div>}
      <p className="shop-fineprint">המחיר הסופי, כולל משלוח והנחות, מחושב בקופה.</p>
    </section>
    <section className="commerce-container shop-service" aria-label="שירות בחנות">
      <div><CommerceIcon name="spark" /><h3>נבחר בקפידה</h3><p>מוצרים וציוד מתוך העולם המקצועי שלנו.</p></div>
      <div><CommerceIcon name="delivery" /><h3>בדרך אלייך</h3><p>{shop.shipping.length ? shop.shipping.map((method) => method.name).join(" · ") : "אפשרויות המשלוח והאיסוף מחכות לך בקופה."}</p></div>
      <div><CommerceIcon name="bag" /><h3>בואי נמצא את שלך</h3><p>מתלבטת מה לבחור? אנחנו כאן בשבילך.</p><Link href="/contact" className="commerce-text-link">לייעוץ אישי <CommerceIcon name="arrow" width="17" /></Link></div>
    </section>
  </div>;
}
