import type { SVGProps } from "react";

export function CommerceIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: "bag" | "arrow" | "search" | "close" | "spark" | "delivery" }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {name === "bag" ? <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></> : null}
    {name === "arrow" ? <path d="M20 12H4M10 6l-6 6 6 6" /> : null}
    {name === "search" ? <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></> : null}
    {name === "close" ? <path d="m6 6 12 12M18 6 6 18" /> : null}
    {name === "spark" ? <path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2Z" /> : null}
    {name === "delivery" ? <><path d="M3 5h11v12H3V5Zm11 5h4l3 4v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></> : null}
  </svg>;
}
