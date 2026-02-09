import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return [
      {
        source: "/s3-proxy/:path*",
        destination:
          "https://blaybus-runtime-bucket.s3.ap-northeast-2.amazonaws.com/:path*",
      },
    ];
  },
};

export default nextConfig;
