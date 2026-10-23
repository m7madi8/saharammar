import { chromium } from 'playwright'

const url = process.argv[2] || 'http://127.0.0.1:4174/'
const widths = [320, 375, 390, 768, 1024, 1440]
const browser = await chromium.launch({ headless: true })

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })

  const state = await page.evaluate(() => ({
    resultsHidden: document.getElementById('results')?.hidden,
    resultsNavHidden: document.querySelector('[data-results-link]')?.hidden,
    resultsTemporary: document.getElementById('results')?.classList.contains('results--temporary'),
    carouselSlides: document.querySelectorAll('[data-carousel-slide]').length,
    visibleSlides: document.querySelectorAll('[data-carousel-slide]:not([hidden])').length,
    carouselCounter: document.querySelector('[data-carousel-counter]')?.textContent?.trim(),
    servicesCount: document.querySelectorAll('.service-row').length,
    brand: document.querySelector('.brand__name')?.textContent?.trim(),
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }))

  if (width === 375) {
    await page.locator('#results').scrollIntoViewIfNeeded()
    await page.locator('[data-carousel-next]').click()
    await page.waitForTimeout(200)
    const navState = await page.evaluate(() => ({
      afterNext: document.querySelector('[data-carousel-counter]')?.textContent?.trim(),
      caseTitle: document.querySelector('[data-carousel-case-title]')?.textContent?.trim(),
    }))
    Object.assign(state, navState)
  }

  if (width === 390) {
    await page.locator('[data-menu-toggle]').click()
    await page.waitForTimeout(500)
    const menuOpen = await page.evaluate(() =>
      document.querySelector('[data-mobile-menu]')?.classList.contains('is-open'),
    )
    state.menuOpen = menuOpen
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
    await page.locator('#doctors').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    state.ctaShown = await page.evaluate(() => {
      const cta = document.querySelector('.mobile-cta')
      return cta && !cta.hidden && cta.classList.contains('is-shown')
    })
    if (!state.ctaShown) {
      throw new Error('mobile CTA not visible after scroll to doctors')
    }
    await page.locator('.mobile-cta').click({ timeout: 8000 })
    await page.waitForTimeout(400)
    state.pickerOpen = await page.evaluate(
      () => !document.querySelector('[data-book-picker]')?.hidden,
    )
    await page.locator('.book-picker__dismiss').click()
  }

  console.log(JSON.stringify({ width, ...state }))
  await page.close()
}

await browser.close()
