import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, 'visual', 'services-redesign')
const BASE = process.argv[2] || 'http://localhost:4174/'

const VIEWPORTS = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
]

await mkdir(OUT_DIR, { recursive: true })

const browser = await chromium.launch({ timeout: 60000 })
const page = await browser.newPage()

for (const vp of VIEWPORTS) {
  await page.setViewportSize({ width: vp.width, height: vp.height })
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.classList.add('is-visible')
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
  })
  const loc = page.locator('#services')
  await loc.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  const file = path.join(OUT_DIR, `services-${vp.name}.png`)
  await loc.screenshot({ path: file })
  console.log('wrote', file)
}

await browser.close()
