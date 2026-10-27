"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useSite } from "@/lib/site";

type Props = {
  children: ReactNode;
  desktopStyle?: CSSProperties;
  slideWidth?: string;
  gap?: string;
  ariaLabel?: string;
  /** Force carousel even on desktop (default: mobile only). */
  forceCarousel?: boolean;
};

export function ResponsiveCarousel({
  children,
  desktopStyle,
  slideWidth = "min(88vw, 360px)",
  gap = "clamp(12px, 1.6vw, 20px)",
  ariaLabel,
  forceCarousel = false,
}: Props) {
  const { mobile } = useSite();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const items = Children.toArray(children);
  const count = items.length;
  const carousel = (forceCarousel || mobile) && count > 1;

  const updateActive = useCallback(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;
    const slides = track.querySelectorAll<HTMLElement>("[data-carousel-slide]");
    if (!slides.length) return;
    const trackRect = track.getBoundingClientRect();
    const mid = trackRect.left + trackRect.width / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const r = slide.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, [count]);

  useEffect(() => {
    if (!carousel) return;
    const track = trackRef.current;
    if (!track) return;
    updateActive();
    track.addEventListener("scroll", updateActive, { passive: true });
    return () => track.removeEventListener("scroll", updateActive);
  }, [carousel, updateActive, count]);

  if (!carousel) {
    return <div style={desktopStyle}>{children}</div>;
  }

  return (
    <div className="resp-carousel">
      <div
        ref={trackRef}
        className="resp-carousel__track"
        style={{ gap }}
        role="region"
        aria-label={ariaLabel}
      >
        {items.map((child, i) => (
          <div
            key={i}
            data-carousel-slide
            className="resp-carousel__slide"
            style={{ flex: `0 0 ${slideWidth}` }}
          >
            {child}
          </div>
        ))}
      </div>
      <div className="resp-carousel__dots" role="tablist" aria-label={ariaLabel ? `${ariaLabel} — ניווט` : "ניווט שקפים"}>
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`שקף ${i + 1} מתוך ${count}`}
            className={`resp-carousel__dot${i === active ? " is-active" : ""}`}
            onClick={() => {
              const track = trackRef.current;
              const slide = track?.querySelectorAll("[data-carousel-slide]")[i] as
                | HTMLElement
                | undefined;
              slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
            }}
          />
        ))}
      </div>
    </div>
  );
}
