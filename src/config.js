/**
 * بيانات التواصل — املئي الحقول الفارغة عند التأكد من الروابط والأرقام.
 *
 * واتساب (wa.me): رمز الدولة + الرقم بدون + أو مسافات أو شرطات — مثال: '966501234567'
 * إنستغرام: رابط الحساب الكامل — مثال: 'https://www.instagram.com/username/'
 * فيسبوك: رابط صفحة العيادة الرسمية فقط — مثال: 'https://www.facebook.com/ClinicPage'
 */

/** قناة عامة اختيارية — إن تُركت فارغة، أزرار الحجز العامة تبقى على #booking */
export const contact = {
  whatsappNumber: '',
  whatsappMessage: 'مرحباً، أود الاستفسار عن موعد في العيادة.',
}

export const clinic = {
  name: 'سهر × ليان',
  descriptor: 'طب الأسنان',
  /** عنوان العيادة — يُعرض في الفوتر */
  address: 'رام الله — الطيرة — عمارة قصر آدم — الطابق الأول — مقابل معهد الطيرة',
  /** اتجاهات Google Maps — يُفتح في تطبيق/متصفح الخرائط */
  mapsDirections:
    'https://www.google.com/maps/dir/31.6352582,35.013358/31.9098941,35.188285/@31.7759314,35.4251434,10z/data=!3m1!4b1!4m4!4m3!1m1!4e1!1m0?entry=ttu',
}

/** تواصل العيادة — صفحة فيسبوك رسمية */
export const social = {
  facebook: 'https://www.facebook.com/profile.php?id=100063567009549',
}

/** مسارات الصور — الملفات في public/images/ */
export const media = {
  hero: './images/1000259883.jpg',
  sahar: './images/dr.saharammar-20261022-0001.jpg',
  layan: './images/dr.layan_ammar-20261022-0002.jpg',
}

export const imageBase = './images/'

/** كل طبيبة: قنوات مستقلة — لا تشاركي رقماً أو حساباً بينهما */
export const doctors = {
  sahar: {
    role: 'طبيبة أسنان تجميلية',
    instagram: 'https://www.instagram.com/dr.saharammar/',
    whatsappNumber: '970595302392',
    whatsappMessage: 'مرحباً، أود حجز موعد مع د. سهر عمار.',
  },
  layan: {
    role: 'طبيبة أسنان',
    instagram: 'https://www.instagram.com/dr.layan_ammar/',
    whatsappNumber: '972594380818',
    whatsappMessage: 'مرحباً، أود حجز موعد مع د. ليان عمار.',
  },
}

/**
 * النتائج — مصدران منفصلان:
 * - activeSet: 'temporary' | 'clinic' | 'none'
 * - temporaryCases: أمثلة مرخّصة من خارج العيادة (لا تُعرض كنتائج للطبيبتين)
 * - clinicCases: حالات العيادة الحقيقية بعد الموافقة — تُفعَّل بـ activeSet: 'clinic' فقط
 */
export const results = {
  activeSet: 'temporary',

  clinicNotice: 'تختلف النتائج من حالة إلى أخرى.',

  temporaryCases: [
    {
      id: 'temp-feldspathic-crowns',
      source: 'temporary',
      category: 'تجميل الأسنان الأمامية',
      before: './images/results/temporary/case-feldspathic-before.jpg',
      after: './images/results/temporary/case-feldspathic-after.jpg',
      altBefore: 'أسنان أمامية قبل ترميم التيجان',
      altAfter: 'أسنان أمامية بعد ترميم التيجان',
      attribution: {
        author: 'AmirAttallah',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        sourcePage:
          'https://commons.wikimedia.org/wiki/File:Feldspathic_VM9_Porcelain_Crowns.jpg',
        fileUrl:
          'https://upload.wikimedia.org/wikipedia/commons/6/6f/Feldspathic_VM9_Porcelain_Crowns.jpg',
        creditLine:
          'AmirAttallah / Wikimedia Commons (CC BY-SA 4.0) — اقتصاص من صورة مركّبة قبل/بعد لنفس الحالة',
      },
    },
    {
      id: 'temp-gingivitis',
      source: 'temporary',
      category: 'عناية باللثة',
      before: './images/results/temporary/case-gingivitis-before.jpg',
      after: './images/results/temporary/case-gingivitis-after.jpg',
      altBefore: 'التهاب لثة قبل العلاج',
      altAfter: 'لثة بعد التنظيف',
      attribution: {
        author: 'DRosenbach',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
        sourcePage:
          'https://commons.wikimedia.org/wiki/File:Gingivitis_before_and_after.jpg',
        fileUrl:
          'https://upload.wikimedia.org/wikipedia/commons/7/78/Gingivitis_before_and_after.jpg',
        creditLine:
          'DRosenbach / Wikimedia Commons (CC BY-SA 3.0) — اقتصاص من صورة مركّبة لنفس الحالة',
      },
    },
    {
      id: 'temp-open-bite',
      source: 'temporary',
      category: 'تقويم الأسنان — عضة مفتوحة',
      before: './images/results/temporary/case-open-bite-before.jpg',
      after: './images/results/temporary/case-open-bite-after.jpg',
      altBefore: 'عضة مفتوحة قبل التقويم',
      altAfter: 'عضة بعد التقويم',
      attribution: {
        author: 'Jeffrey Dorfman',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
        sourcePage: 'https://commons.wikimedia.org/wiki/File:Treat_open_bite.jpg',
        fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Treat_open_bite.jpg',
        creditLine:
          'Jeffrey Dorfman / Wikimedia Commons (CC BY-SA 3.0) — اقتصاص من صورة مركّبة لنفس الحالة',
      },
    },
    {
      id: 'temp-orthodontic-braces',
      source: 'temporary',
      category: 'تقويم الأسنان',
      before: './images/results/temporary/case-orthodontic-before.jpg',
      after: './images/results/temporary/case-orthodontic-after.jpg',
      altBefore: 'أسنان قبل التقويم',
      altAfter: 'أسنان بعد التقويم',
      attribution: {
        author: 'Jeffrey Dorfman',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
        sourcePage:
          'https://commons.wikimedia.org/wiki/File:Before_and_After_Photos_following_Orthodontic_Treatment_-_Teeth_Braces.jpg',
        fileUrl:
          'https://upload.wikimedia.org/wikipedia/commons/4/4f/Before_and_After_Photos_following_Orthodontic_Treatment_-_Teeth_Braces.jpg',
        creditLine:
          'Jeffrey Dorfman / Wikimedia Commons (CC BY-SA 3.0) — اقتصاص من صورة مركّبة لنفس الحالة',
      },
    },
  ],

  clinicCases: [],
}

