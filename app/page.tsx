import type { Metadata } from "next";
import { HomePage } from "@/components/home";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/data";
import { getInstagramWallData } from "@/lib/instagram";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | איפור קבוע ואקדמיה` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} | איפור קבוע ואקדמיה`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
};

export default async function Page() {
  const instagram = await getInstagramWallData();
  return <>
    <link rel="preload" as="video" href="/assets/hero-video.mp4" type="video/mp4" media="(max-width: 759px)" />
    <link rel="preload" as="video" href="/assets/hero-video-desktop.mp4" type="video/mp4" media="(min-width: 760px)" />
    <HomePage instagram={instagram} />
  </>;
}
