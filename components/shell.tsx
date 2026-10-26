"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, TOP_NAV, fmt, waLink } from "@/lib/data";
import { useSite } from "@/lib/site";
import { MenuButton, MobileMenu } from "./mobile-menu";
import { BagIcon, Slot, Socials } from "./ui";

const CONSULT = waLink("היי שיר, אשמח לתאם שיחת ייעוץ ללא עלות.");

const MENU_ROUTES: Record<string, string> = {
  home: "/",
  about: "/about",
  brows: "/brows",
  removal: "/removal",
  aesthetics: "/aesthetics",
  academy: "/academy",
  shop: "/shop",
  contact: "/contact",
};

function activeMenuKey(path: string) {
  if (path.startsWith("/aesthetics")) return "aesthetics";
  if (path.startsWith("/shop")) return "shop";
  if (path === "/") return "home";
  return path.slice(1);
}

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const site = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);
  const [wide, setWide] = useState(true);
  const hdRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      if (hdRef.current) hdRef.current.style.top = Math.max(0, 36 - window.scrollY) + "px";
    };
    const onResize = () => {
      const next = window.innerWidth >= 1200;
      setWide(next);
      if (next) site.closeMenu();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        site.closeCart();
        site.closeMenu();
      }
    };
    onScroll();
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [site]);

  const navKey =
    path.startsWith("/shop/") ? "/shop" : path.startsWith("/aesthetics/") ? "/aesthetics" : path;
  const onDark = path === "/" && !scrolled && !site.menuOpen;
  const solid = scrolled || path === "/checkout";
  const headerBg = onDark ? "transparent" : solid ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.75)";
  const headerLine = onDark ? "transparent" : "rgba(41,37,34,.06)";
  const ink = onDark ? "#FFFFFF" : "#1C1C1C";
  const iconBg = onDark ? "rgba(255,255,255,.16)" : "#F5EEE7";
  const hoverBg = onDark ? "rgba(255,255,255,.12)" : "#F7F5F2";
  const showFooter = path !== "/checkout";
  const showFab = !wide && site.width < 760 && !["/shop", "/checkout"].includes(path) && !path.startsWith("/shop/") && !site.menuOpen && !site.cartOpen;

  return (
    <div dir="rtl" lang="he" style={{ minHeight: "100vh", background: "#fff", color: "#1C1C1C", overflowX: "clip" }}>
      <div className="promo" role="note" aria-label="משלוח חינם בקנייה מעל 199 ₪">
        {wide ? (
          <div style={{ width: "100%", textAlign: "center", padding: "0 16px" }}>משלוח חינם בקנייה מעל 199 ₪</div>
        ) : (
          <div className="promo-track" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>
                משלוח חינם בקנייה מעל 199 ₪
                <i />
              </span>
            ))}
          </div>
        )}
      </div>

      <header ref={hdRef} style={{ position: "fixed", top: 36, right: 0, left: 0, zIndex: 50, padding: "12px clamp(12px,2vw,24px)", pointerEvents: "none" }}>
        <div
          style={{
            pointerEvents: "auto",
            maxWidth: 1320,
            margin: "0 auto",
            height: 64,
            padding: "0 10px",
            borderRadius: 999,
            background: headerBg,
            border: `1px solid ${headerLine}`,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            transition: "background .4s, border-color .4s",
          }}
        >
          {wide ? (
            <>
              <Logo onDark={onDark} />
              <nav aria-label="ניווט ראשי" style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {TOP_NAV.map((n) => {
                  const active = n.kids ? n.kids.some((c) => c.href === navKey) : navKey === n.href;
                  const open = drop === n.label;
                  return (
                    <div key={n.label} style={{ position: "relative" }} onMouseEnter={() => n.kids && setDrop(n.label)} onMouseLeave={() => n.kids && setDrop(null)}>
                      {n.kids ? (
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-haspopup="true"
                          onClick={() => setDrop(open ? null : n.label)}
                          className="nav-btn"
                          style={{ background: active ? (onDark ? "rgba(255,255,255,.16)" : "#F5EEE7") : "transparent", color: ink, ["--nav-hover" as string]: hoverBg }}
                        >
                          {n.label}
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .3s" }}>
                            <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      ) : (
                        <Link
                          href={n.href!}
                          className="nav-btn"
                          style={{ background: active ? (onDark ? "rgba(255,255,255,.16)" : "#F5EEE7") : "transparent", color: ink, ["--nav-hover" as string]: hoverBg }}
                        >
                          {n.label}
                        </Link>
                      )}
                      {n.kids && open ? (
                        <div style={{ position: "absolute", top: "100%", right: 0, paddingTop: 12, zIndex: 5 }}>
                          <div style={{ minWidth: 230, background: "#fff", borderRadius: 20, padding: 8, border: "1px solid rgba(41,37,34,.08)", boxShadow: "0 16px 40px rgba(41,37,34,.12)", display: "flex", flexDirection: "column", gap: 2 }}>
                            {n.kids.map((c) => (
                              <Link key={c.href} href={c.href} onClick={() => setDrop(null)} className="drop-link" style={{ background: navKey === c.href ? "#F5EEE7" : "transparent" }}>
                                {c.label}
                                <span aria-hidden style={{ color: "#8F6A4B" }}>←</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </nav>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "none" }}>
                <CartButton ink={ink} iconBg={iconBg} count={site.count} onClick={site.openCart} />
                <a href={CONSULT} target="_blank" rel="noopener noreferrer" className={onDark ? "pill white-pill" : "pill gold"} style={{ height: 44, padding: "0 20px", fontSize: 14 }}>
                  לתיאום ייעוץ ללא עלות
                </a>
              </div>
            </>
          ) : (
            <>
              <MenuButton open={site.menuOpen} ink={ink} bg={iconBg} onClick={() => (site.menuOpen ? site.closeMenu() : site.openMenu())} />
              <Logo onDark={onDark} small />
              <CartButton ink={ink} iconBg={iconBg} count={site.count} onClick={site.openCart} />
            </>
          )}
        </div>
      </header>

      <main>{children}</main>

      {showFooter ? (
        <footer style={{ padding: "0 clamp(12px,2vw,24px) clamp(12px,2vw,24px)" }}>
          <div style={{ maxWidth: 1320, margin: "0 auto", background: "#F7F5F2", borderRadius: 32, padding: "clamp(40px,6vw,72px) clamp(24px,5vw,64px) 28px", display: "flex", flexDirection: "column", gap: "clamp(40px,5vw,64px)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 40 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
                <img src="/assets/logo-gold.png" alt="SHIR LAVY — Aesthetics & Academy" style={{ width: 132, height: "auto" }} />
                <span style={{ fontSize: 14, lineHeight: 1.7, color: "#5A5A5A", maxWidth: 240 }}>קליניקת בוטיק לאיפור קבוע ואסתטיקה, ואקדמיה מקצועית לנשים.</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#7A573C", marginBottom: 8 }}>ניווט</span>
                {NAV.map(([href, label]) => (
                  <Link key={href} href={href} className="foot-link">
                    {label}
                  </Link>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "#5A5A5A", lineHeight: 1.6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#7A573C", marginBottom: 4 }}>הקליניקה</span>
                <span>לנשים בלבד</span>
                <span>[כתובת הקליניקה]</span>
                <span>[שעות פעילות]</span>
                <span>[כתובת אימייל]</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#7A573C", marginBottom: 4 }}>עקבי אחרינו</span>
                <Socials />
                <a href={CONSULT} target="_blank" rel="noopener noreferrer" className="pill gold" style={{ height: 44, fontSize: 14, marginTop: 10, alignSelf: "flex-start" }}>
                  כתבי לנו בוואטסאפ
                </a>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, borderTop: "1px solid rgba(164,123,88,.22)", paddingTop: 22, fontSize: 13, color: "#8A8A8A" }}>
              <span>© SHIR LAVY Aesthetics & Academy</span>
              <span style={{ display: "flex", gap: 20 }}>
                <a href="#" style={{ color: "#8A8A8A" }}>מדיניות פרטיות</a>
                <a href="#" style={{ color: "#8A8A8A" }}>תקנון</a>
                <a href="#" style={{ color: "#8A8A8A" }}>הצהרת נגישות</a>
              </span>
            </div>
          </div>
        </footer>
      ) : null}

      {showFab ? (
        <a href={CONSULT} target="_blank" rel="noopener noreferrer" aria-label="שיחה בוואטסאפ" className="fab">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4.5 19.5l1.1-3.6A8 8 0 1112 20a8 8 0 01-3.9-1l-3.6.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </a>
      ) : null}

      {!wide ? (
        <MobileMenu
          open={site.menuOpen}
          onClose={site.closeMenu}
          anchorRef={hdRef}
          ctaHref={CONSULT}
          activeKey={activeMenuKey(path)}
          onNavigate={(key) => router.push(MENU_ROUTES[key] ?? "/")}
        />
      ) : null}

      {site.cartOpen ? (
        <div style={{ position: "fixed", inset: 0, zIndex: 80 }}>
          <div onClick={site.closeCart} style={{ position: "absolute", inset: 0, background: "rgba(41,37,34,.28)", backdropFilter: "blur(2px)" }} />
          <aside role="dialog" aria-modal="true" aria-label="סל הקניות" className="drawer">
            <div style={{ flex: "none", padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 20, fontWeight: 500 }}>הסל שלך</span>
                <span style={{ fontSize: 14, color: "#8A8A8A" }}>{site.count === 1 ? "פריט אחד" : `${site.count} פריטים`}</span>
              </div>
              <button type="button" onClick={site.closeCart} aria-label="סגירה" className="round" style={{ width: 40, height: 40, background: "#F5EEE7", color: "#1C1C1C" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {site.count === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 40, textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F7F5F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#5A5A5A" }}>
                  <BagIcon />
                </div>
                <div style={{ fontSize: 20, fontWeight: 500 }}>הסל ריק</div>
                <div style={{ fontSize: 15, color: "#5A5A5A" }}>עוד לא הוספת מוצרים.</div>
                <button
                  type="button"
                  className="pill gold"
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    site.closeCart();
                    router.push("/shop");
                  }}
                >
                  למעבר לחנות
                </button>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: "auto", padding: "0 22px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {site.lines.map((l) => (
                    <div key={l.key} style={{ display: "grid", gridTemplateColumns: "76px minmax(0,1fr)", gap: 14, padding: 10, borderRadius: 20 }}>
                      <div style={{ width: 76, height: 90, borderRadius: 14, overflow: "hidden", background: "#F2EBE4", color: "#999", position: "relative" }}>
                        <Slot id={l.slot} fit="contain" />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, padding: "4px 0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                          <button type="button" onClick={() => { site.closeCart(); router.push(`/shop/${l.id}`); }} style={{ background: "none", border: 0, padding: 0, textAlign: "right", cursor: "pointer", fontSize: 15, fontWeight: 500, color: "#1C1C1C", fontFamily: "inherit" }}>
                            {l.name}
                          </button>
                          <span style={{ fontSize: 15, whiteSpace: "nowrap" }}>{l.total}</span>
                        </div>
                        <span style={{ fontSize: 13, color: "#8A8A8A" }}>{l.meta}</span>
                        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", height: 36, borderRadius: 999, background: "#F7F5F2" }}>
                            <button type="button" aria-label="הוספת יחידה" onClick={() => site.setQty(l.key, l.qty + 1)} className="qty">+</button>
                            <span style={{ width: 22, textAlign: "center", fontSize: 14 }}>{l.qty}</span>
                            <button type="button" aria-label="הפחתת יחידה" onClick={() => site.setQty(l.key, l.qty - 1)} className="qty">−</button>
                          </div>
                          <button type="button" onClick={() => site.setQty(l.key, 0)} style={{ height: 36, padding: "0 6px", background: "none", border: 0, cursor: "pointer", fontSize: 13, color: "#8A8A8A", fontFamily: "inherit" }}>
                            הסרה
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ flex: "none", padding: "18px 22px calc(20px + env(safe-area-inset-bottom))", display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid rgba(41,37,34,.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 15, color: "#5A5A5A" }}>סכום ביניים</span>
                    <span style={{ fontSize: 20, fontWeight: 500 }}>{fmt(site.subtotal)}</span>
                  </div>
                  <span style={{ fontSize: 13, color: "#8A8A8A" }}>דמי משלוח יחושבו בתשלום.</span>
                  <button
                    type="button"
                    className="pill gold"
                    style={{ height: 54, width: "100%" }}
                    onClick={() => {
                      site.closeCart();
                      router.push("/checkout");
                    }}
                  >
                    לתשלום
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function Logo({ onDark, small }: { onDark: boolean; small?: boolean }) {
  const m = small ? 28 : 30;
  const h = small ? 13 : 14;
  return (
    <Link href="/" aria-label="SHIR LAVY — דף הבית" dir="ltr" style={{ background: "none", border: 0, padding: small ? 0 : "0 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: small ? 9 : 10, flex: "none" }}>
      <img src={onDark ? "/assets/monogram-ivory.png" : "/assets/monogram-gold.png"} alt="" style={{ width: m, height: m }} />
      <img src={onDark ? "/assets/name-ivory.png" : "/assets/name-gold.png"} alt="SHIR LAVY" style={{ height: h, width: "auto" }} />
    </Link>
  );
}

function CartButton({ ink, iconBg, count, onClick }: { ink: string; iconBg: string; count: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="סל הקניות" className="round" style={{ position: "relative", background: iconBg, color: ink, transition: "background .4s, color .4s" }}>
      <BagIcon />
      {count > 0 ? (
        <span style={{ position: "absolute", top: -2, left: -2, minWidth: 18, height: 18, padding: "0 5px", borderRadius: 9, background: "#8F6A4B", color: "#fff", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {count}
        </span>
      ) : null}
    </button>
  );
}
