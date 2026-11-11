"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MENU_ROUTES, NAV, SITE_EMAIL, TOP_NAV, waLink } from "@/lib/data";
import { useSite } from "@/lib/site";
import { pageScrollY } from "@/lib/scroll-lock";
import { MenuButton, MobileMenu } from "./mobile-menu";
import { CartDrawer } from "./cart-drawer";
import { StorePopups } from "./store-popups";
import { Socials } from "./ui";
import { LegalLinks } from "./legal-controls";

const CONSULT = waLink("היי שיר, אשמח לתאם שיחת ייעוץ ללא עלות.");

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
  const promoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = pageScrollY();
      setScrolled(y > 30);
      const promoH = promoRef.current?.offsetHeight ?? 36;
      const safe = Math.max(0, promoH - 36);
      if (hdRef.current) hdRef.current.style.top = Math.max(safe, promoH - y) + "px";
    };
    const onResize = () => {
      const next = window.innerWidth >= 1200;
      setWide(next);
      if (next) site.closeMenu();
      onScroll();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") site.closeMenu();
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
  const showFab = !wide && site.width < 760 && !["/shop", "/checkout"].includes(path) && !path.startsWith("/shop/") && !site.menuOpen;

  if (path === "/checkout" || path.startsWith("/checkout/")) {
    return <div className="checkout-shell" dir="rtl" lang="he">
      <a className="skip-link" href="#main-content">דילוג לתוכן הראשי</a>
      <header className="checkout-header"><div><Logo onDark={false} small /><Link href="/shop">חזרה לחנות <span aria-hidden="true">←</span></Link></div></header>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <CartDrawer />
    </div>;
  }

  return (
    <div dir="rtl" lang="he" style={{ minHeight: "100vh", background: "#fff", color: "#1C1C1C" }}>
      <a className="skip-link" href="#main-content">דילוג לתוכן הראשי</a>
      <div ref={promoRef} className="promo" role="note" aria-label="הזמנות מהחנות בוואטסאפ, האתר שומר שבת">
        {wide ? (
          <div style={{ width: "100%", textAlign: "center", padding: "0 16px" }}>הזמנות מהחנות באתר · האתר שומר שבת</div>
        ) : (
          <div className="promo-track" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>
                הזמנות מהחנות באתר · האתר שומר שבת
                <i />
              </span>
            ))}
          </div>
        )}
      </div>

      <header ref={hdRef} className="site-header" data-scrolled={scrolled} style={{ position: "fixed", top: "calc(36px + env(safe-area-inset-top, 0px))", right: 0, left: 0, zIndex: 50, height: 0, margin: 0, padding: 0, pointerEvents: "none" }}>
        <div ref={barRef} className="site-header__backing" style={{ position: "absolute", top: 0, right: 0, left: 0, padding: "12px clamp(12px,2vw,24px)", pointerEvents: "none" }}>
        <div
          className="site-header__bar"
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
                <a href={CONSULT} target="_blank" rel="noopener noreferrer" className={onDark ? "pill white-pill" : "pill gold"} style={{ height: 44, padding: "0 20px", fontSize: 14 }}>
                  לתיאום ייעוץ ללא עלות
                </a>
                <CartButton ink={ink} bg={iconBg} count={site.count} onClick={site.openCart} />
              </div>
            </>
          ) : (
            <>
              <MenuButton open={site.menuOpen} ink={ink} bg={iconBg} onClick={() => (site.menuOpen ? site.closeMenu() : site.openMenu())} />
              <Logo onDark={onDark} small />
              <CartButton ink={ink} bg={iconBg} count={site.count} onClick={site.openCart} />
            </>
          )}
        </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>{children}</main>

      {showFooter ? (
        <footer style={{ background: "#F7F5F2" }}>
          <div style={{ maxWidth: 1320, margin: "0 auto", padding: "clamp(40px,6vw,72px) clamp(24px,5vw,64px) 28px", display: "flex", flexDirection: "column", gap: "clamp(40px,5vw,64px)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 40 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
                <img src="/assets/logo-gold.png" alt="SHIR LAVY - Aesthetics & Academy" style={{ width: 132, height: "auto" }} />
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
                <a href={`mailto:${SITE_EMAIL}`} dir="ltr" style={{ alignSelf: "flex-start", color: "inherit" }}>{SITE_EMAIL}</a>
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
              <LegalLinks />
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

      <CartDrawer />
      <StorePopups />

      {!wide ? (
        <MobileMenu
          open={site.menuOpen}
          onClose={site.closeMenu}
          anchorRef={barRef}
          ctaHref={CONSULT}
          activeKey={activeMenuKey(path)}
          onNavigate={(key) => router.push(MENU_ROUTES[key] ?? "/")}
        />
      ) : null}

    </div>
  );
}

function CartButton({ ink, bg, count, onClick }: { ink: string; bg: string; count: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={count ? `עגלה, ${count} פריטים` : "עגלה"} style={{ width: 44, height: 44, padding: 0, border: 0, borderRadius: 999, background: bg, color: ink, cursor: "pointer", position: "relative", display: "grid", placeItems: "center", fontFamily: "inherit", lineHeight: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 7h15l-1.5 9h-12L5 4H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="20" r="1.2" fill="currentColor" />
        <circle cx="18" cy="20" r="1.2" fill="currentColor" />
      </svg>
      {count > 0 ? <span style={{ position: "absolute", top: 1, left: 1, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 999, background: "#8F6A4B", color: "#fff", fontSize: 10, lineHeight: 1, display: "grid", placeItems: "center", boxShadow: `0 0 0 2px ${bg}` }}>{count}</span> : null}
    </button>
  );
}

function Logo({ onDark, small }: { onDark: boolean; small?: boolean }) {
  const m = small ? 28 : 30;
  const h = small ? 13 : 14;
  return (
    <Link href="/" aria-label="SHIR LAVY - דף הבית" dir="ltr" style={{ background: "none", border: 0, padding: small ? 0 : "0 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: small ? 9 : 10, flex: "none" }}>
      <img src={onDark ? "/assets/monogram-ivory.png" : "/assets/monogram-gold.png"} alt="" style={{ width: m, height: m }} />
      <img src={onDark ? "/assets/name-ivory.png" : "/assets/name-gold.png"} alt="SHIR LAVY" style={{ height: h, width: "auto" }} />
    </Link>
  );
}

