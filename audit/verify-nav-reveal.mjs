import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:4174/'
const browser = await chromium.launch({ headless: true })

for (const width of [320, 390, 430]) {
  const page = await browser.newPage({ viewport: { width, height: 844 } })
  await page.goto(url, { waitUntil: 'networkidle' })

  const toggle = page.locator('[data-menu-toggle]')
  await toggle.click()
  await page.waitForTimeout(600)

  const open = await page.evaluate(() => {
    const menu = document.querySelector('[data-mobile-menu]')
    return {
      hidden: menu?.hidden,
      isOpen: menu?.classList.contains('is-open'),
      stagger: menu?.classList.contains('is-stagger'),
      links: [...document.querySelectorAll('.nav-reveal__link')].map((a) => ({
        text: a.querySelector('.nav-reveal__label')?.textContent?.trim(),
        href: a.getAttribute('href'),
      })),
      toggleLabel: document.querySelector('[data-menu-label]')?.textContent?.trim(),
      hasRail: !!document.querySelector('[data-nav-rail-mark]'),
      brand: document.getElementById('nav-reveal-brand')?.textContent?.replace(/\s+/g, ' ')?.trim(),
      descriptor: document.querySelector('[data-nav-descriptor]')?.textContent?.trim(),
    }
  })

  await page.keyboard.press('Escape')
  await page.waitForTimeout(600)

  const closed = await page.evaluate(() => {
    const menu = document.querySelector('[data-mobile-menu]')
    return menu?.hidden === true
  })

  await page.locator('[data-menu-toggle]').click()
  await page.waitForTimeout(400)
  await page.locator('[data-menu-link][href="#doctors"]').click()
  await page.waitForTimeout(500)
  const afterNav = await page.evaluate(() => ({
    hash: location.hash,
    menuHidden: document.querySelector('[data-mobile-menu]')?.hidden,
  }))

  console.log(JSON.stringify({ width, open, closed, afterNav }, null, 2))
  await page.close()
}

await browser.close()
