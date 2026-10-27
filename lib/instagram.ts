import { INSTAGRAM_PROFILE_URL } from "./data";

export const BEHOLD_FEED_URL = "https://feeds.behold.so/Qd3shXymtuCpl1JiLagy";

/** Visible tiles on the home Instagram wall (Behold plan returns 6 source posts). */
export const WALL_DISPLAY_COUNT = 6;

/** Post or carousel-child IDs to omit from the home Instagram wall (private / off-brand). */
export const HIDDEN_IG_POSTS: readonly string[] = [
  "18092008202637791",
  "17862179799661158",
  "18111096779003653",
];

const HIDDEN_IG_SET = new Set(HIDDEN_IG_POSTS);

const PREFERRED_MAX_PER_SOURCE = 3;

export type InstagramWallPost = {
  id: string;
  permalink: string;
  imageUrl: string | null;
  slotId?: string;
  aspectRatio: string;
  isVideo: boolean;
};

export type InstagramWallData = {
  handle: string;
  profileUrl: string;
  posts: InstagramWallPost[];
  fromFeed: boolean;
};

type BeholdSize = { width?: number; height?: number; mediaUrl?: string };

type BeholdPost = {
  id: string;
  permalink: string;
  mediaType?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  sizes?: {
    small?: BeholdSize;
    medium?: BeholdSize;
    large?: BeholdSize;
    full?: BeholdSize;
  };
  children?: BeholdPost[];
};

type BeholdFeed = {
  username?: string;
  posts?: BeholdPost[];
};

const ASPECTS = ["4/5", "1/1", "3/4", "4/5", "1/1", "3/4"] as const;

function isHidden(id: string): boolean {
  return HIDDEN_IG_SET.has(id);
}

function fallbackSlotId(i: number): string {
  if (i < 6) return `home-ig-${i + 1}`;
  return `home-wall-${((i - 6) % 5) + 1}`;
}

function sourcePostId(tile: InstagramWallPost): string {
  const dash = tile.id.indexOf("-");
  return dash > 0 ? tile.id.slice(0, dash) : tile.id;
}

function aspectFromSizes(sizes?: BeholdPost["sizes"]): string | null {
  const s = sizes?.medium || sizes?.large;
  if (s?.width && s?.height && s.width > 0) {
    return `${s.width}/${s.height}`;
  }
  return null;
}

function tileImageUrl(post: BeholdPost): string | null {
  const sizes = post.sizes;
  const medium = sizes?.medium?.mediaUrl;
  const large = sizes?.large?.mediaUrl;

  if (post.mediaType === "VIDEO") {
    return post.thumbnailUrl || medium || large || post.mediaUrl || null;
  }

  return large || medium || post.mediaUrl || null;
}

function toWallPost(post: BeholdPost, index: number): InstagramWallPost {
  return {
    id: post.id,
    permalink: post.permalink,
    imageUrl: tileImageUrl(post),
    aspectRatio: aspectFromSizes(post.sizes) || ASPECTS[index % ASPECTS.length],
    isVideo: post.mediaType === "VIDEO",
  };
}

function carouselChildToWallPost(child: BeholdPost, parent: BeholdPost, index: number): InstagramWallPost {
  return {
    id: `${parent.id}-${child.id}`,
    permalink: parent.permalink,
    imageUrl: tileImageUrl(child),
    aspectRatio: aspectFromSizes(child.sizes) || ASPECTS[index % ASPECTS.length],
    isVideo: child.mediaType === "VIDEO",
  };
}

function expandFeedPosts(raw: BeholdPost[]): InstagramWallPost[] {
  const tiles: InstagramWallPost[] = [];

  raw.forEach((post, postIndex) => {
    if (isHidden(post.id)) return;

    if (post.mediaType === "CAROUSEL_ALBUM" && post.children?.length) {
      post.children.forEach((child) => {
        if (isHidden(child.id)) return;
        const tile = carouselChildToWallPost(child, post, tiles.length);
        if (tile.imageUrl) tiles.push(tile);
      });
      return;
    }

    const tile = toWallPost(post, postIndex);
    if (tile.imageUrl || post.mediaType) tiles.push(tile);
  });

  return tiles;
}

/**
 * Pick six distinct tiles: cover (first child) first per source, round-robin across sources,
 * prefer ≤3 slides from the same carousel before drawing extras from the same album.
 */
export function selectWallTiles(expanded: InstagramWallPost[], limit = WALL_DISPLAY_COUNT): InstagramWallPost[] {
  const groups = new Map<string, InstagramWallPost[]>();
  const sourceOrder: string[] = [];

  for (const tile of expanded) {
    const src = sourcePostId(tile);
    if (!groups.has(src)) {
      groups.set(src, []);
      sourceOrder.push(src);
    }
    groups.get(src)!.push(tile);
  }

  const picked: InstagramWallPost[] = [];
  const cursor = new Map<string, number>();

  const takeNext = (src: string, maxFromSource: number): boolean => {
    const idx = cursor.get(src) ?? 0;
    const group = groups.get(src);
    if (!group || idx >= group.length || idx >= maxFromSource) return false;
    picked.push(group[idx]);
    cursor.set(src, idx + 1);
    return true;
  };

  while (picked.length < limit) {
    let added = false;
    for (const src of sourceOrder) {
      if (picked.length >= limit) break;
      if (takeNext(src, PREFERRED_MAX_PER_SOURCE)) added = true;
    }
    if (added) continue;

    for (const src of sourceOrder) {
      if (picked.length >= limit) break;
      if (takeNext(src, Number.POSITIVE_INFINITY)) added = true;
    }
    if (!added) break;
  }

  return picked.slice(0, limit);
}

function padWallTiles(tiles: InstagramWallPost[]): InstagramWallPost[] {
  if (tiles.length >= WALL_DISPLAY_COUNT) return tiles.slice(0, WALL_DISPLAY_COUNT);
  const fallback = fallbackInstagramWall().posts;
  const out = [...tiles];
  for (let i = tiles.length; i < WALL_DISPLAY_COUNT; i++) {
    out.push({ ...fallback[i], id: `fallback-pad-${i}` });
  }
  return out;
}

export function fallbackInstagramWall(): InstagramWallData {
  return {
    handle: "@shir_aesthetics",
    profileUrl: INSTAGRAM_PROFILE_URL,
    fromFeed: false,
    posts: Array.from({ length: WALL_DISPLAY_COUNT }, (_, i) => ({
      id: `fallback-${i}`,
      permalink: INSTAGRAM_PROFILE_URL,
      imageUrl: null,
      slotId: fallbackSlotId(i),
      aspectRatio: ASPECTS[i % ASPECTS.length],
      isVideo: false,
    })),
  };
}

export async function getInstagramWallData(): Promise<InstagramWallData> {
  try {
    const res = await fetch(BEHOLD_FEED_URL, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Behold feed HTTP ${res.status}`);
    const data = (await res.json()) as BeholdFeed;
    const raw = data.posts ?? [];
    if (!raw.length) return fallbackInstagramWall();

    const expanded = expandFeedPosts(raw);
    const posts = padWallTiles(selectWallTiles(expanded));
    if (!posts.length) return fallbackInstagramWall();

    const handle = data.username ? `@${data.username.replace(/^@/, "")}` : "@shir_aesthetics";

    return {
      handle,
      profileUrl: INSTAGRAM_PROFILE_URL,
      fromFeed: true,
      posts,
    };
  } catch {
    return fallbackInstagramWall();
  }
}
