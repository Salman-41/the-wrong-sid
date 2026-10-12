export const experiences = [
  { href: "/", name: "Entrance", status: "available" },
  { href: "/loom", name: "Loom", status: "available" },
  { href: "/reverse", name: "Reverse", status: "available" },
  { href: "/pattern-room", name: "Pattern Room", status: "planned" },
  { href: "/collection", name: "Collection", status: "planned" },
  { href: "/edition", name: "Edition", status: "planned" },
] as const;

export const primaryNavigation = [
  { href: "/loom", label: "Make" },
  { href: "/reverse", label: "Inspect" },
  { href: "/collection", label: "Collection" },
  { href: "/edition", label: "Edition" },
] as const;
