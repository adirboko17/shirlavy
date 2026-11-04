import type { InstagramWallPost } from "@/lib/instagram";
import { InstagramPostTile } from "./instagram-post-tile";

const AREAS = ["promo", "portrait", "archive", "small-a", "small-b", "folder"] as const;

export function InstagramWall({ posts }: { posts: InstagramWallPost[] }) {
  const tiles = posts.slice(0, AREAS.length);

  return (
    <div className="ig-bento" aria-label="פוסטים מהאינסטגרם">
      {tiles.map((post, i) => (
        <div key={post.id} className="ig-bento__cell" style={{ gridArea: AREAS[i] }}>
          <InstagramPostTile post={post} fill />
        </div>
      ))}
    </div>
  );
}
