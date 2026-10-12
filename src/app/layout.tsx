import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { TextileProjectProvider } from "@/components/textile-project";
import { displayFont, uiFont, captionFont } from "@/lib/fonts";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "THE WRONG SIDE — Turn it over.",
    template: "%s — THE WRONG SIDE",
  },
  description:
    "An interactive textile exhibition and creative studio. Make a cloth, follow its threads, and look at the other face.",
  applicationName: "THE WRONG SIDE",
  openGraph: {
    title: "THE WRONG SIDE",
    description:
      "Every textile has a visible story and a hidden one. Turn it over.",
    type: "website",
    siteName: "THE WRONG SIDE",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "THE WRONG SIDE",
    description: "An interactive textile exhibition. Turn it over.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${uiFont.variable} ${captionFont.variable}`}
    >
      <body>
        <a className="site-skip-link" href="#main-content">
          Skip to content
        </a>
        <TextileProjectProvider>
          <SiteHeader />
          {children}
        </TextileProjectProvider>
      </body>
    </html>
  );
}
