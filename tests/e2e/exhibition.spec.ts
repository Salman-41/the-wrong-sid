import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { HISTORICAL_TEXTILES } from "../../src/lib/collection-data";
import { parseArtwork, type Artwork } from "../../src/lib/weave";

async function go(page: Page, name: string) {
  await page.getByLabel("Explore the exhibition").click();
  await page.getByRole("navigation", { name: "All experiences" }).getByRole("link", { name, exact: true }).click();
}
async function save(page: Page, name: string, info: TestInfo): Promise<Artwork> {
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name, exact: false }).click();
  const download = await pending, path = info.outputPath(name.replaceAll(" ", "-") + ".json");
  await download.saveAs(path);
  return parseArtwork(await readFile(path, "utf8"));
}
async function panel(page: Page, label: string) {
  const button = page.locator(".pattern-mobile-tabs").getByRole("button", { name: label, exact: true });
  if (await button.isVisible() && await button.getAttribute("aria-expanded") !== "true") await button.click();
}
function material(art: Artwork) { return { warp: art.warp, weft: art.weft, pickStructures: art.pickStructures }; }

// One visitor story verifies construction, presentation and export across client navigation.
test("make, reweave, reverse, arrange, collect and export the same visitor textile", async ({ page, isMobile }, info) => {
  test.setTimeout(120_000);
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  await page.goto("/"); await page.getByRole("link", { name: "Lift the edge", exact: false }).first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.entrance-cloth-study canvas')).toHaveAttribute('data-rows', '28');
  await page.getByRole('link', { name: 'Explore the Reverse' }).click();
  await expect(page).toHaveURL(/\/reverse$/); await go(page, "Loom");
  await page.locator(".loom-material.is-ready").waitFor();
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByLabel("Rows woven")).toHaveText("0");
  if (isMobile) await page.locator(".loom-mobile-warp summary").click();
  await page.getByRole("button", { name: "Warp accent: Moss", exact: true }).click();
  const rules=["Plain weave","2/2 twill","5-end satin","5-end sateen"];
  const colors=["Cotton","Indigo","Vermilion","Saffron","Moss","Lilac"];
  for(let i=0;i<6;i++) {
    await page.getByRole("button", { name: rules[i%4], exact: true }).click();
    await page.getByRole("button", { name: "Next weft: "+colors[i], exact: true }).click();
    await page.getByRole("button", { name: "Add a woven row", exact: true }).click();
    await expect(page.getByLabel("Rows woven")).toHaveText(String(i+1));
    await expect(page.getByRole("button", { name: "Add a woven row", exact: true })).toBeEnabled();
  }
  await page.locator(".loom-frame").focus(); await page.keyboard.press("Enter");
  await expect(page.getByLabel("Rows woven")).toHaveText("7");
  await expect(page.getByRole("button", { name: "Add a woven row", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.getByLabel("Rows woven")).toHaveText("6");
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  await expect(page.getByLabel("Rows woven")).toHaveText("7");
  const woven = await save(page,"Save cloth",info); expect(woven.pickStructures).toEqual(["plain","twill-2-2","satin-5","sateen-5","plain","twill-2-2","twill-2-2"]);
  await page.getByRole("button", { name: "Reset", exact: true }).click(); await page.getByRole("button", { name: "Undo", exact: true }).click();
  expect(material(await save(page,"Save cloth",info))).toEqual(material(woven));
  await page.getByLabel("Restore artwork file").setInputFiles({ name:"bad.json",mimeType:"application/json",buffer:Buffer.from('{"version":2}') });
  await expect(page.locator(".loom-notice")).toContainText("Unrecognized artwork");
  expect(material(await save(page,"Save cloth",info))).toEqual(material(woven));

  await go(page,"Reverse"); await page.locator(".reverse-surface.is-ready").waitFor();
  await page.locator(".reverse-edge-cue").click(); await expect(page.locator(".reverse-moving-cloth")).toHaveAttribute("data-progress","0.3800");
  await page.locator(".reverse-edge-cue").click(); await expect(page.locator(".reverse-moving-cloth")).toHaveAttribute("data-progress","1.0000");
  await expect(page.locator(".reverse-moving-cloth")).toHaveAttribute("data-rows","7");
  await page.getByRole("button", { name:"Inspect this crossing" }).click();
  await page.locator(".reverse-lens-surface canvas.is-ready").waitFor();
  await page.getByRole("button", { name:"Crossing to the right" }).click();
  await page.getByRole("button", { name:"Front",exact:true }).last().click();
  await page.getByRole("button", { name:"Reverse",exact:true }).last().click();
  await page.locator("#reverse-zoom").press("ArrowRight"); await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await go(page,"Pattern Room"); await page.locator(".pattern-art-layer canvas.is-ready").first().waitFor();
  await panel(page,"Structure");
  for(const rule of ["Plain","2/2 twill","Satin","Sateen"]) await page.getByRole("button", { name:rule,exact:true }).click();
  const reweaved = await save(page,"Save this pattern",info);
  expect(reweaved.pickStructures.every(p=>p==="sateen-5")).toBeTruthy(); expect(reweaved.weft).toEqual(woven.weft);
  await panel(page,"Colour"); await page.getByRole("button",{name:"Warp",exact:true}).click();
  await page.getByRole("button",{name:"Select moss warp yarns to recolor",exact:true}).click();
  await page.getByRole("button",{name:"Replace selected warp yarns with Lilac",exact:true}).click();
  await panel(page,"Repeat");
  for(const composition of ["Cutwork","Ribbon","Bias"]) await page.getByRole("button",{name:composition,exact:true}).click();
  for(let repeat=1;repeat<=4;repeat++) await page.getByRole("button",{name:`${repeat} by ${repeat} repeat`,exact:true}).click();
  await page.locator("#pattern-scale").focus(); await page.keyboard.press("End"); await page.keyboard.press("Tab");
  const arranged=await save(page,"Save this pattern",info);
  expect(arranged.arrangement).toEqual({composition:"bias",repeat:4,scale:1.75});
  expect(arranged.warp.some(t=>t.color==="#BAA7CF")).toBeTruthy(); expect(arranged.weft).toEqual(woven.weft);
  await page.getByRole("button",{name:"Compare",exact:true}).click(); await expect(page.locator(".pattern-compare-view")).toBeVisible();
  await page.getByLabel("Reveal the previous and current artwork").press("ArrowLeft");
  await page.getByRole("button",{name:"Close comparison",exact:true}).click();
  await page.getByRole("button",{name:"Undo",exact:true}).click(); await page.getByRole("button",{name:"Redo",exact:true}).click();
  expect(await save(page,"Save this pattern",info)).toEqual(arranged);

  await go(page,"Collection"); await page.getByRole("link",{name:"Read Piece of Cloth for Bedding",exact:true}).click();
  await expect(page.locator("h1")).toHaveText("Piece of Cloth for Bedding");
  await go(page,"Edition"); await page.locator(".edition-canvas.is-ready").waitFor();
  expect(material(await save(page,"Save project",info))).toEqual(material(arranged));
  for(const layout of ["Full bleed","Material study","Graphic edition"]) await page.getByRole("radio",{name:layout,exact:true}).check();
  for(const format of ["portrait","square","landscape"]) await page.getByLabel("Edition format").selectOption(format);
  for(const background of ["Warm ivory","Deep plum","Vermilion"]) await page.getByRole("button",{name:background,exact:true}).click();
  await page.getByLabel("Cloth face",{exact:true}).selectOption("reverse");
  await page.locator(".edition-refinements summary").click();
  await page.getByLabel("Optional title").fill("Woven memory"); await page.getByLabel("Personal credit").fill("QA visitor");
  for(const crop of ["Balanced","Close","Off-center"]) await page.getByRole("button",{name:crop,exact:true}).click();
  await page.getByLabel("Across the warp").press("End"); await page.getByLabel("Along the weft").press("Home");
  const finished=await save(page,"Save project",info);
  expect(material(finished)).toEqual(material(arranged)); expect(finished.edition.title).toBe("Woven memory");
  await page.reload(); await page.getByLabel("Open textile project file").setInputFiles({name:"project.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(finished))});
  expect(await save(page,"Save project",info)).toEqual(finished);
  await expect(page.getByRole("button",{name:"Export your edition",exact:true})).toBeEnabled();
  const pngPending=page.waitForEvent("download"); await page.getByRole("button",{name:"Export your edition",exact:true}).click();
  const png=await pngPending,path=info.outputPath("visitor-edition.png"); await png.saveAs(path); const bytes=await readFile(path);
  expect(bytes.readUInt32BE(16)).toBe(3200); expect(bytes.readUInt32BE(20)).toBe(2400); expect(bytes.length).toBeGreaterThan(100_000);
  if(!isMobile){
    await page.getByLabel("Export file format").selectOption("svg"); const svgPending=page.waitForEvent("download");
    await page.getByRole("button",{name:"Export your edition",exact:true}).click();
    const svg=await svgPending,svgPath=info.outputPath("visitor-edition.svg");await svg.saveAs(svgPath);const content=await readFile(svgPath,"utf8");
    expect(content).toContain('width="3200"'); expect(content).toContain('height="2400"');expect(content).toContain('data:image/png;base64,');
    expect(content).not.toMatch(/<text[ >]|<foreignObject|Save project|Export your edition|images\/collection/);
  }
  await page.getByRole("link",{name:"Return to editing",exact:false}).click();
  expect(material(await save(page,"Save this pattern",info))).toEqual(material(finished));
  expect(errors).toEqual([]);
});

test("collection records, factual views, facets and native image examination",async({page})=>{
  test.setTimeout(120_000);
  for(const record of HISTORICAL_TEXTILES){
    await page.goto("/collection/"+record.id);
    await expect(page.locator("h1")).toHaveText(record.title);
    await expect(page.locator(".collection-record-details")).toContainText(record.accessionNumber);
    await expect(page.locator(".collection-object-artwork img").first()).toHaveJSProperty("complete",true);
    expect(await page.locator(".collection-object-artwork img").first().evaluate(i=>(i as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(await page.locator("main").getByRole("link").evaluateAll(a=>a.some(n=>n.getAttribute("href")?.includes("metmuseum.org")||n.getAttribute("href")?.includes("clevelandart.org")||n.getAttribute("href")?.includes("si.edu")||n.getAttribute("href")?.includes("cooperhewitt.org")))).toBeTruthy();
  }
  await page.goto("/collection/cma-1992-103");await page.getByRole("button",{name:"Look closer",exact:false}).click();
  await expect(page.getByRole("dialog")).toBeVisible();await page.getByRole("button",{name:"Native detail",exact:true}).click();
  await page.getByRole("button",{name:"Move photograph view right",exact:true}).click();await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();await expect(page.getByRole("button",{name:"Look closer",exact:false})).toBeFocused();
  for(const by of ["techniques","materials","places"]){await page.goto("/collection?by="+by);await expect(page.locator(".collection-facets")).toBeVisible();await page.locator(".collection-facets a").nth(1).click();expect(await page.locator(".collection-plates .collection-plate").count()).toBeGreaterThan(0);}
});

test("menu, skip link, missing pages and handled export failures",async({page,request})=>{
  await page.goto("/");await page.keyboard.press("Tab");await expect(page.getByRole("link",{name:"Skip to content"})).toBeFocused();await page.keyboard.press("Enter");await expect(page.locator("main")).toBeFocused();
  await page.getByLabel("Explore the exhibition").focus();await page.keyboard.press("Enter");await expect(page.getByRole("navigation",{name:"All experiences"}).getByRole("link")).toHaveCount(6);await page.keyboard.press("Escape");await expect(page.getByLabel("Explore the exhibition")).toBeFocused();
  expect((await page.goto("/missing-page"))?.status()).toBe(404);await expect(page.locator("h1")).toContainText("isn’t here");
  expect((await page.goto("/collection/missing-object"))?.status()).toBe(404);await expect(page.locator("h1")).toContainText("not in the collection");
  expect((await request.post("/api/edition/export",{data:'not json',headers:{"Content-Type":"application/json"}})).status()).toBe(400);
  expect((await request.post("/api/edition/export",{data:{format:"pdf",artwork:{}}})).status()).toBe(400);
  expect((await request.post("/api/edition/export",{data:"x".repeat(150_001)})).status()).toBe(413);
  await page.goto("/edition");await page.locator(".edition-canvas.is-ready").waitFor();
  await page.route("**/api/edition/export",route=>route.fulfill({status:503,contentType:"application/json",body:JSON.stringify({error:"Export is temporarily unavailable."})}));
  await page.getByRole("button",{name:"Export your edition",exact:true}).click();await expect(page.getByRole("alert")).toHaveText("Export is temporarily unavailable.");await expect(page.getByRole("button",{name:"Export your edition",exact:true})).toBeEnabled();
});

test("CPU fallback keeps live artwork available when workers cannot start",async({page})=>{
  await page.addInitScript(()=>{Object.defineProperty(window,"Worker",{value:class{constructor(){throw new Error("Worker unavailable in this test");}}});});
  for(const [route,canvas]of [["/loom",".loom-material.is-ready"],["/reverse",".reverse-surface.is-ready"],["/pattern-room",".pattern-art-layer canvas.is-ready"],["/edition",".edition-canvas.is-ready"]]){
    await page.goto(route);await page.locator(canvas).first().waitFor();await expect(page.getByRole("alert")).toHaveCount(0);
  }
  await expect(page.locator(".edition-canvas")).toHaveAttribute("data-renderer","main");
});
