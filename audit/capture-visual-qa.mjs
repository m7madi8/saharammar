/**
 * Visual QA capture — audit only, does not modify the app.
 * Usage: node audit/capture-visual-qa.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'visual');
const BASE_URL = process.argv[2] || 'http://localhost:4173/';

const VIEWPORTS = [
  { name: '320', width: 320, height: 800 },
  { name: '375', width: 375, height: 812 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 900 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

const SECTIONS = [
  { id: 'header', selector: '.site-header' },
  { id: 'hero', selector: '.hero' },
  { id: 'results', selector: '#results' },
  { id: 'services', selector: '#services' },
  { id: 'doctors', selector: '#doctors' },
  { id: 'philosophy', selector: '#philosophy' },
  { id: 'booking', selector: '#booking' },
  { id: 'footer', selector: '.site-footer' },
  { id: 'mobile-cta', selector: '.mobile-cta' },
];

const log = {
  baseUrl: BASE_URL,
  capturedAt: new Date().toISOString(),
  viewportsTested: [],
  screenshots: [],
  consoleErrors: [],
  pageErrors: [],
  resourceFailures: [],
  navTests: [],
  menuTests: [],
  fontsLoaded: null,
  imagesLoaded: [],
};

async function waitForStable(page) {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  });
  await page.waitForTimeout(300);
}

async function captureSections(page, prefix) {
  for (const { id, selector } of SECTIONS) {
    const loc = page.locator(selector).first();
    const count = await loc.count();
    if (!count) {
      log.screenshots.push({ file: null, note: `missing selector ${selector}`, prefix, id });
      continue;
    }
    const file = `${prefix}-${id}.png`;
    const filePath = path.join(OUT_DIR, file);
    try {
      await loc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await loc.screenshot({ path: filePath });
      log.screenshots.push({ file: `audit/visual/${file}`, prefix, id });
    } catch (e) {
      log.screenshots.push({ file: null, error: String(e), prefix, id });
    }
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: 'ar-SA',
    colorScheme: 'light',
  });

  for (const vp of VIEWPORTS) {
    const page = await context.newPage();
    page.on('console', (msg) => {
      if (msg.type() === 'error') log.consoleErrors.push({ viewport: vp.name, text: msg.text() });
    });
    page.on('pageerror', (err) => {
      log.pageErrors.push({ viewport: vp.name, text: err.message });
    });
    page.on('requestfailed', (req) => {
      log.resourceFailures.push({
        viewport: vp.name,
        url: req.url(),
        failure: req.failure()?.errorText,
      });
    });

    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForStable(page);

    const prefix =
      vp.width >= 1024 ? `desktop-${vp.name}` : vp.width >= 768 ? `tablet-${vp.name}` : `mobile-${vp.name}`;

    const fullFile = `${prefix}-full.png`;
    await page.screenshot({ path: path.join(OUT_DIR, fullFile), fullPage: true });
    log.screenshots.push({ file: `audit/visual/${fullFile}`, prefix, id: 'full-page' });

    await captureSections(page, prefix);

    if (vp.name === '390') {
      const toggle = page.locator('[data-menu-toggle]');
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(400);
        const menuFile = `${prefix}-menu-open.png`;
        await page.screenshot({ path: path.join(OUT_DIR, menuFile), fullPage: false });
        log.screenshots.push({ file: `audit/visual/${menuFile}`, prefix, id: 'menu-open' });
        log.menuTests.push({ action: 'open', viewport: vp.name, ok: true });

        const close = page.locator('[data-menu-close]');
        if (await close.isVisible()) {
          await close.click();
          await page.waitForTimeout(300);
          const hidden = await page.locator('[data-mobile-menu]').getAttribute('hidden');
          log.menuTests.push({ action: 'close', viewport: vp.name, menuHidden: hidden !== null });
        }

        await toggle.click();
        await page.waitForTimeout(300);
        const link = page.locator('[data-menu-link][href="#doctors"]').first();
        if (await link.isVisible()) {
          await link.click();
          await page.waitForTimeout(600);
          const hash = await page.evaluate(() => location.hash);
          log.menuTests.push({ action: 'nav-doctors', viewport: vp.name, hash });
        }
      } else {
        log.menuTests.push({ viewport: vp.name, note: 'menu toggle not visible' });
      }
    }

    if (vp.name === '1440') {
      const navLink = page.locator('.nav-desktop a[href="#results"]').first();
      if (await navLink.isVisible()) {
        await navLink.click();
        await page.waitForTimeout(500);
        log.navTests.push({
          viewport: vp.name,
          link: '#results',
          hash: await page.evaluate(() => location.hash),
        });
      }
      const bookBtn = page.locator('.hero__actions .btn--primary').first();
      if (await bookBtn.isVisible()) {
        const href = await bookBtn.getAttribute('href');
        log.navTests.push({ viewport: vp.name, element: 'hero-book', href });
      }
    }

    if (vp.name === '390' && log.fontsLoaded === null) {
      log.fontsLoaded = await page.evaluate(() => {
        const families = ['El Messiri', 'Alexandria'];
        return families.map((family) => {
          const loaded = document.fonts.check(`16px "${family}"`);
          return { family, loaded };
        });
      });
      log.imagesLoaded = await page.evaluate(() =>
        [...document.images].map((img) => ({
          src: img.currentSrc || img.src,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          alt: img.alt || '',
        }))
      );
    }

    log.viewportsTested.push({ name: vp.name, width: vp.width, height: vp.height, prefix });
    await page.close();
  }

  await browser.close();
  await writeFile(path.join(__dirname, 'capture-log.json'), JSON.stringify(log, null, 2), 'utf8');
  console.log(JSON.stringify({ ok: true, screenshots: log.screenshots.length, out: OUT_DIR }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
