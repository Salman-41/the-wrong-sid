import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  images: { qualities: [75, 85], formats: ["image/webp"] },
};
export default config;
