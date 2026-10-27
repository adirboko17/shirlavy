"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import slotMap from "@/lib/slot-map.json";

const slots = slotMap as Record<string, string>;

export function Slot({
  id,
  placeholder,
  fit = "cover",
}: {
  id: string;
  placeholder?: string;
  fit?: "cover" | "contain";
}) {
  const src = slots[id];
  if (!src) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          textAlign: "center",
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {placeholder}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: fit,
      }}
    />
  );
}

export function Reveal({
  delay = 0,
  children,
  style,
  className,
}: {
  delay?: number;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} data-reveal={on ? "in" : undefined} style={{ ...style, ["--d" as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: ".04em",
          color: "#7A573C",
        }}
      >
        <Dot />
        {children}
        <Dot />
      </span>
    </Reveal>
  );
}

export function Dot() {
  return <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: "#8F6A4B" }} />;
}

export function SectionLabel({ children, tone = "ink" }: { children: ReactNode; tone?: "ink" | "warm" }) {
  return (
    <Reveal style={{ alignSelf: "stretch", width: "100%" }}>
      <span
        style={{
          display: "block",
          borderTop: tone === "warm" ? "1px solid rgba(122,87,60,.28)" : "1px solid rgba(28,28,28,.14)",
          paddingTop: 16,
          fontSize: 13,
          fontWeight: 500,
          color: "#7A573C",
        }}
      >
        {children}
      </span>
    </Reveal>
  );
}

export function PageHero({
  kicker,
  title,
  text,
  children,
}: {
  kicker: string;
  title: ReactNode;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <section style={{ padding: 0 }}>
      <div
        style={{
          position: "relative",
          color: "#1C1C1C",
          background: "radial-gradient(ellipse 70% 90% at 50% 0%,#F5EEE7 0%,rgba(245,238,231,.55) 45%,#FFFFFF 100%)",
        }}
      >
        <div style={{ padding: "clamp(132px,15vw,196px) clamp(20px,4.5vw,64px) clamp(64px,8vw,112px)" }}>
          <div
            style={{
              maxWidth: 860,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 24,
            }}
          >
            <Eyebrow>{kicker}</Eyebrow>
            <Reveal delay={80}>
              <h1
                style={{
                  margin: 0,
                  fontWeight: 200,
                  fontSize: "clamp(44px,6.4vw,96px)",
                  lineHeight: 1.02,
                  letterSpacing: "-.04em",
                  textWrap: "balance",
                  color: "#1C1C1C",
                }}
              >
                {title}
              </h1>
            </Reveal>
            {text ? (
              <Reveal delay={160}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "clamp(15px,1.2vw,17px)",
                    lineHeight: 1.75,
                    color: "#5A5A5A",
                    maxWidth: 540,
                    textWrap: "pretty",
                  }}
                >
                  {text}
                </p>
              </Reveal>
            ) : null}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div key={it.q} style={{ borderRadius: 20, background: "#F7F5F2" }}>
            <button
              type="button"
              aria-expanded={on}
              onClick={() => setOpen(on ? -1 : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                minHeight: 64,
                padding: "16px 22px",
                background: "none",
                border: 0,
                cursor: "pointer",
                textAlign: "right",
                color: "#1C1C1C",
                fontSize: 16,
                fontWeight: 500,
                lineHeight: 1.45,
                fontFamily: "inherit",
              }}
            >
              <span>{it.q}</span>
              <span style={{ flex: "none", width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,.75)", position: "relative", display: "block" }}>
                <span style={{ position: "absolute", top: 14.5, right: 9, left: 9, height: 1.5, borderRadius: 2, background: "#1C1C1C" }} />
                <span
                  style={{
                    position: "absolute",
                    top: 14.5,
                    right: 9,
                    left: 9,
                    height: 1.5,
                    borderRadius: 2,
                    background: "#1C1C1C",
                    transform: on ? "rotate(0deg)" : "rotate(90deg)",
                    transition: "transform .35s ease",
                  }}
                />
              </span>
            </button>
            {on ? (
              <div style={{ padding: "0 22px 22px 60px", fontSize: 15, lineHeight: 1.75, color: "#4A4A4A", textWrap: "pretty" }}>{it.a}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Single clinic result card — full before/after collage image (no interactive slider). */
export function ResultPhotoCard({
  slotId,
  caption,
  note,
  ratio = "5/4",
  placeholder = "תוצאה מהקליניקה",
}: {
  slotId: string;
  caption?: string;
  note?: string;
  ratio?: string;
  placeholder?: string;
}) {
  return (
    <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: ratio,
          borderRadius: 24,
          background: "#F2EBE4",
          color: "#999",
          overflow: "hidden",
        }}
      >
        <Slot id={slotId} placeholder={placeholder} fit="contain" />
      </div>
      {caption ? (
        <figcaption style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, padding: "0 6px" }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#1C1C1C" }}>{caption}</span>
          {note ? <span style={{ fontSize: 13, color: "#8A8A8A" }}>{note}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function IgIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function FbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.4 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21h3.1z" />
    </svg>
  );
}

export function TtIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.6 3h-3.1v12.2a2.7 2.7 0 11-2.7-2.7c.3 0 .6 0 .8.1V9.4a5.8 5.8 0 105 5.8V9.1a7.3 7.3 0 004.3 1.4V7.4A4.3 4.3 0 0116.6 3z" />
    </svg>
  );
}

export function Socials() {
  const items = [
    { label: "Instagram", icon: <IgIcon /> },
    { label: "Facebook", icon: <FbIcon /> },
    { label: "TikTok", icon: <TtIcon /> },
  ];
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {items.map((item) => (
        <a key={item.label} href="#" aria-label={item.label} title={item.label} className="social">
          {item.icon}
        </a>
      ))}
    </div>
  );
}

export function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M4.5 7.5h13l-1 11a1.5 1.5 0 01-1.5 1.4H7a1.5 1.5 0 01-1.5-1.4l-1-11z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8 9.5V6.5a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export { ResponsiveCarousel } from "./responsive-carousel";

export function h2Style(size = "clamp(36px,4.6vw,68px)"): CSSProperties {
  return {
    margin: 0,
    fontWeight: 200,
    fontSize: size,
    lineHeight: 1.02,
    letterSpacing: "-.03em",
    textWrap: "balance",
  };
}
