import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:4174/'
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.goto(url, { waitUntil: 'networkidle' })

const report = await page.evaluate(() => {
  const visible = (el) => el && !el.hidden && el.offsetParent !== null
  const badHash = []
  document.querySelectorAll('a[href="#"]').forEach((a) => {
    if (visible(a)) badHash.push(a.textContent.trim())
  })
  const visibleSocial = []
  document.querySelectorAll('[data-doctor-instagram], [data-doctor-whatsapp]').forEach((a) => {
    if (!a.hidden) visibleSocial.push(a.getAttribute('href'))
  })
  return {
    badHash,
    visibleSocialCount: visibleSocial.length,
    doctorReserve: [...document.querySelectorAll('[data-book-doctor]')].map((a) => ({
      who: a.dataset.bookDoctor,
      href: a.getAttribute('href'),
    })),
    generalBook: [...document.querySelectorAll('[data-book]:not([data-book-doctor])')].map((a) =>
      a.getAttribute('href'),
    ),
    footerActionsHidden: document.querySelector('[data-footer-actions]')?.hidden,
  }
})

console.log(JSON.stringify(report, null, 2))
await browser.close()
