import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const base = process.env.HOMEPAGE_BASE_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
mkdirSync('artifacts/homepage', { recursive: true });
const results = [];
for (const [name, width, height] of [['desktop', 1440, 900], ['laptop', 1366, 768], ['tablet', 834, 1112], ['mobile', 390, 844], ['small', 320, 740]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  for (const selector of ['.home-making', '.home-collection', '.home-footer']) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.locator(selector).evaluate(async el => { await Promise.all([...el.querySelectorAll('img')].map(img => img.decode())); });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `artifacts/homepage/${name}.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  await page.locator('.lift-link--paper').click();
  await page.waitForFunction(() => document.querySelector('.entrance-study-surface canvas')?.dataset.progress === '0.380');
  await page.screenshot({ path: `artifacts/homepage/${name}-lift.png`, fullPage: true });
  results.push({ name, width, height, overflow, revealOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), errors });
  await page.close();
}
writeFileSync('artifacts/homepage/capture.json', JSON.stringify(results, null, 2));
console.log(results);
await browser.close();
