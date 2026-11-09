// Share the lock between the menu and cart, including the cart's exit animation.
let locks = 0;
let release: (() => void) | undefined;
let lockedY: number | undefined;

export function pageScrollY() {
  return lockedY ?? window.scrollY;
}

export function lockPageScroll() {
  if (locks === 0) {
    const body = document.body;
    const root = document.documentElement;
    const y = window.scrollY;
    const x = window.scrollX;
    const path = window.location.pathname;
    const mobile = window.matchMedia("(max-width: 759px)").matches;
    const previous = { overflow: body.style.overflow, position: body.style.position, top: body.style.top, left: body.style.left, width: body.style.width };
    const rootOverflow = root.style.overflow;
    lockedY = y;
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (mobile) {
      body.style.position = "fixed";
      body.style.top = `${-y}px`;
      body.style.left = `${-x}px`;
      body.style.width = "100%";
    }
    release = () => {
      Object.assign(body.style, previous);
      root.style.overflow = rootOverflow;
      lockedY = undefined;
      if (mobile && window.location.pathname === path) window.scrollTo({ top: y, left: x, behavior: "instant" });
    };
  }
  locks += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) { release?.(); release = undefined; }
  };
}
