import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/PipeFit",
  assetPrefix: "/PipeFit/",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
