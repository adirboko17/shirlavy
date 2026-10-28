"use client";

import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { useSite } from "@/lib/site";

type Align = "right" | "center" | "left";
type Block =
  | { type: "heading" | "text"; text: string; color: string; size: number; align: Align }
  | { type: "image"; src: string; alt: string; radius: number }
  | { type: "button"; label: string; href: string; background: string; color: string; radius: number }
  | { type: "field"; fieldType: string; label: string; name: string; placeholder: string; required: boolean }
  | { type: "spacer"; height: number }
  | { type: "row"; columns: { blocks: Block[] }[] };

type Popup = {
  id: string;
  design: {
    layout: "modal" | "bar" | "corner";
    width: number;
    radius: number;
    padding: number;
    gap: number;
    background: string;
    overlay: number;
    closeOnOverlay: boolean;
    closeColor: string;
    blocks: Block[];
    submitLabel: string;
    submitBackground: string;
    submitColor: string;
    successTitle: string;
    successText: string;
  };
  targeting: {
    pages: { all?: boolean; home?: boolean; product?: boolean; catalog?: boolean; checkout?: boolean; content?: boolean; paths?: string[] };
    trigger: "immediate" | "delay" | "scroll" | "exit";
    delaySeconds: number;
    scrollPercent: number;
    frequency: "always" | "session" | "day" | "once";
    device: "all" | "desktop" | "mobile";
  };
};

const shownAlways = new Set<string>();

function text(value: unknown, max = 500) {
  return typeof value === "string" ? value.replace(/\u0000/g, "").slice(0, max) : "";
}

function safeUrl(value: unknown, button = false) {
  const raw = text(value, 2000).trim();
  if (raw.startsWith("https://")) return raw;
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  if (button && /^(mailto:|tel:)/i.test(raw)) return raw;
  return "";
}

function blockOf(value: unknown): Block | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const type = row.type;
  if (type === "heading" || type === "text") {
    return { type, text: text(row.text), color: text(row.color, 20) || "#1C1C1C", size: numberOf(row.size, 16, 12, 64), align: alignOf(row.align) };
  }
  if (type === "image") {
    const src = safeUrl(row.src);
    if (!src) return null;
    return { type, src, alt: text(row.alt, 160), radius: numberOf(row.radius, 12, 0, 40) };
  }
  if (type === "button") {
    const href = safeUrl(row.href, true);
    if (!href || !text(row.label, 80)) return null;
    return { type, label: text(row.label, 80), href, background: text(row.background, 20) || "#1C1C1C", color: text(row.color, 20) || "#fff", radius: numberOf(row.radius, 999, 0, 999) };
  }
  if (type === "field") {
    const name = text(row.name, 40).toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!name) return null;
    return { type, fieldType: text(row.fieldType, 20) || "text", label: text(row.label, 80), name, placeholder: text(row.placeholder, 80), required: row.required === true };
  }
  if (type === "spacer") return { type, height: numberOf(row.height, 12, 0, 120) };
  if (type === "row" && Array.isArray(row.columns)) {
    const columns = row.columns.flatMap((column) => {
      if (!column || typeof column !== "object" || !Array.isArray((column as { blocks?: unknown }).blocks)) return [];
      const blocks = (column as { blocks: unknown[] }).blocks.flatMap((item) => {
        const child = blockOf(item);
        return child && child.type !== "row" ? [child] : [];
      });
      return blocks.length ? [{ blocks }] : [];
    });
    return columns.length ? { type, columns } : null;
  }
  return null;
}

function numberOf(value: unknown, fallback: number, min: number, max: number) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function alignOf(value: unknown): Align {
  return value === "center" || value === "left" ? value : "right";
}

