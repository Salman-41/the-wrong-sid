import localFont from "next/font/local";

export const displayFont = localFont({
  src: "../../public/fonts/gfs-didot-latin.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "400",
  fallback: ["Didot", "Times New Roman", "serif"],
});
export const uiFont = localFont({
  src: "../../public/fonts/arimo-latin.woff2",
  variable: "--font-ui",
  display: "swap",
  weight: "400 700",
  fallback: ["Arial", "sans-serif"],
});
export const captionFont = localFont({
  src: "../../public/fonts/cousine-latin.woff2",
  variable: "--font-caption",
  display: "swap",
  weight: "400",
  preload: false,
  fallback: ["Courier New", "monospace"],
});
