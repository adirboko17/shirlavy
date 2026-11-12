"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useId, useState } from "react";
import { findShopProduct, formatMoney, type Currency, type ShopBundle, type ShopProduct, type ShopVariant } from "@/lib/shop-model";
import { productLine, useSite } from "@/lib/site";
import { ProductCard } from "./product-card";
import { CommerceIcon } from "./commerce-icon";

const SWATCHES: Record<string, string> = {
  "שחור": "#1c1c1c",
  "לבן": "#f7f4ef",
  "חום": "#6b4226",
  "חום כהה": "#3e2718",
  "חום בהיר": "#a67c52",
  "בלונד": "#d6b072",
  "בלונדיני": "#d6b072",
  "אפור": "#8d8d8d",
  "אפור כהה": "#4d4d4d",
  "אפור בהיר": "#c8c8c8",
  "ורוד": "#e7a3b5",
  "אדום": "#b42318",
  "בורדו": "#6e2430",
  "כחול": "#2f5f98",
  "ירוק": "#3f6b4a",
  "בז": "#e6d3b3",
  "בז'": "#e6d3b3",
  "ניוד": "#d8b89a",
  "זהב": "#c6a15b",
  "כסף": "#c0c4c8",
  "סגול": "#6d4c8a",
  "כתום": "#d9782d",
};

function swatchColor(value: string, colors?: Record<string, string>) {
  const chosen = colors?.[value]?.trim() ?? "";
  if (/^#[0-9a-f]{6}$/i.test(chosen)) return chosen;
  const named = value.trim();
  if (/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(named)) return named;
  return SWATCHES[named] ?? "#e6ddd3";
}

function isColorOption(name: string) {
  return /צבע|גוון|color|colour/i.test(name);
}

function hasOptionGroups(product: ShopProduct) {
  return product.options.length > 0 && product.variants.every((variant) => product.options.every((option) => variant.selected[option.name]));
}

function matchVariant(product: ShopProduct, choice: Record<string, string>) {
  return product.variants.find((variant) => product.options.every((option) => variant.selected[option.name] === choice[option.name]));
}

function chooseOption(product: ShopProduct, current: ShopVariant, name: string, value: string) {
  const exact = matchVariant(product, { ...current.selected, [name]: value });
  if (exact) return exact;
  return product.variants.find((variant) => variant.selected[name] === value && variant.stock !== 0)
    ?? product.variants.find((variant) => variant.selected[name] === value)
    ?? current;
}

function valueSoldOut(product: ShopProduct, current: ShopVariant, name: string, value: string) {
  const exact = matchVariant(product, { ...current.selected, [name]: value });
  if (exact) return exact.stock === 0;
  return product.variants.filter((variant) => variant.selected[name] === value).every((variant) => variant.stock === 0);
}

export function ProductPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  // Reset gallery and selection state when navigating between products.
  return <ProductDetails key={slug} slug={slug} />;
}

function BundlePicker({ bundles, unitPrice, currency, selected, onSelect }: {
  bundles: ShopBundle[];
  unitPrice: number;
  currency: Currency;
  selected: number;
  onSelect: (quantity: number) => void;
}) {
  const groupId = useId();
  const choices = [{ qty: 0, label: "יחידה אחת", price: unitPrice, tag: undefined as string | undefined }, ...bundles];
  return <fieldset className="product-bundles">
    <legend>בחרי את המארז שלך</legend>
    <div className="product-bundles__list">
      {choices.map((item) => {
        const quantity = item.qty || 1;
        const regularTotal = unitPrice * quantity;
        const saving = Math.round((regularTotal - item.price) * 100) / 100;
        return <label key={item.qty} className="product-bundle" data-selected={selected === item.qty} data-tagged={Boolean(item.tag)}>
          {item.tag ? <span className="product-bundle__tag">{item.tag}</span> : null}
          <span className="product-bundle__copy">
            <span className="product-bundle__title">{item.label}</span>
            <span className="product-bundle__detail">{quantity > 1 ? <>{quantity} יחידות · {formatMoney(item.price / quantity, currency)} ליחידה</> : "הבחירה הקלאסית"}</span>
            {saving > 0 ? <span className="product-bundle__saving">חיסכון של {formatMoney(saving, currency)}</span> : null}
          </span>
          <span className="product-bundle__price"><strong>{formatMoney(item.price, currency)}</strong>{saving > 0 ? <s aria-label={`ברכישת יחידות בנפרד: ${formatMoney(regularTotal, currency)}`}>{formatMoney(regularTotal, currency)}</s> : null}</span>
          <input type="radio" name={groupId} value={item.qty} checked={selected === item.qty} onChange={() => onSelect(item.qty)} aria-label={item.label} />
        </label>;
      })}
    </div>
  </fieldset>;
}

