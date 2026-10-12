import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  cacheComponents: true,
  partialPrefetching: true,

  async rewrites() {
    return [
      {
        source: "/tentang",
        destination: "/",
      },
      {
        source: "/tujuan",
        destination: "/",
      },
      {
        source: "/untuk-siapa",
        destination: "/",
      },
      {
        source: "/manfaat",
        destination: "/",
      },
      {
        source: "/pengelola",
        destination: "/",
      },
    ];
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;