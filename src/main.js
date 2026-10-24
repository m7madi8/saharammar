import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  clinic,
  media,
  services,
  doctors,
  results,
  social,
  getClinicWhatsAppHref,
  getDoctorWhatsAppHref,
  normalizeInstagramUrl,
  normalizeFacebookUrl,
  getClinicMapsHref,
} from './config.js'
import { createWhatsAppIcon } from './social-icons.js'

gsap.registerPlugin(ScrollTrigger)

document.documentElement.classList.add('js')

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function bindMatchMediaChange(mq, handler) {
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', handler)
    return
  }
  if (typeof mq.addListener === 'function') {
    mq.addListener(handler)
  }
}

function setupDoctorRoles() {
  document.querySelectorAll('.doctors__chapter').forEach((chapter) => {
    const key = chapter.classList.contains('doctors__chapter--sahar') ? 'sahar' : 'layan'
    const el = chapter.querySelector('[data-doctor-role]')
    if (!el) return
    const value = doctors[key]?.role?.trim() || 'طبيبة أسنان'
    el.textContent = value
    el.hidden = false
  })
}

function applyExternalLink(el, href) {
  el.setAttribute('href', href)
  el.setAttribute('target', '_blank')
  el.setAttribute('rel', 'noopener noreferrer')
}

function doctorLabel(key) {
  return key === 'sahar' ? 'سهر' : 'ليان'
}

function setupDoctorChannels() {
  /** @type {('sahar'|'layan')[]} */
  const keys = ['sahar', 'layan']
  keys.forEach((key) => {
    const block = document.querySelector(`[data-doctor-actions="${key}"]`)
    if (!block) return

    const profile = doctors[key]
    const igEl = block.querySelector('[data-doctor-instagram]')
    const waEl = block.querySelector('[data-doctor-whatsapp]')
    const igUrl = normalizeInstagramUrl(profile?.instagram)
    if (igEl) {
      if (igUrl) {
        applyExternalLink(igEl, igUrl)
        igEl.setAttribute('aria-label', `إنستغرام د. ${doctorLabel(key)} عمار`)
        igEl.hidden = false
      } else {
        igEl.removeAttribute('href')
      }
    }

    const waHref = getDoctorWhatsAppHref(key)
    if (waEl) {
      if (waHref) {
        applyExternalLink(waEl, waHref)
        waEl.setAttribute('aria-label', `واتساب د. ${doctorLabel(key)} عمار`)
        waEl.hidden = false
      } else {
        waEl.removeAttribute('href')
      }
    }

  })
}

function setupBookingLinks() {
  const clinicHref = getClinicWhatsAppHref()
  const note = document.querySelector('[data-config-note]')
  const triggers = document.querySelectorAll('[data-book-trigger]')

  if (clinicHref) {
    triggers.forEach((el) => applyExternalLink(el, clinicHref))
    if (note) note.hidden = true
  } else {
    triggers.forEach((el) => {
      if (el.tagName === 'A') {
        el.setAttribute('href', '#booking')
        el.removeAttribute('target')
        el.removeAttribute('rel')
      }
    })
    const anyDoctorWa = getDoctorWhatsAppHref('sahar') || getDoctorWhatsAppHref('layan')
    if (note) {
      note.hidden = Boolean(anyDoctorWa)
      if (!anyDoctorWa) {
        note.textContent =
          'أضيفي أرقام واتساب الطبيبتين في src/config.js — أو رقماً عاماً في contact عند توفر قناة مشتركة.'
      }
    }
  }
}

