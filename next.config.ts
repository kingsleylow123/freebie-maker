import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/portfolio",
        destination: "https://claude-malaysia-portfolio.vercel.app/index.html",
      },
      {
        source: "/portfolio/:path*",
        destination: "https://claude-malaysia-portfolio.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;
