import type { InstagramWallPost } from "@/lib/instagram";
import { InstagramPostTile } from "./instagram-post-tile";

export function InstagramWall({ posts }: { posts: InstagramWallPost[] }) {
  const tiles = posts.slice(0, 6);

  return (
    <div className="ig-reels" aria-label="רילס מהאינסטגרם">
      {tiles.map((post) => (
        <InstagramPostTile key={post.id} post={post} reel />
      ))}
    </div>
  );
}
