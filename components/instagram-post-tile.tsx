"use client";

import type { InstagramWallPost } from "@/lib/instagram";
import { Slot } from "./ui";

export function InstagramPostTile({ post }: { post: InstagramWallPost }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="פוסט באינסטגרם"
      style={{
        position: "relative",
        display: "block",
        borderRadius: 16,
        overflow: "hidden",
        background: "#F2EBE4",
        color: "#999",
        aspectRatio: post.aspectRatio,
      }}
    >
      {post.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : post.slotId ? (
        <Slot id={post.slotId} placeholder="פוסט" />
      ) : (
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>פוסט</span>
      )}
    </a>
  );
}
