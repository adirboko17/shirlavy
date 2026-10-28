"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatMoney, type ShopProduct } from "@/lib/shop-model";
import { productLine, useSite } from "@/lib/site";
import { Slot } from "./ui";

export function ProductCard({ product }: { product: ShopProduct }) {
  const router = useRouter();
  const site = useSite();
  const [hover, setHover] = useState(false);
  const image = product.images[0];
  const single = product.variants.length === 1 && product.bundles.length === 0;
  const soldOut = product.variants.every((variant) => variant.stock === 0);

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}
    >
      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#F7F3EE", color: "#999", aspectRatio: "4/5" }}>
        <div style={{ position: "absolute", inset: image ? 0 : "14%" }}>
          {image ? (
            <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Slot id={`p-${product.id}-1`} placeholder="תמונת מוצר" fit="contain" />
          )}
        </div>
        {product.tag ? (
          <span style={{ position: "absolute", top: 12, right: 12, height: 28, padding: "0 12px", borderRadius: 999, background: "#fff", fontSize: 12, display: "flex", alignItems: "center", color: "#1C1C1C", pointerEvents: "none" }}>
            {product.tag}
          </span>
        ) : null}
        <button
          type="button"
          disabled={soldOut}
          onClick={() => {
            if (!single) {
              router.push(`/shop/${product.id}`);
              return;
            }
            const line = productLine(product, product.variants[0].id);
            if (line) site.addLine(line);
          }}
          className="qa"
          style={{
            position: "absolute",
            right: site.mobile ? 10 : 12,
            left: site.mobile ? 10 : 12,
            bottom: site.mobile ? 10 : 12,
            height: site.mobile ? 40 : 46,
            borderRadius: 999,
            border: 0,
            background: "#fff",
            color: "#1C1C1C",
            fontSize: site.mobile ? 13 : 14,
            fontWeight: 500,
            cursor: soldOut ? "default" : "pointer",
            boxShadow: "0 4px 16px rgba(41,37,34,.1)",
            opacity: site.mobile || hover ? 1 : 0,
            transform: site.mobile || hover ? "none" : "translateY(12px)",
            transition: "opacity .3s, transform .3s",
            fontFamily: "inherit",
          }}
        >
          {soldOut ? "אזל מהמלאי" : single ? "הוספה לסל" : "לבחירה"}
        </button>
      </div>
      <button
        type="button"
        onClick={() => router.push(`/shop/${product.id}`)}
        style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", background: "none", border: 0, padding: "0 4px", textAlign: "right", fontFamily: "inherit", cursor: "pointer", color: "#1C1C1C" }}
      >
        {product.catName ? <span style={{ fontSize: 12, color: "#7A573C", letterSpacing: ".02em" }}>{product.catName}</span> : null}
        <span style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.4 }}>{product.name}</span>
        <span style={{ fontSize: 15 }}>
          {product.compareAt ? <s style={{ color: "#8A8A8A", marginInlineEnd: 8 }}>{formatMoney(product.compareAt, site.shop.currency)}</s> : null}
          {formatMoney(product.price, site.shop.currency)}
        </span>
      </button>
    </article>
  );
}