function getMenuFocusables(root) {
  return [
    ...root.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((el) => !el.hasAttribute('hidden') && el.offsetParent !== null)
}

const BOOK_PICKER_META = {
  sahar: { fullName: 'د. سهر عمار', image: media.sahar, imageAlt: 'د. سهر عمار' },
  layan: { fullName: 'د. ليان عمار', image: media.layan, imageAlt: 'د. ليان عمار' },
}

function setupBookingPicker() {
  const picker = document.querySelector('[data-book-picker]')
  const dialog = document.querySelector('[data-book-picker-dialog]')
  const choicesHost = document.querySelector('[data-book-picker-choices]')
  if (!picker || !dialog || !choicesHost) return

  /** @type {('sahar'|'layan')[]} */
  const available = ['sahar', 'layan'].filter((key) => getDoctorWhatsAppHref(key))

  choicesHost.replaceChildren()

  available.forEach((key) => {
    const meta = BOOK_PICKER_META[key]
    const role = doctors[key]?.role?.trim()

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'book-picker__choice'
    btn.dataset.bookPick = key
    btn.setAttribute('aria-label', `حجز موعد مع ${meta.fullName} عبر واتساب`)

    const portrait = document.createElement('div')
    portrait.className = 'book-picker__portrait'
    const img = document.createElement('img')
    img.src = meta.image
    img.alt = meta.imageAlt
    img.width = 85
    img.height = 102
    img.loading = 'lazy'
    img.decoding = 'async'
    portrait.appendChild(img)

    const copy = document.createElement('div')
    copy.className = 'book-picker__copy'
    const name = document.createElement('span')
    name.className = 'book-picker__name'
    name.textContent = meta.fullName
    copy.appendChild(name)
    if (role) {
      const roleEl = document.createElement('span')
      roleEl.className = 'book-picker__role'
      roleEl.textContent = role
      copy.appendChild(roleEl)
    }

    const action = document.createElement('span')
    action.className = 'book-picker__action'
    action.appendChild(createWhatsAppIcon('social-icon social-icon--book'))

    btn.append(portrait, copy, action)
    choicesHost.appendChild(btn)
  })

  let lastFocus = null
  const closeDuration = prefersReducedMotion ? 0 : 480

  const close = () => {
    picker.classList.remove('is-open')
    document.body.classList.remove('book-picker-open')
    const finish = () => {
      picker.hidden = true
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus()
    }
    if (closeDuration === 0) finish()
    else setTimeout(finish, closeDuration)
  }

  const open = () => {
    if (!available.length) {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    const active = document.activeElement
    lastFocus = active?.closest?.('[data-mobile-menu]')
      ? document.querySelector('[data-menu-toggle]')
      : active
    picker.hidden = false
    picker.classList.remove('is-open')
    requestAnimationFrame(() => {
      picker.classList.add('is-open')
      document.body.classList.add('book-picker-open')
      const first = getMenuFocusables(dialog)[0]
      first?.focus()
    })
  }

  picker.querySelectorAll('[data-book-picker-close]').forEach((el) => {
    el.addEventListener('click', close)
  })

  choicesHost.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-book-pick]')
    if (!btn) return
    const key = btn.dataset.bookPick
    const href = getDoctorWhatsAppHref(key)
    if (!href) return
    close()
    window.open(href, '_blank', 'noopener,noreferrer')
  })

  document.addEventListener('keydown', (e) => {
    if (picker.hidden) return
    if (document.body.classList.contains('menu-open')) return
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }
    if (e.key !== 'Tab') return
    const focusables = getMenuFocusables(dialog)
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  })

  document.querySelectorAll('[data-book-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      const clinicHref = getClinicWhatsAppHref()
      e.preventDefault()
      if (clinicHref) {
        window.open(clinicHref, '_blank', 'noopener,noreferrer')
        return
      }
      open()
    })
  })
}

function setupFooterContact() {
  const el = document.querySelector('[data-footer-contact]')
  if (!el) return
  const address = clinic.address?.trim()
  if (address) {
    el.textContent = address
  }
}

function setupClinicMapsLinks() {
  const href = getClinicMapsHref()
  document.querySelectorAll('[data-clinic-maps]').forEach((el) => {
    if (!href) {
      el.hidden = true
      return
    }
    applyExternalLink(el, href)
    el.hidden = false
  })
}

