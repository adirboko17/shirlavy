import type { InstagramWallPost } from "@/lib/instagram";
import { InstagramPostTile } from "./instagram-post-tile";
import { ResponsiveCarousel } from "./responsive-carousel";

export function InstagramWall({ posts }: { posts: InstagramWallPost[] }) {
  const tiles = posts.slice(0, 6);

  return (
    <div className="ig-reels" aria-label="רילס מהאינסטגרם">
      <ResponsiveCarousel
        ariaLabel="רילס מהאינסטגרם"
        slideWidth="min(72vw, 280px)"
        gap="12px"
        desktopStyle={{ display: "contents" }}
      >
        {tiles.map((post) => (
          <InstagramPostTile key={post.id} post={post} reel />
        ))}
      </ResponsiveCarousel>
    </div>
  );
}
