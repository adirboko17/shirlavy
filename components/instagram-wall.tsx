"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { InstagramWallPost } from "@/lib/instagram";
import { useSite } from "@/lib/site";
import { InstagramPostTile } from "./instagram-post-tile";
import { ResponsiveCarousel } from "./ui";

/** px per frame at ~60fps — slightly different per column */
const SPEEDS = [0.34, 0.44, 0.38, 0.48] as const;

function distributeColumns(posts: InstagramWallPost[], count: number): InstagramWallPost[][] {
  const columns: InstagramWallPost[][] = Array.from({ length: count }, () => []);
  posts.forEach((post, i) => columns[i % count].push(post));
  return columns;
}

/** Duplicate column items so the track can loop seamlessly (two identical halves). */
function loopItems(col: InstagramWallPost[]): InstagramWallPost[] {
  if (!col.length) return [];
  let base = [...col];
  while (base.length < 4) base = [...base, ...col];
  return [...base, ...base];
}

export function InstagramWall({ posts }: { posts: InstagramWallPost[] }) {
  const { width } = useSite();
  const columnCount = (width || 1200) < 760 ? 2 : 4;
  const [reduced, setReduced] = useState(false);
  const [pausedUi, setPausedUi] = useState(false);
  const pausedRef = useRef(false);
  const halfHeightsRef = useRef<number[]>([]);
  const offsetsRef = useRef<number[]>([]);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  const columns = useMemo(() => distributeColumns(posts, columnCount), [posts, columnCount]);
  const looped = useMemo(() => columns.map(loopItems), [columns]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const measure = useCallback(() => {
    halfHeightsRef.current = trackRefs.current.map((el) => (el ? el.offsetHeight / 2 : 0));
    offsetsRef.current = trackRefs.current.map((_, i) => offsetsRef.current[i] ?? 0);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    trackRefs.current.forEach((el) => {
      if (el) ro.observe(el);
    });
    return () => ro.disconnect();
  }, [measure, looped, columnCount]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const tick = () => {
      if (!pausedRef.current) {
        trackRefs.current.forEach((el, i) => {
          const half = halfHeightsRef.current[i] ?? 0;
          if (!el || half <= 0) return;
          const speed = SPEEDS[i % SPEEDS.length];
          const up = i % 2 === 0;
          let o = (offsetsRef.current[i] ?? 0) + speed;
          if (o >= half) o -= half;
          offsetsRef.current[i] = o;
          const y = up ? -o : o - half;
          el.style.transform = `translate3d(0, ${y}px, 0)`;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, columnCount, looped]);

  const pause = useCallback(() => {
    pausedRef.current = true;
    setPausedUi(true);
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
    setPausedUi(false);
  }, []);

  if (reduced) {
    return (
      <ResponsiveCarousel ariaLabel="פוסטים מהאינסטגרם" slideWidth="min(70vw, 280px)" gap="clamp(8px, 1vw, 14px)">
        {posts.map((post) => (
          <InstagramPostTile key={post.id} post={post} />
        ))}
      </ResponsiveCarousel>
    );
  }

  return (
    <div
      className={`ig-wall${pausedUi ? " is-paused" : ""}`}
      data-cols={columnCount}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onTouchCancel={resume}
    >
      {looped.map((colPosts, colIndex) => (
        <div key={colIndex} className="ig-wall__col" data-col={colIndex}>
          <div
            ref={(el) => {
              trackRefs.current[colIndex] = el;
            }}
            className="ig-wall__track"
          >
            {colPosts.map((post, i) => (
              <InstagramPostTile key={`${post.id}-${i}`} post={post} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
