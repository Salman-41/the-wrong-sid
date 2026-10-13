export const experiences = [
  { href: "/", name: "Entrance", status: "available" },
  { href: "/loom", name: "Loom", status: "available" },
  { href: "/reverse", name: "Reverse", status: "available" },
  { href: "/pattern-room", name: "Pattern Room", status: "available" },
  { href: "/collection", name: "Collection", status: "available" },
  { href: "/edition", name: "Edition", status: "available" },
] as const;

export const primaryNavigation = [
  { href: "/loom", label: "Make" },
  { href: "/reverse", label: "Inspect" },
  { href: "/pattern-room", label: "Pattern Room" },
  { href: "/collection", label: "Collection" },
  { href: "/edition", label: "Edition" },
] as const;