function setupFooterActions() {
  const nav = document.querySelector('[data-footer-actions]')
  if (!nav) return

  nav.replaceChildren()

  /** @type {{ href: string, label: string, className?: string }[]} */
  const items = []

  const maps = getClinicMapsHref()
  if (maps) {
    items.push({
      href: maps,
      label: 'الموقع على الخريطة',
      className: 'site-footer__btn site-footer__btn--primary',
    })
  }

  const fb = normalizeFacebookUrl(social.facebook)
  if (fb) {
    items.push({
      href: fb,
      label: 'فيسبوك',
      className: 'site-footer__btn',
    })
  }

  if (!items.length) {
    nav.hidden = true
    return
  }

  items.forEach(({ href, label, className }) => {
    const link = document.createElement('a')
    link.className = className || 'site-footer__btn'
    link.href = href
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.textContent = label
    nav.appendChild(link)
  })

  nav.hidden = false
}

function setResultsNavVisible(show) {
  document.querySelectorAll('[data-results-link]').forEach((el) => {
    el.hidden = !show
  })
  const teamOrd = document.querySelector(
    '.nav-reveal__item:not([data-results-link]) .nav-reveal__link[href="#doctors"] .nav-reveal__ordinal',
  )
  const philOrd = document.querySelector(
    '.nav-reveal__link[href="#philosophy"] .nav-reveal__ordinal',
  )
  const bookOrd = document.querySelector('[data-nav-ordinal-booking]')
  if (teamOrd) teamOrd.textContent = show ? '03' : '02'
  if (philOrd) philOrd.textContent = show ? '04' : '03'
  if (bookOrd) bookOrd.textContent = show ? '05' : '04'
}

function renderServices() {
  const list = document.querySelector('[data-services-list]')
  const section = document.getElementById('services')
  if (!list) return

  const filled = services.filter((s) => s.title && s.title.trim())

  if (!filled.length) {
    list.replaceChildren()
    if (section) section.hidden = true
    return
  }

  if (section) section.hidden = false

  list.innerHTML = filled
    .map(
      (service) => `
    <article class="service-row" role="listitem">
      <p class="service-row__index" aria-hidden="true">${escapeHtml(service.id)}</p>
      <h3 class="service-row__title">${escapeHtml(service.title)}</h3>
      <p class="service-row__text">${escapeHtml(service.description || '')}</p>
    </article>
  `,
    )
    .join('')
}

function getResultsCases() {
  const set = results.activeSet
  if (set === 'temporary') {
    return (results.temporaryCases || []).filter(
      (c) => c?.source === 'temporary' && c?.before?.trim() && c?.after?.trim(),
    )
  }
  if (set === 'clinic') {
    return (results.clinicCases || []).filter(
      (c) => c?.source === 'clinic' && c?.before?.trim() && c?.after?.trim(),
    )
  }
  return []
}

function resultsCompareMarkup(item, lazy = 'lazy') {
  return `
    <div class="results-compare" data-results-compare>
      <div class="results-compare__frame">
        <img class="results-compare__base" src="${escapeHtml(item.before)}" alt="${escapeHtml(item.altBefore || 'قبل')}" loading="${lazy}" decoding="async" />
        <div class="results-compare__after" data-compare-after>
          <img src="${escapeHtml(item.after)}" alt="${escapeHtml(item.altAfter || 'بعد')}" loading="${lazy}" decoding="async" />
        </div>
        <span class="results-compare__chip results-compare__chip--before">قبل</span>
        <span class="results-compare__chip results-compare__chip--after">بعد</span>
        <input
          type="range"
          class="results-compare__range"
          data-compare-range
          min="0"
          max="100"
          value="50"
          aria-label="مقارنة قبل وبعد — ${escapeHtml(item.category || '')}"
        />
      </div>
    </div>
  `
}

