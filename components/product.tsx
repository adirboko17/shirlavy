"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { formatMoney } from "@/lib/shop-model";
import { productLine, useSite } from "@/lib/site";
import { ProductCard } from "./product-card";
import { CommerceIcon } from "./commerce-icon";

export function ProductPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  // Reset gallery and selection state when navigating between products.
  return <ProductDetails key={id} id={id} />;
}

function ProductDetails({ id }: { id: string }) {
  const { products, shop, addLine } = useSite();
  const product = products.find((item) => item.id === id);
  const [variantId, setVariantId] = useState("");
  const [bundleQty, setBundleQty] = useState(0);
  const [image, setImage] = useState(0);
  const [packs, setPacks] = useState(1);
  const variant = product?.variants.find((item) => item.id === variantId) ?? product?.variants[0];
  const bundle = product?.bundles.find((item) => item.qty === bundleQty);
  const price = bundle?.price ?? variant?.price ?? product?.price ?? 0;
  const soldOut = variant?.stock === 0;

  if (!product || !variant) return <section className="commerce product-missing"><CommerceIcon name="bag" width="42" height="42" /><h1>המוצר לא נמצא</h1><Link href="/shop" className="commerce-text-link">חזרה לחנות <CommerceIcon name="arrow" /></Link></section>;

  const photos = product.images;
  const current = photos[image] || photos[0];
  const related = products.filter((item) => item.id !== product.id).sort((a, b) => Number(b.cat === product.cat) - Number(a.cat === product.cat) || a.rank - b.rank).slice(0, 4);

  return <div className="commerce product-page">
    <section className="commerce-container">
      <nav className="product-breadcrumb" aria-label="פירורי לחם"><Link href="/shop">החנות</Link><span aria-hidden="true">/</span><span>{product.catName || product.name}</span></nav>
      <div className="product-layout">
        <div className="product-gallery">
          <div className="product-gallery__main">
            {current ? <img key={current} src={current} alt={product.name} className="product-gallery__image" /> : <CommerceIcon name="bag" width="80" height="80" />}
            {product.tag ? <span className="product-gallery__tag">{product.tag}</span> : null}
            <span className="product-gallery__signature" aria-hidden="true">SHIR LAVY · THE COLLECTION</span>
            {photos.length > 1 ? <span className="product-gallery__count" dir="ltr">{image + 1} / {photos.length}</span> : null}
          </div>
          {photos.length > 1 ? <div className="product-gallery__thumbs" role="group" aria-label="תמונות המוצר">{photos.map((src, index) => <button key={`${src}-${index}`} type="button" aria-label={`תמונה ${index + 1} של ${product.name}`} aria-pressed={index === image} onClick={() => setImage(index)}><img src={src} alt="" loading="lazy" /></button>)}</div> : null}
        </div>
        <div className="product-info">
          <span className="commerce-eyebrow">{product.catName || "THE SHIR LAVY COLLECTION"}</span>
          <h1>{product.name}</h1>
          <div className="product-info__price"><span>{formatMoney(price, shop.currency)}</span>{product.compareAt && product.compareAt > price && !bundle ? <s>{formatMoney(product.compareAt, shop.currency)}</s> : null}</div>
          {product.short ? <p className="product-info__intro">{product.short}</p> : null}
          <div className="product-purchase">
            {product.variants.length > 1 ? <fieldset className="product-options"><legend>בחרי את האפשרות שלך</legend><div>{product.variants.map((item) => <button key={item.id} type="button" aria-pressed={variant.id === item.id} onClick={() => setVariantId(item.id)}>{item.title || "רגיל"}{item.stock === 0 ? " · אזל" : ""}</button>)}</div></fieldset> : null}
            {product.bundles.length ? <fieldset className="product-options"><legend>יחידה או מארז?</legend><div><button type="button" aria-pressed={bundleQty === 0} onClick={() => setBundleQty(0)}>יחידה</button>{product.bundles.map((item) => <button key={item.qty} type="button" aria-pressed={bundleQty === item.qty} onClick={() => setBundleQty(item.qty)}>{item.label} · {formatMoney(item.price, shop.currency)}</button>)}</div></fieldset> : null}
            <div className="product-purchase__status"><span className={soldOut ? "stock-status stock-status--out" : "stock-status"}>{soldOut ? "כרגע לא במלאי" : variant.stock != null ? "זמין במלאי" : "ניתן להזמנה"}</span><span>{bundle ? "כמות מארזים" : "כמות יחידות"}</span></div>
            <div className="product-purchase__actions">
              <button type="button" className="commerce-button" disabled={soldOut} onClick={() => { const line = productLine(product, variant.id, packs, bundle?.qty); if (line) addLine(line); }}><span>{soldOut ? "אזל מהמלאי" : "הוספה לסל"}</span><CommerceIcon name="bag" /></button>
              <div className="commerce-quantity" role="group" aria-label="כמות"><button type="button" aria-label="הפחתת כמות" disabled={packs === 1} onClick={() => setPacks((value) => Math.max(1, value - 1))}>−</button><output aria-live="polite">{packs}</output><button type="button" aria-label="הגדלת כמות" disabled={packs === 20} onClick={() => setPacks((value) => Math.min(20, value + 1))}>+</button></div>
            </div>
            <p className="product-purchase__note">אפשרויות משלוח ואיסוף והמחיר הסופי יוצגו בקופה.</p>
          </div>
          <div className="product-details">
            {product.description ? <details open><summary>קצת יותר על המוצר <span aria-hidden="true">+</span></summary><div className="product-details__text">{product.description}</div></details> : null}
            <details><summary>משלוחים ואיסוף <span aria-hidden="true">+</span></summary><div className="product-details__text">{shop.shipping.length ? shop.shipping.map((method) => method.name).join(" · ") : "אפשרויות המשלוח והאיסוף הזמינות מוצגות בקופה, לפני אישור ההזמנה."}{shop.policies.some((p) => p.id === "shipping") ? <Link href="/policies/shipping" className="commerce-text-link">למדיניות המשלוחים</Link> : null}</div></details>
          </div>
          <Link href="/contact" className="product-advice"><CommerceIcon name="spark" /><span>צריכה הכוונה? <u>אנחנו כאן בשבילך</u></span><CommerceIcon name="arrow" width="18" /></Link>
        </div>
      </div>
    </section>
    {related.length ? <section className="commerce-container product-related"><div className="shop-catalog__heading"><div><span className="commerce-eyebrow">עוד קצת השראה</span><h2>אולי תאהבי גם</h2></div><Link href="/shop" className="commerce-text-link">לכל המוצרים <CommerceIcon name="arrow" /></Link></div><div className="commerce-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section> : null}
  </div>;
}