function parsePopup(value: unknown): Popup | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const id = text(row.id, 80);
  const design = row.design && typeof row.design === "object" ? row.design as Record<string, unknown> : null;
  const targeting = row.targeting && typeof row.targeting === "object" ? row.targeting as Record<string, unknown> : null;
  if (!id || !design || !targeting) return null;
  const pages = targeting.pages && typeof targeting.pages === "object" ? targeting.pages as Record<string, unknown> : {};
  const layout = design.layout === "bar" || design.layout === "corner" ? design.layout : "modal";
  const trigger = targeting.trigger === "delay" || targeting.trigger === "scroll" || targeting.trigger === "exit" ? targeting.trigger : "immediate";
  const frequency = targeting.frequency === "session" || targeting.frequency === "day" || targeting.frequency === "once" ? targeting.frequency : "always";
  const device = targeting.device === "desktop" || targeting.device === "mobile" ? targeting.device : "all";
  const blocks = Array.isArray(design.blocks) ? design.blocks.flatMap((item) => {
    const block = blockOf(item);
    return block ? [block] : [];
  }) : [];
  return {
    id,
    design: {
      layout,
      width: numberOf(design.width, 420, 240, 840),
      radius: numberOf(design.radius, 24, 0, 40),
      padding: numberOf(design.padding, 24, 0, 64),
      gap: numberOf(design.gap, 12, 0, 40),
      background: text(design.background, 20) || "#fff",
      overlay: numberOf(design.overlay, 0.45, 0, 1),
      closeOnOverlay: design.closeOnOverlay !== false,
      closeColor: text(design.closeColor, 20) || "#1C1C1C",
      blocks,
      submitLabel: text(design.submitLabel, 40) || "שליחה",
      submitBackground: text(design.submitBackground, 20) || "#8F6A4B",
      submitColor: text(design.submitColor, 20) || "#fff",
      successTitle: text(design.successTitle, 120) || "תודה",
      successText: text(design.successText, 400),
    },
    targeting: {
      pages: {
        all: pages.all === true,
        home: pages.home === true,
        product: pages.product === true,
        catalog: pages.catalog === true,
        checkout: pages.checkout === true,
        content: pages.content === true,
        paths: Array.isArray(pages.paths) ? pages.paths.filter((item): item is string => typeof item === "string" && item.startsWith("/")) : [],
      },
      trigger,
      delaySeconds: numberOf(targeting.delaySeconds, 0, 0, 120),
      scrollPercent: numberOf(targeting.scrollPercent, 40, 0, 100),
      frequency,
      device,
    },
  };
}

function pageMatches(path: string, pages: Popup["targeting"]["pages"]) {
  if (pages.all) return true;
  const product = path.startsWith("/product") || /^\/shop\/[^/]+$/.test(path);
  const catalog = path === "/shop" || path.startsWith("/products") || path.startsWith("/olimini");
  const content = path.startsWith("/articles") || path.startsWith("/journal") || path.startsWith("/podcast") || path.split("/").some((part) => /[\u0590-\u05FF]/.test(part));
  if (pages.home && path === "/") return true;
  if (pages.product && product) return true;
  if (pages.catalog && catalog) return true;
  if (pages.checkout && path.startsWith("/checkout")) return true;
  if (pages.content && content) return true;
  return (pages.paths ?? []).some((prefix) => path === prefix || path.startsWith(`${prefix}/`) || (prefix.startsWith("/articles/") && (path.startsWith(`/journal/${prefix.slice("/articles/".length)}`) || content && path.endsWith(prefix.slice(prefix.lastIndexOf("/"))))));
}

function storageKey(id: string) {
  return `storely-popup:${id}`;
}

function dismissed(popup: Popup) {
  if (typeof window === "undefined") return true;
  const key = storageKey(popup.id);
  if (popup.targeting.frequency === "always") return shownAlways.has(`${popup.id}:${window.location.pathname}`);
  if (popup.targeting.frequency === "session") return sessionStorage.getItem(key) === "1";
  const stored = localStorage.getItem(key);
  if (!stored) return false;
  if (popup.targeting.frequency === "once") return true;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(new Date());
  return stored === today;
}