function attachResultsCompare(root) {
  if (!root || root.dataset.compareReady === '1') return
  const range = root.querySelector('[data-compare-range]')
  const afterWrap = root.querySelector('[data-compare-after]')
  if (!range || !afterWrap) return

  const apply = () => {
    const v = Number(range.value)
    afterWrap.style.clipPath = `inset(0 0 0 ${v}%)`
  }

  range.addEventListener('input', apply)
  range.value = '50'
  apply()
  root.dataset.compareReady = '1'
}

const RESULTS_DESKTOP_MQ = '(min-width: 900px)'

function getResultsSlidesPerView() {
  return window.matchMedia(RESULTS_DESKTOP_MQ).matches ? 2 : 1
}

function resultsMaxStartIndex(total, slidesPerView) {
  if (total <= 0) return 0
  return Math.max(0, Math.floor((total - 1) / slidesPerView) * slidesPerView)
}

function setupResultsCarousel(cases) {
  const carousel = document.querySelector('[data-results-carousel]')
  if (!carousel || !cases.length) return

  const slides = [...carousel.querySelectorAll('[data-carousel-slide]')]
  const prevBtn = carousel.querySelector('[data-carousel-prev]')
  const nextBtn = carousel.querySelector('[data-carousel-next]')
  const titleEl = carousel.querySelector('[data-carousel-case-title]')
  const counterEl = carousel.querySelector('[data-carousel-counter]')
  const dotsHost = carousel.querySelector('[data-carousel-dots]')
  const viewport = carousel.querySelector('[data-carousel-viewport]')
  const lightboxOpen = carousel.querySelector('[data-carousel-lightbox-open]')
  const lightbox = document.querySelector('[data-results-lightbox]')
  const lightboxInner = document.querySelector('[data-lightbox-inner]')
  const lightboxClose = document.querySelector('[data-lightbox-close]')

  let index = 0
  const total = cases.length
  const pad2 = (n) => String(n).padStart(2, '0')

  const setActiveCompare = () => {
    const spv = getResultsSlidesPerView()
    const visibleEnd = Math.min(total, index + spv)
    const soloLast = spv === 2 && visibleEnd - index === 1

    slides.forEach((slide, i) => {
      const on = i >= index && i < visibleEnd
      slide.classList.toggle('is-active', on)
      slide.classList.toggle('is-solo', on && soloLast)
      if (on) slide.removeAttribute('hidden')
      else slide.setAttribute('hidden', '')
    })

    slides.forEach((slide, i) => {
      if (i < index || i >= visibleEnd) return
      const cmp = slide.querySelector('[data-results-compare]')
      if (!cmp) return
      delete cmp.dataset.compareReady
      attachResultsCompare(cmp)
    })
  }

  const renderMeta = () => {
    const spv = getResultsSlidesPerView()
    const maxStart = resultsMaxStartIndex(total, spv)
    const visibleEnd = Math.min(total, index + spv)

    if (titleEl) {
      titleEl.textContent = spv === 1 ? cases[index].category || '' : ''
    }

    if (counterEl) {
      if (spv > 1 && visibleEnd - index > 1) {
        counterEl.textContent = `${pad2(index + 1)}–${pad2(visibleEnd)} / ${pad2(total)}`
      } else {
        counterEl.textContent = `${pad2(index + 1)} / ${pad2(total)}`
      }
    }

    const activePage = spv > 1 ? Math.floor(index / spv) : index
    dotsHost?.querySelectorAll('[data-carousel-dot]').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === activePage)
      dot.setAttribute('aria-current', i === activePage ? 'true' : 'false')
    })

    if (prevBtn) prevBtn.disabled = index <= 0
    if (nextBtn) nextBtn.disabled = index >= maxStart

    const labelParts = cases.slice(index, visibleEnd).map((c) => c.category || '').filter(Boolean)
    carousel.setAttribute('aria-label', `قبل وبعد — ${labelParts.join(' · ') || ''}`)
  }

  const go = (nextIndex) => {
    const spv = getResultsSlidesPerView()
    const maxStart = resultsMaxStartIndex(total, spv)
    let clamped = Math.max(0, Math.min(maxStart, nextIndex))
    if (spv > 1) {
      clamped = Math.min(maxStart, Math.floor(clamped / spv) * spv)
    }
    if (clamped === index) return
    index = clamped
    setActiveCompare()
    renderMeta()
  }

  const buildDots = () => {
    if (!dotsHost) return
    const spv = getResultsSlidesPerView()
    const pageCount = Math.ceil(total / spv)
    dotsHost.innerHTML = Array.from(
      { length: pageCount },
      (_, i) =>
        `<button type="button" class="results-carousel__dot" data-carousel-dot aria-label="الصفحة ${pad2(i + 1)}"></button>`,
    ).join('')
    dotsHost.querySelectorAll('[data-carousel-dot]').forEach((dot, page) => {
      dot.addEventListener('click', () => go(page * spv))
    })
  }

  prevBtn?.addEventListener('click', () => go(index - getResultsSlidesPerView()))
  nextBtn?.addEventListener('click', () => go(index + getResultsSlidesPerView()))

  carousel.addEventListener('keydown', (e) => {
    const step = getResultsSlidesPerView()
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(index + step)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(index - step)
    }
  })

  buildDots()

  const desktopMq = window.matchMedia(RESULTS_DESKTOP_MQ)
  bindMatchMediaChange(desktopMq, () => {
    const spv = getResultsSlidesPerView()
    index = Math.min(index, resultsMaxStartIndex(total, spv))
    buildDots()
    setActiveCompare()
    renderMeta()
  })

  let touchStartX = 0
  viewport?.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0]?.screenX ?? 0
    },
    { passive: true },
  )
  viewport?.addEventListener(
    'touchend',
    (e) => {
      const dx = (e.changedTouches[0]?.screenX ?? 0) - touchStartX
      if (Math.abs(dx) < 48) return
      const step = getResultsSlidesPerView()
      if (dx < 0) go(index + step)
      else go(index - step)
    },
    { passive: true },
  )

  const openLightbox = () => {
    if (!lightbox || !lightboxInner) return
    const item = cases[index]
    lightboxInner.innerHTML = `
      <figure class="results-lightbox__figure">
        <img src="${escapeHtml(item.before)}" alt="${escapeHtml(item.altBefore || 'قبل')}" />
        <figcaption>قبل</figcaption>
      </figure>
      <figure class="results-lightbox__figure">
        <img src="${escapeHtml(item.after)}" alt="${escapeHtml(item.altAfter || 'بعد')}" />
        <figcaption>بعد</figcaption>
      </figure>
    `
    lightbox.hidden = false
    document.body.classList.add('has-lightbox')
    lightboxClose?.focus()
  }

  const closeLightbox = () => {
    if (!lightbox) return
    lightbox.hidden = true
    document.body.classList.remove('has-lightbox')
    lightboxInner?.replaceChildren()
    lightboxOpen?.focus()
  }

  lightboxOpen?.addEventListener('click', openLightbox)
  lightboxClose?.addEventListener('click', closeLightbox)
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
      e.preventDefault()
      closeLightbox()
    }
  })

  setActiveCompare()
  renderMeta()
}

