"use client";

import type { InstagramWallPost } from "@/lib/instagram";
import { IgIcon, Slot } from "./ui";

export function InstagramPostTile({ post }: { post: InstagramWallPost }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={post.isVideo ? "סרטון באינסטגרם" : "פוסט באינסטגרם"}
      className="ig-tile"
    >
      <span className="ig-tile__media" style={{ aspectRatio: post.aspectRatio.replace("/", " / ") }}>
        {post.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.imageUrl} alt="" loading="lazy" decoding="async" draggable={false} />
        ) : post.slotId ? (
          <Slot id={post.slotId} placeholder="פוסט" />
        ) : (
          <span className="ig-tile__ph">פוסט</span>
        )}
      </span>
      <span className="ig-tile__overlay" aria-hidden>
        <span className="ig-tile__ig">
          <IgIcon />
        </span>
      </span>
      {post.isVideo ? (
        <span className="ig-tile__play" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        </span>
      ) : null}
    </a>
  );
}
