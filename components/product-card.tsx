"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { shopInquiryLink, type RichProduct } from "@/lib/data";
import { useSite } from "@/lib/site";
import { Slot } from "./ui";

export function ProductCard({ product }: { product: RichProduct }) {
  const router = useRouter();
  const { mobile } = useSite();
  const [hover, setHover] = useState(false);

  const wa = shopInquiryLink(product.name);

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
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="qa"
          style={{
            position: "absolute",
            right: mobile ? 10 : 12,
            left: mobile ? 10 : 12,
            bottom: mobile ? 10 : 12,
            height: mobile ? 40 : 46,
            borderRadius: 999,
            border: 0,
            background: "#fff",
            color: "#1C1C1C",
            fontSize: mobile ? 13 : 14,
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(41,37,34,.1)",
            opacity: mobile || hover ? 1 : 0,
            transform: mobile || hover ? "none" : "translateY(12px)",
            transition: "opacity .3s, transform .3s",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          פנייה בוואטסאפ
        </a>
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
        <span style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.4 }}>{product.name}</span>
      </button>
    </article>
  );
}
