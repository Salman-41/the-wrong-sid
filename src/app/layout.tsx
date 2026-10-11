import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "The Wrong Side — A cloth of your own",
  description:
    "A textile study. Choose your yarns, examine the crossings, and turn the cloth over.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
