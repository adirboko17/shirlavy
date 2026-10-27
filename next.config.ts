import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "behold.pictures", pathname: "/**" },
      { protocol: "https", hostname: "cdn2.behold.pictures", pathname: "/**" },
      { protocol: "https", hostname: "*.cdninstagram.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