function ProductDetails({ slug }: { slug: string }) {
  const { products, shop, addLine } = useSite();
  const product = findShopProduct(products, slug);
  const [variantId, setVariantId] = useState("");
  const [bundleQty, setBundleQty] = useState(0);
  const [manualImage, setManualImage] = useState<number | null>(null);
  const [packs, setPacks] = useState(1);
  const variant = product?.variants.find((item) => item.id === variantId) ?? product?.variants.find((item) => item.stock !== 0) ?? product?.variants[0];
  const grouped = product ? hasOptionGroups(product) : false;
  const cap = !variant || variant.stock == null ? 20 : Math.max(1, Math.min(20, variant.stock));
  const count = Math.min(packs, cap);
  const bundle = product?.bundles.find((item) => item.qty === bundleQty);
  const price = bundle?.price ?? variant?.price ?? product?.price ?? 0;
  const soldOut = variant?.stock === 0;

  if (!product || !variant) return <section className="commerce product-missing"><CommerceIcon name="bag" width="42" height="42" /><h1>המוצר לא נמצא</h1><Link href="/shop" className="commerce-text-link">חזרה לחנות <CommerceIcon name="arrow" /></Link></section>;

  const photos = product.images;
  const variantPhoto = photos.indexOf(variant.image ?? "");
  const image = manualImage ?? (variantPhoto >= 0 ? variantPhoto : 0);
  const current = manualImage == null && variant.image && variantPhoto < 0 ? variant.image : photos[image] || photos[0];
  function selectVariant(nextId: string) {
    setVariantId(nextId);
    setManualImage(null);
  }
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
          {photos.length > 1 ? <div className="product-gallery__thumbs" role="group" aria-label="תמונות המוצר">{photos.map((src, index) => <button key={`${src}-${index}`} type="button" aria-label={`תמונה ${index + 1} של ${product.name}`} aria-pressed={index === image && current === src} onClick={() => setManualImage(index)}><img src={src} alt="" loading="lazy" /></button>)}</div> : null}
        </div>
        <div className="product-info">
          <span className="commerce-eyebrow">{product.catName || "THE SHIR LAVY COLLECTION"}</span>
          <h1>{product.name}</h1>
          <div className="product-info__price"><span>{formatMoney(price, shop.currency)}</span>{product.compareAt && product.compareAt > price && !bundle ? <s>{formatMoney(product.compareAt, shop.currency)}</s> : null}</div>
          <div className="product-purchase">
            {grouped ? product.options.map((option) => <fieldset key={option.name} className="product-options"><legend>{option.name}{variant.selected[option.name] ? <>: <b>{variant.selected[option.name]}</b></> : null}</legend><div>{option.values.map((value) => {
              const sold = valueSoldOut(product, variant, option.name, value);
              return <button key={value} type="button" aria-pressed={variant.selected[option.name] === value} data-sold={sold ? "true" : undefined} onClick={() => selectVariant(chooseOption(product, variant, option.name, value).id)}>{isColorOption(option.name) ? <span className="product-swatch" style={{ background: swatchColor(value, option.colors) }} /> : null}{value}</button>;
            })}</div></fieldset>) : product.variants.length > 1 ? <fieldset className="product-options"><legend>בחרי את האפשרות שלך</legend><div>{product.variants.map((item) => <button key={item.id} type="button" aria-pressed={variant.id === item.id} data-sold={item.stock === 0 ? "true" : undefined} onClick={() => selectVariant(item.id)}>{item.title || "רגיל"}</button>)}</div></fieldset> : null}
            {product.bundles.length ? <BundlePicker bundles={product.bundles} unitPrice={variant.price} currency={shop.currency} selected={bundleQty} onSelect={setBundleQty} /> : null}
            <div className="product-purchase__status"><span className={soldOut ? "stock-status stock-status--out" : "stock-status"}>{soldOut ? "כרגע לא במלאי" : variant.stock != null ? "זמין במלאי" : "ניתן להזמנה"}</span><span>{bundle ? "כמות מארזים" : "כמות יחידות"}</span></div>
            <div className="product-purchase__actions">
              <button type="button" className="commerce-button" disabled={soldOut} onClick={() => { const line = productLine(product, variant.id, count, bundle?.qty); if (line) addLine(line); }}><span>{soldOut ? "אזל מהמלאי" : "הוספה לסל"}</span><CommerceIcon name="bag" /></button>
              <div className="commerce-quantity" role="group" aria-label="כמות"><button type="button" aria-label="הפחתת כמות" disabled={count === 1} onClick={() => setPacks((value) => Math.max(1, value - 1))}>−</button><output aria-live="polite">{count}</output><button type="button" aria-label="הגדלת כמות" disabled={soldOut || count >= cap} onClick={() => setPacks((value) => Math.min(cap, value + 1))}>+</button></div>
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
