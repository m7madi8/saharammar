import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' })
await page.locator('[data-menu-toggle]').click()
await page.waitForTimeout(550)
await page.screenshot({ path: 'visual/nav-reveal-390-open.png' })
await page.locator('[data-menu-link][href="#doctors"]').click()
await page.waitForTimeout(700)
console.log(
  await page.evaluate(() => ({
    hash: location.hash,
    menuHidden: document.querySelector('[data-mobile-menu]').hidden,
  })),
)
await browser.close()
