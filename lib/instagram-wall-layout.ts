import type { InstagramWallPost } from "./instagram";
import { WALL_DISPLAY_COUNT } from "./instagram";

/** Desktop 3×2, mobile 2×3 — fixed for the six-tile wall. */
export function wallColumnCount(mobile: boolean): number {
  return mobile ? 2 : 3;
}

/** Column-major fill: col 0 gets tiles 0,3,6… — two unique tiles per column on desktop. */
export function distributeWallColumns(
  posts: InstagramWallPost[],
  count: number,
): InstagramWallPost[][] {
  const columns: InstagramWallPost[][] = Array.from({ length: count }, () => []);
  posts.forEach((post, index) => {
    columns[index % count].push(post);
  });
  return columns;
}

/** Duplicate each column once; loop reset happens off-screen (half = one full column stack). */
export function loopColumnTrack(col: InstagramWallPost[]): InstagramWallPost[] {
  if (!col.length) return [];
  return [...col, ...col];
}

/** Stagger column phase so motion feels organic. */
export function columnStartOffset(halfHeight: number, colIndex: number, columnCount: number): number {
  if (halfHeight <= 0 || columnCount <= 0) return 0;
  return (halfHeight * colIndex) / columnCount;
}

export function tilesPerColumn(postCount: number, columnCount: number): number {
  if (columnCount <= 0) return 0;
  return Math.ceil(postCount / columnCount);
}

export function isCuratedSixTileWall(postCount: number): boolean {
  return postCount === WALL_DISPLAY_COUNT;
}
