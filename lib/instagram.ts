import { INSTAGRAM_PROFILE_URL } from "./data";

export const BEHOLD_FEED_URL = "https://feeds.behold.so/Qd3shXymtuCpl1JiLagy";

export type InstagramWallPost = {
  id: string;
  permalink: string;
  imageUrl: string | null;
  slotId?: string;
  aspectRatio: string;
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

const ASPECTS = ["4/5", "1/1", "3/4", "4/5", "1/1"] as const;

const FALLBACK_SLOTS = Array.from({ length: 9 }, (_, i) => ({
  slotId: i < 6 ? `home-ig-${i + 1}` : `home-wall-${i + 1}`,
  aspectRatio: ASPECTS[i % ASPECTS.length],
}));

function aspectFromSizes(sizes?: BeholdPost["sizes"]): string | null {
  const s = sizes?.medium || sizes?.large;
  if (s?.width && s?.height && s.width > 0) {
    return `${s.width}/${s.height}`;
  }
  return null;
}

function displayUrl(post: BeholdPost): string | null {
  const sizes = post.sizes;
  const medium = sizes?.medium?.mediaUrl;
  const large = sizes?.large?.mediaUrl;

  if (post.mediaType === "VIDEO") {
    return post.thumbnailUrl || medium || large || null;
  }

  const fromSizes = large || medium;
  if (fromSizes) return fromSizes;

  if (post.mediaType === "CAROUSEL_ALBUM" && post.children?.length) {
    const child = post.children[0];
    return displayUrl(child) || post.mediaUrl || null;
  }

  return post.mediaUrl || null;
}

function toWallPost(post: BeholdPost, index: number): InstagramWallPost {
  return {
    id: post.id,
    permalink: post.permalink,
    imageUrl: displayUrl(post),
    aspectRatio: aspectFromSizes(post.sizes) || ASPECTS[index % ASPECTS.length],
  };
}

export function fallbackInstagramWall(): InstagramWallData {
  return {
    handle: "@shir_aesthetics",
    profileUrl: INSTAGRAM_PROFILE_URL,
    fromFeed: false,
    posts: FALLBACK_SLOTS.map((f, i) => ({
      id: `fallback-${i}`,
      permalink: INSTAGRAM_PROFILE_URL,
      imageUrl: null,
      slotId: f.slotId,
      aspectRatio: f.aspectRatio,
    })),
  };
}

export async function getInstagramWallData(limit = 9): Promise<InstagramWallData> {
  try {
    const res = await fetch(BEHOLD_FEED_URL, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Behold feed HTTP ${res.status}`);
    const data = (await res.json()) as BeholdFeed;
    const raw = data.posts?.slice(0, limit) ?? [];
    if (!raw.length) return fallbackInstagramWall();

    const handle = data.username ? `@${data.username.replace(/^@/, "")}` : "@shir_aesthetics";
    const posts = raw.map(toWallPost);

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
