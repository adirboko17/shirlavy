"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatMoney, type ShopProduct } from "@/lib/shop-model";
import { productLine, useSite } from "@/lib/site";
import { Slot } from "./ui";

export function ProductCard({ product }: { product: ShopProduct }) {
  const router = useRouter();
  const site = useSite();
  const image = product.images[0];
  const single = product.variants.length === 1 && product.bundles.length === 0;
  const soldOut = product.variants.every((variant) => variant.stock === 0);
  const href = `/shop/${product.id}`;

  return (
    <article className="product-card">
      <Link href={href} className="product-card__link">
        <div className="product-card__media">
          {image ? (
            <img src={image} alt="" className="product-card__img" />
          ) : (
            <Slot id={`p-${product.id}-1`} placeholder="תמונת מוצר" fit="contain" />
          )}
          {product.tag ? <span className="product-card__tag">{product.tag}</span> : null}
        </div>
        <div className="product-card__meta">
          {product.catName ? <span className="product-card__cat">{product.catName}</span> : null}
          <span className="product-card__name">{product.name}</span>
          <span className="product-card__price">
            {product.compareAt ? <s>{formatMoney(product.compareAt, site.shop.currency)}</s> : null}
            {formatMoney(product.price, site.shop.currency)}
          </span>
        </div>
      </Link>
      <div className="product-card__cta">
        <button
          type="button"
          disabled={soldOut}
          className="qa product-card__add"
          onClick={() => {
            if (!single) {
              router.push(href);
              return;
            }
            const line = productLine(product, product.variants[0].id);
            if (line) site.addLine(line);
          }}
        >
          {soldOut ? "אזל מהמלאי" : single ? "הוספה לסל" : "לבחירה"}
        </button>
      </div>
    </article>
  );
}
