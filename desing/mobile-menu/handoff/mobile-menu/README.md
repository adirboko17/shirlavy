# SHIR LAVY — Mobile menu

`MobileMenu.jsx` — React component, no dependencies.

## Behavior
- Floating rounded panel opens 10px under the header (measured from `anchorRef`), not full screen.
- Blurred scrim behind; tap scrim or press Escape to close. Body scroll locked while open.
- Hamburger (`MenuButton`) morphs into X; same button toggles.
- Enter: panel fades + scales from .96 (480ms), items stagger up (45ms steps). Exit: 240ms fade/scale, then unmount.
- `prefers-reduced-motion`: no animation.
- Groups with `kids` (טיפולים) render as pill buttons; active pill = brown fill. Active main row = #F7F3EE bg + brown dot.

## Integration notes
- Keep the header z-index ABOVE the panel (header 50, panel 49, scrim 45) so the X stays visible and tappable.
- If the header moves (e.g. promo bar above it), the panel re-measures its position on each open.
- Replace `NAV` keys with your routes, `SOCIALS[].href` with real profile URLs, `ctaHref` with the WhatsApp link.
- Font: Heebo (300/400/500) from Google Fonts.

## Tokens
- Brand brown `#8F6A4B` · Text brown `#7A573C` · Ink `#1C1C1C` · Active row `#F7F3EE` · Icon button bg `#F5EEE7`
- Radius: panel 28px, rows 18px, pills 999px · Touch targets ≥ 44px
