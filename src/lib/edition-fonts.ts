let ready: Promise<void> | undefined;
export function loadEditionFonts(fonts: FontFaceSet = document.fonts): Promise<void> {
  ready ??= Promise.all([
    ["EditionDisplay", "/fonts/gfs-didot-latin.woff2"],
    ["EditionUI", "/fonts/arimo-latin.woff2"],
    ["EditionCaption", "/fonts/cousine-latin.woff2"],
  ].map(async ([family, url]) => {
    const font = await new FontFace(family, "url(" + url + ")").load();
    fonts.add(font);
  })).then(() => undefined).catch((error) => { ready = undefined; throw error; });
  return ready;
}
