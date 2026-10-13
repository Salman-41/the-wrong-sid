import { parseArtwork } from "@/lib/weave";
import { generateEditionExport } from "@/lib/edition-server";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const length = Number(request.headers.get("content-length") ?? 0);
    if (length > 150_000) return Response.json({ error: "The artwork file is too large." }, { status: 413 });
    const body = await request.text();
    if (body.length > 150_000) return Response.json({ error: "The artwork file is too large." }, { status: 413 });
    const value = JSON.parse(body);
    if (!value || (value.format !== "png" && value.format !== "svg")) throw new Error("Choose a supported export format.");
    const artwork = parseArtwork(JSON.stringify(value.artwork));
    const result = generateEditionExport(artwork, value.format);
    return new Response(new Uint8Array(result.bytes), {
      headers: {
        "Content-Type": value.format === "png" ? "image/png" : "image/svg+xml",
        "Content-Disposition": 'attachment; filename="the-wrong-side-' + artwork.edition.layout + '.' + value.format + '"',
        "Cache-Control": "no-store",
        "X-Edition-Width": String(result.width), "X-Edition-Height": String(result.height),
      },
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The edition could not be created." }, { status: 400 });
  }
}
