"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/shop-model";
import { productLine, useSite } from "@/lib/site";
import { ResponsiveCarousel, h2Style } from "./ui";
import { ProductCard } from "./product-card";

export function ProductPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const { products, mobile, shop, addLine } = useSite();
  const product = products.find((item) => item.id === id);
  const [variantId, setVariantId] = useState("");
  const [bundleQty, setBundleQty] = useState(0);
  const [image, setImage] = useState(0);
  const [packs, setPacks] = useState(1);

  const variant = product?.variants.find((item) => item.id === variantId) ?? product?.variants[0];
  const bundle = product?.bundles.find((item) => item.qty === bundleQty);
  const price = bundle?.price ?? variant?.price ?? product?.price ?? 0;
  const soldOut = variant?.stock === 0;
  const related = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.id !== product.id).sort((a, b) => Number(b.cat === product.cat) - Number(a.cat === product.cat) || a.rank - b.rank).slice(0, 4);
  }, [product, products]);

  if (!product || !variant) {
    return (
      <section style={{ padding: "clamp(140px,16vh,180px) 24px", textAlign: "center" }}>
        <h1 style={h2Style("clamp(28px,3vw,40px)")}>המוצר לא נמצא</h1>
        <Link href="/shop" className="text-link">חזרה לחנות</Link>
      </section>
    );
  }

  const photos = product.images.length ? product.images : [];
  const current = photos[image] || photos[0];

  return (
    <div>
      <section style={{ padding: "clamp(96px,11vh,112px) clamp(16px,4vw,48px) clamp(56px,7vw,96px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <nav aria-label="פירורי לחם" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, fontSize: 13, color: "#8A8A8A", marginBottom: 20 }}>
            <Link href="/shop" className="chip" style={{ height: 32, background: "#F7F5F2" }}>→ חנות</Link>
            {product.catName ? <span>{product.catName}</span> : null}
          </nav>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "clamp(28px,5vw,72px)", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", background: "#F2EBE4", aspectRatio: "4/5", minWidth: 0 }}>
                {current ? <img src={current} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
              </div>
              {photos.length > 1 ? (
                <div style={{ display: "flex", gap: 8 }}>
                  {photos.map((src, index) => (
                    <button key={src} type="button" onClick={() => setImage(index)} style={{ width: 64, height: 80, padding: 0, borderRadius: 12, overflow: "hidden", border: index === image ? "1px solid #8F6A4B" : "1px solid transparent", cursor: "pointer" }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "sticky", top: 100, minWidth: 0 }}>
              <h1 style={{ margin: 0, fontWeight: 300, fontSize: "clamp(30px,3.4vw,46px)", lineHeight: 1.12, letterSpacing: "-.03em" }}>{product.name}</h1>
              <div style={{ fontSize: 22 }}>
                {product.compareAt && !bundle ? <s style={{ color: "#8A8A8A", marginInlineEnd: 10, fontSize: 16 }}>{formatMoney(product.compareAt, shop.currency)}</s> : null}
                {formatMoney(price, shop.currency)}
              </div>
              {product.description ? <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "#5A5A5A", maxWidth: 520, whiteSpace: "pre-wrap" }}>{product.description}</p> : null}
              {product.variants.length > 1 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {product.variants.map((item) => (
                    <button key={item.id} type="button" onClick={() => setVariantId(item.id)} className="chip" style={{ background: (variant.id === item.id) ? "#F5EEE7" : "#F7F5F2" }}>
                      {item.title || "רגיל"}{item.stock === 0 ? " · אזל" : ""}
                    </button>
                  ))}
                </div>
              ) : null}
              {product.bundles.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button type="button" className="chip" onClick={() => setBundleQty(0)} style={{ background: bundleQty === 0 ? "#F5EEE7" : "#F7F5F2" }}>יחידה</button>
                  {product.bundles.map((item) => (
                    <button key={item.qty} type="button" className="chip" onClick={() => setBundleQty(item.qty)} style={{ background: bundleQty === item.qty ? "#F5EEE7" : "#F7F5F2" }}>
                      {item.label} · {formatMoney(item.price, shop.currency)}
                    </button>
                  ))}
                </div>
              ) : null}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button type="button" aria-label="הפחתה" onClick={() => setPacks((value) => Math.max(1, value - 1))} style={qty}>−</button>
                <span>{packs}</span>
                <button type="button" aria-label="הוספה" onClick={() => setPacks((value) => Math.min(20, value + 1))} style={qty}>+</button>
              </div>
              <button
                type="button"
                className="pill gold"
                disabled={soldOut}
                style={{ alignSelf: "flex-start", height: 54, opacity: soldOut ? 0.5 : 1 }}
                onClick={() => {
                  const line = productLine(product, variant.id, packs, bundle?.qty);
                  if (line) addLine(line);
                }}
              >
                {soldOut ? "אזל מהמלאי" : "הוספה לסל"}
              </button>
              {variant.stock != null && variant.stock > 0 ? <span style={{ fontSize: 13, color: "#8A8A8A" }}>{variant.stock} במלאי</span> : null}
            </div>
          </div>
        </div>
      </section>
      {related.length ? (
        <section style={{ padding: "0 clamp(16px,4vw,48px) clamp(56px,7vw,96px)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <h2 style={{ ...h2Style("clamp(26px,2.8vw,36px)"), marginBottom: 24 }}>אולי תאהבי גם</h2>
            {mobile ? (
              <ResponsiveCarousel ariaLabel="מוצרים קשורים" slideWidth="min(72vw, 280px)">
                {related.map((item) => <ProductCard key={item.id} product={item} />)}
              </ResponsiveCarousel>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "clamp(12px,1.6vw,20px)" }}>
                {related.map((item) => <ProductCard key={item.id} product={item} />)}
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

const qty: CSSProperties = { width: 36, height: 36, borderRadius: 999, border: 0, background: "#F7F5F2", cursor: "pointer", fontFamily: "inherit" };
