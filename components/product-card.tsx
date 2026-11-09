"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatMoney, type ShopProduct } from "@/lib/shop-model";
import { productLine, useSite } from "@/lib/site";
import { CommerceIcon } from "./commerce-icon";

export function ProductCard({ product }: { product: ShopProduct }) {
  const router = useRouter();
  const site = useSite();
  const single = product.variants.length === 1 && product.bundles.length === 0;
  const soldOut = !product.variants.length || product.variants.every((variant) => variant.stock === 0);
  const href = `/shop/${product.id}`;
  const tag = soldOut ? "אזל מהמלאי" : product.tag || (product.isNew ? "חדש בחנות" : product.best ? "מהאהובים שלנו" : "");

  return <article className="boutique-card">
    <Link href={href} className="boutique-card__link">
      <div className="boutique-card__media">
        {product.images[0] ? <img src={product.images[0]} alt={product.name} loading="lazy" className="boutique-card__image" /> : <CommerceIcon name="bag" className="boutique-card__placeholder" width="48" height="48" />}
        {product.images[1] ? <img src={product.images[1]} alt="" loading="lazy" className="boutique-card__image boutique-card__image--alternate" /> : null}
        {tag ? <span className="boutique-card__tag">{tag}</span> : null}
        <span className="boutique-card__discover" aria-hidden="true"><CommerceIcon name="arrow" /></span>
      </div>
      <div className="boutique-card__meta">
        <span className="boutique-card__category">{product.catName || "SHIR LAVY COLLECTION"}</span>
        <h3>{product.name}</h3>
        <div className="boutique-card__price"><span>{product.variants.length > 1 && product.variants.some((variant) => variant.price !== product.price) ? `החל מ־${formatMoney(product.price, site.shop.currency)}` : formatMoney(product.price, site.shop.currency)}</span>{product.compareAt && product.compareAt > product.price ? <s>{formatMoney(product.compareAt, site.shop.currency)}</s> : null}</div>
      </div>
    </Link>
    <button type="button" disabled={soldOut} className="boutique-card__add" aria-label={`${single ? "הוספה לסל" : "בחירת אפשרויות"}: ${product.name}`} onClick={() => {
      if (!single) { router.push(href); return; }
      const line = productLine(product, product.variants[0].id);
      if (line) site.addLine(line);
    }}><span>{soldOut ? "אזל מהמלאי" : single ? "הוספה לסל" : "לבחירת האפשרויות"}</span><CommerceIcon name={single ? "bag" : "arrow"} width="18" height="18" /></button>
  </article>;
}
