// SHIR LAVY — Mobile menu (floating panel + morphing hamburger)
// React 18+. No dependencies. RTL. Uses Web Animations API for enter/exit.
// Fonts: Heebo (Google Fonts). Colors: #8F6A4B brand brown, #1C1C1C ink, #F7F3EE active row.

import { useEffect, useRef, useState, useCallback } from 'react';

const EASE = 'cubic-bezier(.16,.8,.2,1)';
const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Navigation data. A group (kids) renders as pill buttons under its title. */
export const NAV = [
  { key: 'home', label: 'ראשי' },
  { key: 'about', label: 'נעים להכיר' },
  { key: 'treatments', label: 'טיפולים', kids: [
    { key: 'brows', label: 'טיפולי גבות' },
    { key: 'removal', label: 'הסרת איפור קבוע' },
    { key: 'aesthetics', label: 'אסתטיקה' },
  ] },
  { key: 'academy', label: 'האקדמיה' },
  { key: 'shop', label: 'חנות' },
  { key: 'contact', label: 'יצירת קשר' },
];

export const SOCIALS = [
  { label: 'Instagram', href: '#', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" /></svg>
  ) },
  { label: 'Facebook', href: '#', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.4 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21h3.1z" /></svg>
  ) },
  { label: 'TikTok', href: '#', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3h-3.1v12.2a2.7 2.7 0 11-2.7-2.7c.3 0 .6 0 .8.1V9.4a5.8 5.8 0 105 5.8V9.1a7.3 7.3 0 004.3 1.4V7.4A4.3 4.3 0 0116.6 3z" /></svg>
  ) },
];

/** Hamburger that morphs into an X. Place it inside the header. */
export function MenuButton({ open, onClick, ink = '#1C1C1C', bg = '#F5EEE7' }) {
  const line = { display: 'block', width: 16, height: 1.5, borderRadius: 2, background: ink, transition: `transform .4s ${EASE}` };
  return (
    <button onClick={onClick} aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'} aria-expanded={open}
      style={{ width: 44, height: 44, borderRadius: '50%', border: 0, background: bg, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'background .3s' }}>
      <span style={{ ...line, transform: open ? 'translateY(3.25px) rotate(45deg)' : 'none' }} />
      <span style={{ ...line, transform: open ? 'translateY(-3.25px) rotate(-45deg)' : 'none' }} />
    </button>
  );
}

/**
 * Floating menu panel.
 * Props:
 *  open, onClose()           – controlled visibility
 *  onNavigate(key)           – called on item tap (menu closes itself)
 *  activeKey                 – current page key
 *  anchorRef                 – ref to the header element; panel opens 10px below it
 *  ctaHref, ctaLabel         – WhatsApp consultation link
 *  zIndex                    – panel z-index; keep the header ABOVE it so the X stays tappable
 */
export function MobileMenu({ open, onClose, onNavigate, activeKey, anchorRef, ctaHref = '#', ctaLabel = 'לתיאום ייעוץ ללא עלות', zIndex = 49, items = NAV, socials = SOCIALS }) {
  const [mounted, setMounted] = useState(open);
  const [top, setTop] = useState(96);
  const panelRef = useRef(null);
  const scrimRef = useRef(null);

  // mount + measure on open
  useEffect(() => {
    if (open) {
      const h = anchorRef?.current;
      if (h) setTop(Math.round(h.getBoundingClientRect().bottom + 10));
      setMounted(true);
    }
  }, [open, anchorRef]);

  // enter animation
  useEffect(() => {
    if (!open || !mounted || reduceMotion()) return;
    panelRef.current?.animate([{ opacity: 0, transform: 'translateY(-10px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: EASE });
    scrimRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
    panelRef.current?.querySelectorAll('[data-mi]').forEach((el, i) =>
      el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 60 + i * 45, easing: EASE, fill: 'backwards' }));
  }, [open, mounted]);

  // exit animation, then unmount
  useEffect(() => {
    if (open || !mounted) return;
    const el = panelRef.current;
    if (!el || reduceMotion()) { setMounted(false); return; }
    scrimRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' });
    const a = el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px) scale(.97)' }], { duration: 240, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
    a.finished.then(() => setMounted(false)).catch(() => setMounted(false));
  }, [open, mounted]);

  // body scroll lock + Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  const go = useCallback(key => { onNavigate?.(key); onClose(); }, [onNavigate, onClose]);
  if (!mounted) return null;

  return (
    <>
      <div ref={scrimRef} onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: zIndex - 4, background: 'rgba(41,37,34,.22)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="תפריט" dir="rtl"
        style={{ position: 'fixed', top, right: 12, left: 12, zIndex, maxHeight: `calc(100svh - ${top}px - 12px)`, overflowY: 'auto', background: '#FFFFFF', borderRadius: 28, boxShadow: '0 24px 60px rgba(41,37,34,.18)', padding: '10px 10px 18px', transformOrigin: 'top left', display: 'flex', flexDirection: 'column', fontFamily: "'Heebo', sans-serif", color: '#1C1C1C' }}>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map(item => item.kids ? (
            <div key={item.key} data-mi="" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 16px 14px' }}>
              <span style={{ fontSize: 20, fontWeight: 300 }}>{item.label}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {item.kids.map(k => {
                  const on = activeKey === k.key;
                  return (
                    <button key={k.key} onClick={() => go(k.key)} aria-current={on ? 'page' : undefined}
                      style={{ height: 44, padding: '0 18px', borderRadius: 999, border: `1px solid ${on ? '#8F6A4B' : 'rgba(28,28,28,.14)'}`, background: on ? '#8F6A4B' : '#FFFFFF', color: on ? '#FFFFFF' : '#1C1C1C', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {k.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <button key={item.key} data-mi="" onClick={() => go(item.key)} aria-current={activeKey === item.key ? 'page' : undefined}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 56, padding: '0 16px', borderRadius: 18, border: 0, background: activeKey === item.key ? '#F7F3EE' : 'transparent', cursor: 'pointer', color: '#1C1C1C', fontSize: 20, fontWeight: 300, fontFamily: 'inherit', textAlign: 'right' }}>
              {item.label}
              <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: activeKey === item.key ? '#8F6A4B' : 'transparent' }} />
            </button>
          ))}
        </nav>
        <div data-mi="" style={{ height: 1, background: 'rgba(28,28,28,.08)', margin: '10px 16px 16px' }} />
        <div data-mi="" style={{ display: 'flex', padding: '0 8px' }}>
          <a href={ctaHref} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, height: 52, padding: '0 20px', borderRadius: 999, background: '#8F6A4B', color: '#FFFFFF', fontSize: 15, fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {ctaLabel}
          </a>
        </div>
        <div data-mi="" style={{ display: 'flex', justifyContent: 'center', gap: 10, paddingTop: 14 }}>
          {socials.map(s => (
            <a key={s.label} href={s.href} aria-label={s.label} title={s.label} target="_blank" rel="noopener noreferrer"
              style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(143,106,75,.35)', background: '#FFFFFF', color: '#7A573C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

/* Usage example
function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  return (
    <>
      <header ref={headerRef} style={{ position: 'fixed', top: 0, insetInline: 0, zIndex: 50, padding: 12 }}>
        <div style={{ height: 64, borderRadius: 999, background: 'rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
          <img src="/logo.svg" alt="SHIR LAVY" height={28} />
          <MenuButton open={open} onClick={() => setOpen(o => !o)} />
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} onNavigate={key => router.push('/' + key)}
        activeKey="home" anchorRef={headerRef} ctaHref="https://wa.me/972500000000" />
    </>
  );
}
*/