function remember(popup: Popup) {
  const key = storageKey(popup.id);
  if (popup.targeting.frequency === "always") {
    shownAlways.add(`${popup.id}:${window.location.pathname}`);
    return;
  }
  if (popup.targeting.frequency === "session") {
    sessionStorage.setItem(key, "1");
    return;
  }
  if (popup.targeting.frequency === "day") {
    localStorage.setItem(key, new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(new Date()));
    return;
  }
  localStorage.setItem(key, "1");
}

function fieldName(block: Extract<Block, { type: "field" }>, index: number) {
  return /^[a-z][a-z0-9_]{0,40}$/.test(block.name) ? block.name : `field_${index}`;
}

export function StorePopups() {
  const site = useSite();
  const path = usePathname() || "/";
  const popups = useMemo(() => site.shop.popups.flatMap((item) => {
    const popup = parsePopup(item);
    return popup ? [popup] : [];
  }), [site.shop.popups]);
  const [active, setActive] = useState<Popup | null>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const blocked = site.menuOpen || site.cartOpen;

  useEffect(() => {
    setActive(null);
    setSent(false);
    if (blocked) return;
    const popup = popups.find((item) => {
      const desktop = window.innerWidth > 760;
      if (item.targeting.device === "desktop" && !desktop) return false;
      if (item.targeting.device === "mobile" && desktop) return false;
      if (!pageMatches(path, item.targeting.pages)) return false;
      return !dismissed(item);
    });
    if (!popup) return;
    let timer = 0;
    let onScroll: (() => void) | null = null;
    let onExit: ((event: MouseEvent) => void) | null = null;
    const open = () => {
      if (site.menuOpen || site.cartOpen) return;
      setActive(popup);
    };
    const delay = () => window.setTimeout(open, Math.max(0, popup.targeting.delaySeconds) * 1000);
    const shortPage = document.documentElement.scrollHeight <= window.innerHeight + 40;
    if (popup.targeting.trigger === "immediate") open();
    else if (popup.targeting.trigger === "delay" || (popup.targeting.trigger === "scroll" && shortPage) || (popup.targeting.trigger === "exit" && window.innerWidth <= 760)) timer = delay();
    else if (popup.targeting.trigger === "scroll") {
      onScroll = () => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        if (height <= 0 || (window.scrollY / height) * 100 >= popup.targeting.scrollPercent) {
          open();
          window.removeEventListener("scroll", onScroll!);
        }
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      onExit = (event) => {
        if (event.clientY <= 0) open();
      };
      document.addEventListener("mouseout", onExit);
    }
    return () => {
      window.clearTimeout(timer);
      if (onScroll) window.removeEventListener("scroll", onScroll);
      if (onExit) document.removeEventListener("mouseout", onExit);
    };
  }, [path, popups, blocked, site.menuOpen, site.cartOpen]);

  useEffect(() => {
    if (!active || active.design.layout !== "modal") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  function close() {
    if (active) remember(active);
    setActive(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active) return;
    const data = new FormData(event.currentTarget);
    const fields: Record<string, string> = {};
    let index = 0;
    for (const block of walk(active.design.blocks)) {
      if (block.type !== "field") continue;
      const name = fieldName(block, index);
      index += 1;
      fields[name] = String(data.get(name) ?? "");
    }
    setPending(true);
    setError("");
    const response = await fetch("/api/storely/popup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ popupId: active.id, fields, pagePath: path }),
    });
    setPending(false);
    if (!response.ok) {
      setError("לא הצלחנו לשלוח. נסי שוב.");
      return;
    }
    remember(active);
    setSent(true);
  }

  if (!active) return null;
  const design = active.design;
  const motion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const position: CSSProperties = design.layout === "bar"
    ? { left: 16, right: 16, bottom: 16, width: "auto" }
    : design.layout === "corner"
      ? { left: 16, bottom: 16, width: Math.min(design.width, window.innerWidth - 32) }
      : { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: `min(${design.width}px, calc(100% - 32px))` };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 90, pointerEvents: design.layout === "modal" ? "auto" : "none" }}>
      {design.layout === "modal" ? (
        <button type="button" aria-label="סגירת חלון" onClick={() => design.closeOnOverlay && close()} style={{ position: "absolute", inset: 0, border: 0, background: `rgba(28,28,28,${design.overlay})`, cursor: design.closeOnOverlay ? "pointer" : "default" }} />
      ) : null}
      <div role="dialog" aria-modal={design.layout === "modal"} style={{ pointerEvents: "auto", position: "fixed", ...position, background: design.background, borderRadius: design.radius, padding: design.padding, boxShadow: "0 18px 50px rgba(41,37,34,.18)", transition: motion ? "none" : "opacity .2s" }}>
        <button type="button" onClick={close} aria-label="סגירה" style={{ position: "absolute", top: 10, left: 10, border: 0, background: "transparent", color: design.closeColor, fontSize: 22, cursor: "pointer" }}>×</button>
        {sent ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <strong style={{ fontSize: 22, fontWeight: 500 }}>{design.successTitle}</strong>
            <p style={{ margin: 0 }}>{design.successText}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: design.gap }}>
            {design.blocks.map((block, index) => <BlockView key={index} block={block} />)}
            {walk(design.blocks).some((block) => block.type === "field") ? (
              <button type="submit" disabled={pending} className="pill" style={{ height: 48, background: design.submitBackground, color: design.submitColor, border: 0 }}>
                {pending ? "שולחים..." : design.submitLabel}
              </button>
            ) : null}
            {error ? <span style={{ color: "#8A3A3A", fontSize: 14 }}>{error}</span> : null}
          </form>
        )}
      </div>
    </div>
  );
}

