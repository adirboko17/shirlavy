import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow an isolated preview build alongside an existing development server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "behold.pictures", pathname: "/**" },
      { protocol: "https", hostname: "cdn2.behold.pictures", pathname: "/**" },
      { protocol: "https", hostname: "*.cdninstagram.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