export const services = [
  {
    id: '01',
    title: 'حشوات الأسنان',
    description: 'علاج التسوس واستعادة بنية السن بحسب الحالة.',
  },
  {
    id: '02',
    title: 'تبييض الأسنان',
    description: 'تبييض يراعي حالة الأسنان واللثة ومدى ملاءمة الإجراء.',
  },
  {
    id: '03',
    title: 'تجميل الأسنان الأمامية',
    description: 'عناية بمظهر الأسنان الأمامية بما يتناسب مع الحالة واحتياجاتها.',
  },
  {
    id: '04',
    title: 'فصوص الأسنان وتلميعها',
    description: 'لمسات جمالية للأسنان، بعد تحديد الإجراء المناسب.',
  },
  {
    id: '05',
    title: 'علاج أسنان الأطفال',
    description: 'عناية بأسنان الأطفال تراعي احتياجاتهم وراحتهم.',
  },
]

const WHATSAPP_DIGITS = /^\d{8,15}$/

function normalizeDigits(value) {
  return String(value || '').replace(/\s/g, '').replace(/^\+/, '')
}

/** @returns {string|null} */
export function getWhatsAppHref(number, message = '') {
  const digits = normalizeDigits(number)
  if (!digits || !WHATSAPP_DIGITS.test(digits)) return null
  const base = `https://wa.me/${digits}`
  const msg = String(message || '').trim()
  if (!msg) return base
  return `${base}?text=${encodeURIComponent(msg)}`
}

/** @returns {string|null} */
export function getDoctorWhatsAppHref(doctorKey) {
  const profile = doctors[doctorKey]
  if (!profile) return null
  return getWhatsAppHref(profile.whatsappNumber, profile.whatsappMessage)
}

/** @returns {string|null} */
export function getClinicWhatsAppHref() {
  const { whatsappNumber, whatsappMessage } = contact
  return getWhatsAppHref(whatsappNumber, whatsappMessage)
}

/** @returns {string|null} */
export function normalizeInstagramUrl(url) {
  const raw = String(url || '').trim()
  if (!raw) return null
  try {
    const parsed = new URL(raw)
    const host = parsed.hostname.replace(/^www\./, '')
    if (host !== 'instagram.com') return null
    if (!parsed.pathname || parsed.pathname === '/') return null
    return parsed.href
  } catch {
    return null
  }
}

/** @returns {string|null} */
export function normalizeFacebookUrl(url) {
  const raw = String(url || '').trim()
  if (!raw) return null
  try {
    const parsed = new URL(raw)
    const host = parsed.hostname.replace(/^www\./, '')
    if (host !== 'facebook.com' && host !== 'fb.com' && host !== 'm.facebook.com') return null
    if (!parsed.pathname || parsed.pathname === '/') return null
    return parsed.href
  } catch {
    return null
  }
}

/** @returns {string|null} */
export function normalizeGoogleMapsUrl(url) {
  const raw = String(url || '').trim()
  if (!raw) return null
  try {
    const parsed = new URL(raw)
    const host = parsed.hostname.replace(/^www\./, '')
    if (host === 'maps.google.com') return parsed.href
    if (host === 'google.com' && parsed.pathname.startsWith('/maps')) return parsed.href
    if (host === 'maps.app.goo.gl' || host === 'goo.gl') return parsed.href
    return null
  } catch {
    return null
  }
}

/** @returns {string|null} */
export function getClinicMapsHref() {
  return normalizeGoogleMapsUrl(clinic.mapsDirections)
}