function walk(blocks: Block[]): Block[] {
  return blocks.flatMap((block) => (block.type === "row" ? block.columns.flatMap((column) => column.blocks) : [block]));
}

function BlockView({ block }: { block: Block }) {
  if (block.type === "heading" || block.type === "text") {
    const Tag = block.type === "heading" ? "strong" : "p";
    return <Tag style={{ margin: 0, color: block.color, fontSize: block.size, textAlign: block.align, fontWeight: block.type === "heading" ? 500 : 400, whiteSpace: "pre-wrap" }}>{block.text}</Tag>;
  }
  if (block.type === "image") return <img src={block.src} alt={block.alt} style={{ width: "100%", borderRadius: block.radius }} />;
  if (block.type === "button") {
    return <a href={block.href} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 46, padding: "0 18px", borderRadius: block.radius, background: block.background, color: block.color, textDecoration: "none" }}>{block.label}</a>;
  }
  if (block.type === "spacer") return <div style={{ height: block.height }} />;
  if (block.type === "field") {
    const name = fieldName(block, 0);
    const common = { name, required: block.required, placeholder: block.placeholder, "aria-label": block.label || name };
    return (
      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}>
        {block.label}
        {block.fieldType === "textarea"
          ? <textarea {...common} style={fieldStyle} />
          : <input {...common} type={block.fieldType === "email" || block.fieldType === "tel" ? block.fieldType : "text"} style={fieldStyle} />}
      </label>
    );
  }
  if (block.type !== "row") return null;
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {block.columns.map((column, index) => (
        <div key={index} style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 8 }}>
          {column.blocks.map((child, childIndex) => <BlockView key={childIndex} block={child} />)}
        </div>
      ))}
    </div>
  );
}

const fieldStyle: CSSProperties = {
  height: 44,
  borderRadius: 12,
  border: "1px solid rgba(28,28,28,.12)",
  padding: "0 12px",
  font: "inherit",
  background: "#fff",
};
