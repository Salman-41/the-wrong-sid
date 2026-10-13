import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["@napi-rs/canvas"],
  images: { qualities: [75, 85], formats: ["image/webp"] },
};
export default config;
