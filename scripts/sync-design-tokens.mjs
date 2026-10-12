import { readFileSync, writeFileSync } from "node:fs";
const tokens = JSON.parse(
  readFileSync(
    new URL("../Design/DESIGN-TOKENS.json", import.meta.url),
    "utf8",
  ),
);
const colors = Object.entries(tokens.colors)
  .map(([name, value]) => `  --color-${name}: ${value};`)
  .join("\n");
writeFileSync(
  new URL("../src/styles/tokens.css", import.meta.url),
  `/* Generated from Design/DESIGN-TOKENS.json. Run node scripts/sync-design-tokens.mjs. */\n@theme {\n${colors}\n}\n@theme inline {\n  --font-editorial: var(--font-display);\n  --font-sans: var(--font-ui);\n  --font-mono: var(--font-caption);\n}\n:root {\n  --paper: var(--color-paper);\n  --ink: var(--color-ink);\n  --line: #d4c9ba;\n  --muted: #645a52;\n  --rust: var(--color-vermilion);\n}\n`,
);