function renderResults() {
  const section = document.getElementById('results')
  const stage = document.querySelector('[data-results-stage]')
  const disclaimerEl = document.querySelector('[data-results-disclaimer]')
  if (!section || !stage) return

  const isTemporary = results.activeSet === 'temporary'
  const isClinic = results.activeSet === 'clinic'
  const cases = getResultsCases()

  section.classList.toggle('results--temporary', isTemporary)
  section.classList.toggle('results--clinic', isClinic)

  if (!cases.length) {
    section.hidden = true
    stage.replaceChildren()
    setResultsNavVisible(false)
    return
  }

  if (disclaimerEl) {
    if (isClinic && results.clinicNotice?.trim()) {
      disclaimerEl.textContent = results.clinicNotice.trim()
      disclaimerEl.hidden = false
    } else {
      disclaimerEl.textContent = ''
      disclaimerEl.hidden = true
    }
  }

  section.hidden = false
  setResultsNavVisible(true)

  stage.innerHTML = `
    <div
      class="results-carousel"
      data-results-carousel
      tabindex="0"
      role="region"
      aria-roledescription="carousel"
    >
      <div class="results-carousel__meta">
        <p class="results-carousel__case-title" data-carousel-case-title></p>
        <p class="results-carousel__counter" data-carousel-counter aria-live="polite">01 / ${String(cases.length).padStart(2, '0')}</p>
      </div>
      <div class="results-carousel__stage">
        <button type="button" class="results-carousel__nav results-carousel__nav--prev" data-carousel-prev aria-label="الحالة السابقة">
          <span aria-hidden="true">‹</span>
        </button>
        <div class="results-carousel__viewport" data-carousel-viewport>
          ${cases
            .map(
              (item, i) => `
            <article class="results-carousel__slide" data-carousel-slide ${i === 0 ? '' : 'hidden'}>
              <p class="results-carousel__slide-title">${escapeHtml(item.category || '')}</p>
              ${resultsCompareMarkup(item, i < 2 ? 'eager' : 'lazy')}
            </article>
          `,
            )
            .join('')}
        </div>
        <button type="button" class="results-carousel__nav results-carousel__nav--next" data-carousel-next aria-label="الحالة التالية">
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <div class="results-carousel__dots" data-carousel-dots role="tablist" aria-label="اختيار الحالة"></div>
      <button type="button" class="results-carousel__expand" data-carousel-lightbox-open>
        عرض الصورتين بالكامل
      </button>
    </div>
    <div class="results-lightbox" data-results-lightbox hidden role="dialog" aria-modal="true" aria-label="عرض الصور">
      <button type="button" class="results-lightbox__close" data-lightbox-close aria-label="إغلاق">×</button>
      <div class="results-lightbox__inner" data-lightbox-inner></div>
    </div>
  `

  try {
    setupResultsCarousel(cases)
  } catch (err) {
    console.error('[sahar] setupResultsCarousel', err)
  }
}

