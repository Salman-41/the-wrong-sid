import { test, expect } from "@playwright/test";

test("homepage opens a real cloth study, preserves construction and provides explicit routes", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".entrance h1")).toHaveAttribute("aria-label", "THE WRONG SIDE.");
  await expect(page.locator(".entrance-cloth-study")).toHaveCount(0);
  await expect(page.locator(".entrance-image-note")).toContainText("Provisional concept image");
  await expect(page.locator(".home-making-art img")).toHaveAttribute("loading", "lazy");
  await expect(page.locator(".home-collection-object img")).toHaveAttribute("loading", "lazy");
  await expect(page.locator(".home-collection-object figcaption")).toContainText("1951-111-34");
  await expect(page.locator(".home-collection-object figcaption")).toContainText("CC0");

  const entrance = page.locator(".lift-link--paper");
  if (isMobile) await entrance.tap(); else await entrance.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Beneath the surface." })).toBeFocused();
  const cloth = page.locator(".entrance-study-surface canvas");
  await expect(cloth).toHaveAttribute("data-rows", "28");
  await expect(cloth).toHaveAttribute("data-progress", "0.380");
  await page.getByRole("group", { name: "Turn the studio cloth" }).getByRole("button", { name: "Reverse" }).click();
  await expect(cloth).toHaveAttribute("data-progress", "1.000");
  await page.getByRole("group", { name: "Turn the studio cloth" }).getByRole("button", { name: "Front" }).click();
  await expect(cloth).toHaveAttribute("data-progress", "0.000");
  await page.getByLabel("Lift and turn").focus();
  await page.keyboard.press("End");
  await expect(cloth).toHaveAttribute("data-progress", "1.000");
  await page.keyboard.press("Escape");
  await expect(page.locator(".entrance-reveal")).toHaveCount(0);
  await expect(entrance).toBeFocused();

  await page.locator(".home-making").getByRole("link", { name: "Work the Loom" }).click();
  await expect(page).toHaveURL(/\/loom$/);
  await page.getByRole("button", { name: "Add a woven row" }).click();
  await expect(page.getByLabel("Rows woven")).toHaveText("29");
  await page.getByRole("link", { name: "THE WRONG SIDE. — Entrance" }).click();
  await page.locator(".lift-link--paper").click();
  await expect(page.locator(".entrance-study-surface canvas")).toHaveAttribute("data-rows", "29");
  await page.getByRole("link", { name: "Explore the Reverse" }).click();
  await expect(page).toHaveURL(/\/reverse$/);
  await expect(page.locator(".reverse-moving-cloth")).toHaveAttribute("data-rows", "29");
  expect(errors).toEqual([]);
});

test("homepage links, keyboard fallback and small viewport remain usable", async ({ page, browser }) => {
  await page.goto("/");
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.locator(".lift-link--paper").focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("heading", { name: "Beneath the surface." })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByRole("button", { name: "Reset to cover" }).click();
  for (const href of ["/loom", "/reverse", "/pattern-room", "/collection", "/edition"]) {
    await expect(page.locator(".home-footer nav a[href='" + href + "']")).toHaveCount(1);
  }
  await page.locator(".home-collection-image").click();
  await expect(page).toHaveURL(/\/collection\/chndm-1951-111-34$/);
  await expect(page.locator("h1")).toHaveText("Textile");

  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const fallback = await noScript.newPage();
  await fallback.goto("/");
  await fallback.locator(".lift-link--paper").click();
  await expect(fallback).toHaveURL(/\/reverse$/);
  await noScript.close();
});
