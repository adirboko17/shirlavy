import type { Metadata } from "next";
import { HomePage } from "@/components/home";
import { getInstagramWallData } from "@/lib/instagram";

export const metadata: Metadata = { title: "SHIR LAVY - Aesthetics & Academy" };

export default async function Page() {
  const instagram = await getInstagramWallData();
  return <>
    <link rel="preload" as="video" href="/assets/hero-video.mp4" type="video/mp4" media="(max-width: 759px)" />
    <link rel="preload" as="video" href="/assets/hero-video-desktop.mp4" type="video/mp4" media="(min-width: 760px)" />
    <HomePage instagram={instagram} />
  </>;
}