function revealSectionContent(...sectionIds) {
  sectionIds.forEach((id) => {
    const section = document.getElementById(id)
    if (!section || section.hidden) return
    section.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'))
  })
}

function setupHeader() {
  const header = document.querySelector('[data-header]')
  const onScroll = () => {
    if (!header) return
    header.classList.toggle('is-scrolled', window.scrollY > 8)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

function setupNavSpy() {
  const navLinks = document.querySelectorAll('[data-nav-link]')
  const sections = [...navLinks]
    .map((link) => {
      const id = link.getAttribute('href')?.replace('#', '')
      return id ? document.getElementById(id) : null
    })
    .filter(Boolean)

  if (!sections.length || !navLinks.length) return

  const setActive = (id) => {
    let activeLink = null
    navLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${id}`
      link.classList.toggle('is-active', match)
      if (match) {
        link.setAttribute('aria-current', 'page')
        activeLink = link
      } else {
        link.removeAttribute('aria-current')
      }
    })
    if (activeLink) syncNavRevealRail(activeLink)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]?.target?.id) setActive(visible[0].target.id)
    },
    {
      rootMargin: `-${Math.round(window.innerHeight * 0.35)}px 0px -45% 0px`,
      threshold: [0, 0.15, 0.35, 0.55],
    },
  )

  sections.forEach((section) => observer.observe(section))
}

function syncNavRevealRail(activeLink) {
  const list = document.querySelector('[data-nav-list]')
  const railNum = document.querySelector('[data-nav-rail-num]')
  const contextText = document.querySelector('[data-nav-context-text]')
  const link =
    activeLink ||
    document.querySelector('.nav-reveal__index .nav-reveal__link.is-active') ||
    document.querySelector('.nav-reveal__index .nav-reveal__link')

  if (!link || !list) return

  const item = link.closest('.nav-reveal__item')
  if (!item || item.hidden) return

  const ord = link.querySelector('.nav-reveal__ordinal')?.textContent?.trim()
  if (railNum && ord) railNum.textContent = ord

  const hint = link.dataset.navHint?.trim()
  if (contextText) contextText.textContent = hint || ''

  const rail = document.querySelector('.nav-reveal__rail')
  const navRoot = document.querySelector('.nav-reveal')
  const itemRect = item.getBoundingClientRect()
  const railRect = rail?.getBoundingClientRect()
  if (railRect && navRoot) {
    const y = itemRect.top - railRect.top + itemRect.height * 0.12
    const h = Math.max(itemRect.height * 0.76, 28)
    navRoot.style.setProperty('--nav-rail-y', `${y}px`)
    navRoot.style.setProperty('--nav-rail-h', `${h}px`)
  }
}

function setupNavReveal() {
  const descriptor = document.querySelector('[data-nav-descriptor]')
  if (descriptor) {
    descriptor.textContent = `${clinic.descriptor} — رام الله`
  }

  const menuLinks = document.querySelectorAll('.nav-reveal__index [data-menu-link]')
  menuLinks.forEach((link) => {
    const sync = () => syncNavRevealRail(link)
    link.addEventListener('mouseenter', sync)
    link.addEventListener('focus', sync)
  })

  syncNavRevealRail()
  window.addEventListener('resize', () => syncNavRevealRail(), { passive: true })
}

function setupMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]')
  const menu = document.querySelector('[data-mobile-menu]')
  const drawer = document.querySelector('[data-menu-drawer]')
  const backdrop = document.querySelector('[data-menu-backdrop]')
  const label = document.querySelector('[data-menu-label]')
  const links = document.querySelectorAll('[data-menu-link], [data-menu-auto-close]')

  if (!toggle || !menu) return

  let lastFocus = null
  let closeTimer = null
  const motionMs = 480

  const open = () => {
    clearTimeout(closeTimer)
    lastFocus = document.activeElement
    menu.hidden = false
    menu.classList.remove('is-stagger')
    requestAnimationFrame(() => {
      menu.classList.add('is-open')
      requestAnimationFrame(() => {
        menu.classList.add('is-stagger')
        syncNavRevealRail()
      })
    })
    toggle.setAttribute('aria-expanded', 'true')
    toggle.setAttribute('aria-label', 'إغلاق قائمة التنقل')
    if (label) label.textContent = 'إغلاق'
    document.body.classList.add('menu-open')
  }

  const close = ({ restoreFocus = true, instant = false } = {}) => {
    menu.classList.remove('is-stagger')
    menu.classList.remove('is-open')
    toggle.setAttribute('aria-expanded', 'false')
    toggle.setAttribute('aria-label', 'فتح قائمة التنقل')
    if (label) label.textContent = 'القائمة'
    document.body.classList.remove('menu-open')
    const finish = () => {
      menu.hidden = true
      if (restoreFocus) {
        const target =
          lastFocus && typeof lastFocus.focus === 'function' ? lastFocus : toggle
        target.focus()
      }
    }
    clearTimeout(closeTimer)
    const reduced = prefersReducedMotion || instant
    if (reduced) finish()
    else closeTimer = setTimeout(finish, motionMs)
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation()
    const isClosed = menu.hasAttribute('hidden')
    if (isClosed) open()
    else close()
  })

  backdrop?.addEventListener('click', () => close())
  links.forEach((link) =>
    link.addEventListener('click', () => close({ restoreFocus: false })),
  )

  const desktopMq = window.matchMedia('(min-width: 1024px)')
  desktopMq.addEventListener('change', (e) => {
    if (e.matches && !menu.hidden) close({ restoreFocus: false, instant: true })
  })

  document.addEventListener('keydown', (e) => {
    if (menu.hidden) return
    if (!document.body.classList.contains('menu-open')) return
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }
    if (e.key !== 'Tab' || !drawer) return
    const inDrawer = getMenuFocusables(drawer)
    const focusables = toggle ? [toggle, ...inDrawer] : inDrawer
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  })
}

function headerOffsetPx() {
  const header = document.querySelector('[data-header]')
  if (header?.offsetHeight) return header.offsetHeight
  return 64
}

function setupMobileCtaVisibility() {
  const cta = document.querySelector('.mobile-cta')
  const hero = document.querySelector('.hero')
  const booking = document.getElementById('booking')
  if (!cta || !hero) return

  let heroInView = true
  let bookingInView = false
  const mobileMq = window.matchMedia('(max-width: 767px)')

  const update = () => {
    if (!mobileMq.matches) {
      cta.classList.remove('is-shown')
      cta.setAttribute('aria-hidden', 'true')
      cta.tabIndex = -1
      return
    }

    const show = !heroInView && !bookingInView
    cta.classList.toggle('is-shown', show)
    cta.setAttribute('aria-hidden', show ? 'false' : 'true')
    cta.tabIndex = show ? 0 : -1
  }

  const topInset = headerOffsetPx()
  const heroObserver = new IntersectionObserver(
    (entries) => {
      heroInView = entries[0]?.isIntersecting ?? true
      update()
    },
    {
      threshold: 0,
      rootMargin: `-${topInset}px 0px 0px 0px`,
    },
  )

  heroObserver.observe(hero)

  if (booking) {
    new IntersectionObserver(
      (entries) => {
        bookingInView = entries[0]?.isIntersecting ?? false
        update()
      },
      { threshold: 0.15 },
    ).observe(booking)
  }

  mobileMq.addEventListener('change', update)
  window.addEventListener(
    'resize',
    () => {
      /* rootMargin is fixed at init; scroll fallback keeps CTA in sync on resize */
      update()
    },
    { passive: true },
  )
  update()
}

function setupMotion() {
  if (prefersReducedMotion) {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'))
    return
  }

  document.documentElement.classList.add('motion-enabled')

  const heroItems = document.querySelectorAll('.hero [data-reveal]')
  gsap.from(heroItems, {
    opacity: 0,
    y: 14,
    duration: 0.9,
    stagger: 0.09,
    ease: 'power2.out',
    onStart: () => heroItems.forEach((el) => el.classList.add('is-visible')),
  })

  const heroVisual = document.querySelector('.hero__visual')
  if (heroVisual) {
    heroVisual.classList.add('is-visible')
    gsap.fromTo(
      heroVisual,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.05, ease: 'power2.out', delay: 0.05 },
    )
  }

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    if (el.closest('.hero')) return
    if (el.closest('#services, #results')) {
      el.classList.add('is-visible')
      return
    }
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        el.classList.add('is-visible')
        gsap.from(el, {
          opacity: 0,
          y: 18,
          duration: 0.85,
          ease: 'power2.out',
        })
      },
    })
  })
}

function markAllRevealedFallback() {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'))
}

function setupYear() {
  const y = document.querySelector('[data-year]')
  if (y) y.textContent = String(new Date().getFullYear())
}

function initApp() {
  const steps = [
    renderServices,
    renderResults,
    setupDoctorChannels,
    setupBookingLinks,
    setupBookingPicker,
    setupFooterActions,
    setupClinicMapsLinks,
    setupFooterContact,
    setupDoctorRoles,
    setupHeader,
    setupNavSpy,
    setupNavReveal,
    setupMobileMenu,
    setupMobileCtaVisibility,
    setupYear,
    setupMotion,
  ]

  let motionFailed = false
  for (const step of steps) {
    try {
      step()
    } catch (err) {
      console.error('[sahar]', step.name || 'step', err)
      if (step === setupMotion) motionFailed = true
    }
  }
  if (motionFailed) markAllRevealedFallback()
  revealSectionContent('services', 'results')
  ScrollTrigger.refresh()
  document.documentElement.dataset.ready = '1'
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
