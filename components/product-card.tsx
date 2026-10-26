"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSite } from "@/lib/site";
import type { RichProduct } from "@/lib/data";
import { Slot } from "./ui";

export function ProductCard({ product }: { product: RichProduct }) {
  const { mobile, addToCart } = useSite();
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const show = hover || added;

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  const add = () => {
    addToCart(product.id, product.variants ? product.variants[0].id : null, 1);
    setAdded(true);
  };

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}
    >
      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#F7F3EE", color: "#999", aspectRatio: "4/5" }}>
        <div style={{ position: "absolute", inset: "14%" }}>
          <Slot id={`p-${product.id}-1`} placeholder="תמונת מוצר" fit="contain" />
        </div>
        {product.tag ? (
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              height: 28,
              padding: "0 12px",
              borderRadius: 999,
              background: "#fff",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              color: "#1C1C1C",
              pointerEvents: "none",
            }}
          >
            {product.tag}
          </span>
        ) : null}
        {mobile ? (
          <button
            type="button"
            onClick={add}
            aria-label="הוספה לסל"
            style={{
              position: "absolute",
              left: 10,
              bottom: 10,
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: 0,
              background: "#fff",
              color: "#1C1C1C",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(41,37,34,.1)",
            }}
          >
            {added ? "✓" : "+"}
          </button>
        ) : (
          <button
            type="button"
            onClick={add}
            className="qa"
            style={{
              position: "absolute",
              right: 12,
              left: 12,
              bottom: 12,
              height: 46,
              borderRadius: 999,
              border: 0,
              background: "#fff",
              color: "#1C1C1C",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(41,37,34,.1)",
              opacity: show ? 1 : 0,
              transform: show ? "none" : "translateY(12px)",
              transition: "opacity .3s, transform .3s, background .3s, color .3s",
              fontFamily: "inherit",
            }}
          >
            {added ? "נוסף לסל ✓" : "הוספה לסל"}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => router.push(`/shop/${product.id}`)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "100%",
          background: "none",
          border: 0,
          padding: "0 4px",
          textAlign: "right",
          fontFamily: "inherit",
          cursor: "pointer",
          color: "#1C1C1C",
        }}
      >
        <span style={{ fontSize: 12, color: "#7A573C", letterSpacing: ".02em" }}>{product.catName}</span>
        <span style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.4 }}>{product.name}</span>
          <span style={{ fontSize: 15, fontWeight: 300, whiteSpace: "nowrap" }}>{product.priceLabel}</span>
        </span>
      </button>
    </article>
  );
}
