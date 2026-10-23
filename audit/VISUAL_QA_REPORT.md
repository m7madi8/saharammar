# Visual QA & Art Direction Audit — عيادة سهر

**التاريخ:** 2026-10-22  
**المشروع:** `D:\projects\sahar`  
**مرجع مساعد (غير ملزم بصرياً):** `DESIGN_AUDIT_REPORT.md`

---

## 1. ملخص تنفيذي صريح

تم **معاينة الموقع فعلياً** عبر Chromium (Playwright) على **`http://localhost:4173/`** (Vite **preview** لنسخة production المبنية، وليس `npm run dev`).

**الحكم البصري الإجمالي (من اللقطات، ثقة مرتفعة):** **5.8 / 10**  
**درجة التشابه مع القوالب / أنماط AI (مقياس التشابه فقط):** **6 / 10**

**ما يبدو احترافياً حقاً عند رؤية الصفحة:**

- الهيرو على سطح المكتب: تقسيم «لوحة عاجية + عمود صورة»، صورة العيادة الحقيقية، زوايا ناعمة، وتسلسل typographic واضح (`desktop-1440-hero.png`).
- قسم الأطباء: دIPTYCH جنباً إلى جنب مع صورتين حقيقيتين وتوازن مقبول على 1440+ (`desktop-1920-doctors.png`, `mobile-390-doctors.png`).
- تحميل الخطوط والصور: **El Messiri** و **Alexandria** محمّلتان؛ 3 صور JPG بعرض طبيعي > 0 (`capture-log.json`).

**ما يكسر تجربة الزائر اليوم (أهم من «جمال القالب»):**

- **قسم النتائج** مباشرة بعد الهيرو يعرض **رسالة تطوير** تذكر `src/config.js` — ظاهرة للعامة (`desktop-1440-results.png`, `mobile-390-results.png`). **P0**
- **الخدمات** و**الحجز** و**الفوتر** تعرض placeholders / رسائل إعداد (`desktop-1440-services.png`, `desktop-1440-booking.png`, `desktop-1440-footer.png`). **P0–P1**
- **تناقض الهوية:** هيدر «**سهر**» فقط vs فوتر «**س·ل**» + «سهر × ليان» (`desktop-1440-footer.png` vs `desktop-1440-hero.png`). **P1**
- على الهاتف: **CTA ثابت «احجزي»** يغطي أزرار «احجزي مع د.…» في قسم الأطباء (`mobile-390-doctors.png`). **P1**

**الخلاصة:** الهيكل وال tokens يوحيان باتجاه «عيادة راقية»، لكن **الصفحة الحية اليوم تبدو موقعاً under construction** أكثر من موقعاً جاهزاً للثقة — لا بسبب CSS فقط، بل بسبب **محتوى/نصوص/فراغات** في مواضع استراتيجية (نتائج، خدمات، حجز، فوتر).

---

## 2. المقاسات التي اختُبرت فعلياً

| المقاس | البادئة | لقطة كاملة | أقسام منفصلة |
|--------|---------|------------|--------------|
| 320×800 | `mobile-320` | ✅ | ✅ (9) |
| 375×812 | `mobile-375` | ✅ | ✅ |
| 390×844 | `mobile-390` | ✅ | ✅ + **قائمة مفتوحة** |
| 768×1024 | `tablet-768` | ✅ | ✅ (فشل لقطة `.mobile-cta` — مخفية ≥768px) |
| 1024×900 | `desktop-1024` | ✅ | ✅ |
| 1440×900 | `desktop-1440` | ✅ | ✅ |
| 1920×1080 | `desktop-1920` | ✅ | ✅ |

**المجموع:** 71 ملف PNG في `audit/visual/` — فهرس كامل في `audit/capture-log.json`.

---

## 3. طريقة الفحص وحدودها

### ما نُفّذ فعلياً

- تشغيل المعاينة: **`npm run preview -- --port 4173`** (كان يعمل مسبقاً).
- أتمتة: **`audit/capture-visual-qa.mjs`** + Playwright Chromium (تبعيات في **`audit/`** فقط — لم تُعدَّل ملفات التطبيق).
- لكل مقاس: `fullPage` + لقطات `.site-header`, `.hero`, `#results`, `#services`, `#doctors`, `#philosophy`, `#booking`, `.site-footer`, `.mobile-cta` (حيث ظهر).
- **390px:** فتح قائمة الهاتف، لقطة `mobile-390-menu-open.png`، إغلاق، تنقل إلى `#doctors` (الـ hash أصبح `#doctors` — `capture-log.json`).
- **1440px:** نقرة «النتائج» في nav → `#results`؛ زر الهيرو الأساسي `href="#booking"`.
- **Console / page errors / failed requests:** **لا شيء** مسجّل في الجلسة.

### حدود مهمة (صدق التقرير)

1. **ليس `npm run dev`:** المعاينة = **build + preview**. الفروقات المحتملة عن التطوير (مسارات assets، timing) **غير مُختبرة**.
2. **الحركة:** قبل اللقطات، أُظهرت عناصر `[data-reveal]` بشكل ثابت (opacity 1) لتوحيد اللقطات — **الانطباع الأول للزائر (fade-in GSAP) لم يُصوَّر**.
3. **لا اختبار يدوي بشري** على جهاز حقيقي؛ **لا Lighthouse / axe**؛ **لا prefers-reduced-motion** بصرياً.
4. **إغلاق القائمة (390px):** الاختبار الآلي أبلغ `menuHidden: false` بعد «إغلاق» — **لم تُلتقط لقطة بعد الإغلاق**؛ يحتاج تأكيد يدوي (ثقة متوسطة لسلوك الإغلاق).
5. **CTA الهاتف على ≥768px:** غير مرئي بالتصميم — لقطة منفصلة **تعذّرت** (element not visible) — **متوقع**.

---

## 4. روابط / مسارات اللقطات (مرجع سريع)

| الغرض | مسار |
|--------|------|
| صفحة كاملة 1440 | `audit/visual/desktop-1440-full.png` |
| صفحة كاملة 390 | `audit/visual/mobile-390-full.png` |
| صفحة كاملة 1920 | `audit/visual/desktop-1920-full.png` |
| هيرو 1440 | `audit/visual/desktop-1440-hero.png` |
| نتائج 1440 / 390 | `audit/visual/desktop-1440-results.png`, `audit/visual/mobile-390-results.png` |
| أطباء 1920 / 390 | `audit/visual/desktop-1920-doctors.png`, `audit/visual/mobile-390-doctors.png` |
| خدمات / حجز / فوتر | `audit/visual/desktop-1440-services.png`, `...-booking.png`, `...-footer.png` |
| فلسفة | `audit/visual/desktop-1440-philosophy.png` |
| قائمة هاتف | `audit/visual/mobile-390-menu-open.png` |
| CTA ثابت | `audit/visual/mobile-320-mobile-cta.png` |
| سجل آلي | `audit/capture-log.json` |

---

## 5. تقييم عام (12 محوراً) — من اللقطات

| # | المحور | /10 | ثقة | دليل مختصر |
|---|--------|-----|-----|------------|
| 1 | الهوية والأصالة | **5.5** | مرتفع | tokens متماسكة؛ لكن «سهر» vs «س·ل»/«× ليان» يفكك العلامة (`footer` vs `header`) |
| 2 | التكوين والتوازن | **6** | مرتفع | هيرو desktop قوي؛ booking card يساراً مع فراغ 1920؛ philosophy list قريبة من حافة اللقطة |
| 3 | الطباعة العربية RTL | **7** | مرتفع | خطوط محمّلة؛ عناوين El Messiri واضحة؛ RTL سليم في اللقطات |
| 4 | الصور والقص | **6.5** | مرتفع | 3 صور حقيقية؛ hero `cover` مقبول mobile/desktop؛ diptych أطباء يعمل |
| 5 | الألوان والتباين | **6.5** | مرتفع | عاجي/أخضر داكن/شريط results أسود — متناسق لكن **انتقال حاد** بين أقسام |
| 6 | المسافات والإيقاع | **5.5** | مرتفع | فراغ **كبير** في services/results **بدون محتوى** يقرأ كفراغ وليس فخامة |
| 7 | نعومة الحواف | **7** | مرتفع | radius موحّد على صور الهيرو/الأطباء والبطاقات |
| 8 | الأزرار والتفاعلات | **5.5** | متوسط | أزرار pill خضراء متكررة؛ ghost متوقعة؛ تداخل CTA ثابت على mobile |
| 9 | التجاوب الفعلي | **6.5** | مرتفع | 7 مقاسات مُصوَّرة؛ tablet hero stack منطقي (`tablet-768-hero.png`) |
| 10 | UX والثقة | **4** | مرتفع | نصوص dev + placeholders + «واتساب» غير مفعّل |
| 11 | جودة التنفيذ | **6** | متوسط | لا أخطاء console؛ لكن polish UX (قائمة إغلاق، safe-area CTA) غير مؤكد بالكامل |
| 12 | الاتساق بين الأقسام | **5.5** | مرتفع | عائلة واحدة «تقريباً»؛ الفوتر وشريط النتائج يبدوان من مرحلة تصميم مختلفة عن الهيدر الجديد |

**ملاحظة:** الدرجات **لا تشمل** جودة محتوى طبي مستقبلي (before/after) — غير موجود.

---

## 6. تقييم منفصل لكل قسم

### 6.1 الهيدر

| | |
|--|--|
| **يعمل جيداً** | شريط عاجي صلب، «سهر» واضح، nav + زر حجز على 1440 (`desktop-1440-hero.png`). |
| **عادي / متوقع** | نمط sticky clinic bar + CTA أخضر — شائع. |
| **تكوين vs محتوى** | التكوين **سليم**؛ المشكلة ليست هنا. |
| **حواف / نعومة** | baseline رفيع — detail هادئ. |
| **هوية واحدة؟** | **جزئياً** — أقوى تعبير «سهر» من بقية الصفحة. |
| **قرار** | **تحسينات محدودة** (توحيد naming مع الفوتر/العنوان). |
| **أكبر تحسن بصري واحد** | إزالة أي بقايا visual language قديم من الفوتر/الtitle بدلاً من الهيدر. |

### 6.2 الهيرو

| | |
|--|--|
| **يعمل جيداً** | split layout desktop؛ صورة كبيرة rounded؛ تسلسل kicker → عنوان → lead → زرين (`desktop-1440-hero.png`). Mobile: صورة ثم نص (`mobile-320-hero.png`). |
| **عادي / متوقع** | «نص + صورتان/صورة + زر primary + ghost» — قالب premium clinic شائع. |
| **تكوين vs محتوى** | **التكوين** أقوى عنصر في الموقع؛ المحتوى قصير ومناسب. |
| **حواف / صور** | قص الصورة على mobile لا يبدو مبتوراً بشكل سيء في اللقطات. |
| **هوية** | kicker «سهر × ليان» vs brand «سهر» — **ازدواجية**. |
| **قرار** | **إبقاء الهيكل** + **polish محدود** (محاذاة 1920، ضبط kicker). |
| **أكبر تحسن** | قرار واحد للعلامة في السطر الأول (سهر فقط vs ثنائي) متسق مع الهيدر. |

### 6.3 نتائج المرضى `#results`

| | |
|--|--|
| **يعمل جيداً** | شريط داكن يميّز القسم؛ typography العنوان قوية؛ disclaimer «تختلف النتائج…» مناسب طبياً. |
| **عادي / متوقع** | empty state بإطار dashed + عنوان «قيد التجهيز» — **نمط SaaS/AI شائع**. |
| **تكوين vs محتوى** | **المشكلة محتوى/UX 90%**؛ الهيكل **قد** يلائم gallery لاحقاً **غير قابل للحكم** بدون صور حقيقية. |
| **حواف** | بطاقة dashed — neutral. |
| **هوية** | يخدم «دراما» بصرياً لكن **فارغ today** فيقتل momentum بعد الهيرo. |
| **قرار** | **إخفاء أو إعادة copy الزائر** حتى توفر cases؛ عند وجود صور: **polish** لا rebuild كامل. |
| **أكبر تحسن** | استبدال نص `config.js` بنص زائر + تقليل prominence أو نقل القسم للأسفل **إذا** بقي فارغاً. |

**ما لا يمكن الحكم عليه:** تخطيط before/after، balance بصري، ثقة طبية — **لا cases**.

### 6.4 الخدمات `#services`

| | |
|--|--|
| **يعمل جيداً** | رقم «02» editorial؛ خط فاصل؛ tone «نشرح عند الحجز» — صادق. |
| **عادي / متوقع** | قائمة services فارغة في مستطيل رمادي — **placeholder واضح**. |
| **تكوين vs محتوى** | **محتوى**؛ التكوين يبدو جاهزاً لصف rows لكن **غير مُختبر** ببيانات. |
| **قرار** | **تحسينات محدودة** على empty state؛ **polish** عند ملء `config.js`. |
| **أكبر تحسن** | إما ملء 4–6 خدمات حقيقية أو **دمج** مع philosophy/booking لتقليل «حفر» بصري. |

### 6.5 سهر وليان `#doctors`

| | |
|--|--|
| **يعمل جيداً** | Diptych؛ صورتان ظاهرتان على 1920/390؛ bios قصيرة؛ أزرار فردية. |
| **عادي / متوقع** | بطاقتا طبيب متطابقتان — شائع، لكن **أقل** من hero template. |
| **تكوين vs محتوى** | **تكوين جيد**؛ roles فارغة في config **لا تظهر** بقوة بصرياً. |
| **مشاكل بصرية** | عنوان القسم **مقصوص** تحت الهيدر عند دخول القسم (`desktop-1440-doctors.png` — masthead تحت sticky header). |
| **mobile** | **`.mobile-cta` يغطي** `.doctors__reserve` (`mobile-390-doctors.png`). |
| **قرار** | **إعادة تصميم جزئية** (scroll-margin + padding-bottom للـ safe area فوق CTA). |
| **أكبر تحسن** | `padding-bottom` على main/section + رفع z-index/layout أزرار الفريق **فوق** منطقة CTA. |

### 6.6 فلسفة العناية `#philosophy`

| | |
|--|--|
| **يعمل جيداً** | manifesto سطر واحد قوي؛ عمود manifesto + path steps — editorial. |
| **عادي / متوقع** | «3 خطوات مرقّمة» — شائع لكن acceptable. |
| **مشكلة تكوين** | في `desktop-1440-philosophy.png` يبدو **قرب/قص** لعمود الأرقام من الحافة — worth checking على جهاز حقيقي (مؤكد بصرياً على اللقطة، ثقة متوسطة للسبب: padding vs viewport). |
| **قرار** | **تحسينات محدودة** (padding-inline للـ path). |
| **أكبر تحسن** | محاذاة path مع grid الصفحة على 1440. |

### 6.7 الحجز `#booking`

| | |
|--|--|
| **يعمل جيداً** | بطاقة بيضاء ناعمة؛ رسالة قصيرة؛ CTA واحد واضح. |
| **عادي / متوقع** | «card in ivory sea» — نمط landing شائع. |
| **محتوى** | نص **«واتساب غير مفعّل… config.js»** ظاهر (`desktop-1440-booking.png`) — **P0 ثقة**. |
| **1920** | بطاقة **يسار** مع مساحة فارغة واسعة — يبدو **غير مقصود** كفخامة editorial. |
| **قرار** | **polish تخطيط** + **copy زائر**؛ لا rebuild كامل للفكرة. |
| **أكبر تحسن** | إخفاء رسالة dev + center/max-width panel على الشاشات العريضة. |

### 6.8 الفوتر

| | |
|--|--|
| **يعمل جيداً** | بسيط؛ contrast على dark footer. |
| **عادي / متوقع** | شريط أسود minimal — generic. |
| **مشاكل** | **`س·ل`** + placeholder عنوان (`desktop-1440-footer.png`) — **يبدو legacy** vs هيدر «سهر». |
| **قرار** | **إعادة تصميم جزئية** ليتماشى مع الهيدر الجديد. |
| **أكبر تحسن** | نفس wordmark «سهر» + contact حقيقي أو إخفاء السطر حتى التوفر. |

### 6.9 CTA الهاتف الثابت `.mobile-cta`

| | |
|--|--|
| **يعمل جيداً** | واضح، contrast جيد، full-width (`mobile-320-mobile-cta.png`). |
| **مشكلة** | **يحجب** محتوى تفاعلي في الأسفل (أطباء) — **مؤكد بصرياً**. |
| **≥768** | مخفي — **متوقع** (`style.css` media 768). |
| **قرار** | **تحسينات محدودة** (offset + `scroll-padding-bottom` على `body`). |
| **أكبر تحسن** | مسافة safe-area + shrink إلى pill أصغر بعد scroll (غير مُختبر). |

---

## 7. المشكلات حسب الأولوية

### P0 — يكسر الثقة / يضلل / يمنع وظيفة أساسية

| # | القسم | المشكلة | دليل | أثر | حل مقترح | حجم | ثقة |
|---|--------|---------|------|-----|----------|-----|-----|
| 1 | results | نص `src/config.js` للزائر | `desktop-1440-results.png` | يبدو موقع dev؛ يهدم credibility بعد CTA «شاهدي النتائج» | copy زائر أو إخفاء القسم | صغير–متوسط | مرتفع |
| 2 | booking | رسالة واتساب/config ظاهرة | `desktop-1440-booking.png` | زائر يظن العيادة غير جاهزة | إخفاء `data-config-note` حتى التفعيل | صغير | مرتفع |
| 3 | footer | `[العنوان والهاتف — يُضاف…]` | `desktop-1440-footer.png` | placeholder عام | إخفاء أو بيانات حقيقية | صغير | مرتفع |
| 4 | results | promises «قبل وبعد» بلا صور | `mobile-390-results.png` | توقع vs واقع | cases حقيقية أو تعديل IA | يعتمد assets | مرتفع |

### P1 — ضعف بصري/UX جوهري

| # | القسم | المشكلة | دليل | حل | حجم | ثقة |
|---|--------|---------|------|-----|-----|-----|
| 5 | identity | سهر vs س·ل × ليان | footer vs header لقطات | توحيد brand | متوسط | مرتفع |
| 6 | doctors | CTA ثابت يغطي أزرار الحجز | `mobile-390-doctors.png` | padding-bottom + layout | صغير | مرتفع |
| 7 | doctors | عنوان مقصوص تحت header | `desktop-1440-doctors.png` | scroll-margin-top للـ sections | صغير | مرتوسط |
| 8 | journey | results فارغ **بعد** hero قوي | `desktop-1920-full.png` | محتوى أو reorder | استراتيجي | مرتفع |
| 9 | booking | panel يسار على 1920 | `desktop-1440-booking.png` | center grid wide | صغير | مرتفع |

### P2

| # | القسم | المشكلة | دليل | حل | حجم |
|---|--------|---------|------|-----|-----|
| 10 | services | empty block كبير | `desktop-1440-services.png` | محتوى أو دمج أقسام | متوسط |
| 11 | philosophy | path قريب من الحافة | `desktop-1440-philosophy.png` | padding-inline | صغير |
| 12 | hero | kicker × ليان vs سهر | hero لقطات | copy/decision | صغير |
| 13 | menu | سلوك إغلاق غير مؤكد | `capture-log.json` menuHidden | اختبار يدوي + fix | صغير |

### P3

| # | مشكلة | دليل | حل |
|---|--------|------|-----|
| 14 | تكرار أزرار «احجزي موعدك» | عدة لقطات | تنويع label secondary |
| 15 | انتقال فجّ بين ivory و results black | full page | gradient bridge اختياري |

---

## 8. أقوى ثلاثة قرارات تصميمية **موجودة فعلاً**

1. **Hero canvas + عمود صورة** — أقل «gradient clinic AI» من many templates (`desktop-1440-hero.png`).
2. **Diptych الأطباء** — relationship بين الصورتين أقوى من card grid (`desktop-1920-doctors.png`).
3. **شريط results داكن** — يمهّد لgallery drama **عندما** يُملأ (الفكرة صحيحة؛ التنفيذ الحالي فارغ).

---

## 9. أضعف خمسة قرارات بصرية (بدليل)

1. **Empty results مع copy مطوّر** — `desktop-1440-results.png`.
2. **Footer legacy (`س·ل`)** — `desktop-1440-footer.png`.
3. **CTA ثابت بدون safe zone** — `mobile-390-doctors.png`.
4. **Services placeholder slab** — `desktop-1440-services.png`.
5. **Booking panel + dev note** — `desktop-1440-booking.png`.

---

## 10. التشابه مع الأنماط الشائعة / AI — **6 / 10**

| مؤشر | ملاحظة من اللقطات |
|------|-------------------|
| hero text+image+2 buttons | ✅ موجود — raises score |
| تبديل خلفية فاتح/داكن بين أقسام | ✅ results band |
| dashed empty state | ✅ results |
| rounded images + green CTA | ✅ متكرر |
| motion | **غير مُقيّم** في these screenshots |
| لحظات غير قابلة للنقل easily | **hero split + diptych** — partial originality |

**لتقليل التشابه:** fill results بصور حقيقية مcomposed؛ تقليل dashed boxes؛ توحيد brand؛ تخطيط booking wide-screen مقصود.

---

## 11. ما يجب **إبقاؤه**

- palette (ivory / accent green / ink).
- El Messiri + Alexandria (محمّلتان فعلياً).
- هيكل hero desktop + صورة `1000259883.jpg`.
- فكرة diptych doctors.
- صدق عدم invent نتائج وهمية (لكن **غيّر presentation** للزائر).

---

## 12. ما يستحق **تحسينات محدودة**

- scroll-margin للأقسام تحت sticky header.
- safe-area لـ `.mobile-cta`.
- philosophy path padding.
- booking centering على wide.
- empty states copy (بدون code paths).

---

## 13. ما يستحق **إعادة تصميم جزئية أو كاملة**

| القسم | مستوى | السبب |
|--------|--------|--------|
| Footer | **جزئية** | لا ينتمي لهيدر «سهر» |
| Results (presentation) | **جزئية** | empty state + موقع في الرحلة |
| Doctors mobile | **جزئية** | CTA overlap |
| Services | **جزئية–كاملة** حسب المحتوى | إن بقي فارغاً long-term — إعادة IA |
| Hero | **إبقاء** | rebuild غير مطلوب من اللقطات |

---

## 14. خطة تنفيذ (مرتبة بالأثر — **للمرحلة التالية، خارج هذا التدقيق**)

1. **P0 content/copy:** results + booking + footer — إزالة أي mention لـ `config.js` من UI.
2. **Assets:** إضافة cases حقيقية → إعادة QA لـ `#results` فقط.
3. **Brand pass:** footer/title/kicker alignment على «سهر».
4. **Mobile UX:** safe padding vs `.mobile-cta`.
5. **Wide layout:** booking + services spacing.
6. **Visual QA ثانٍ** بعد التغييرات — نفس مقاسات `audit/visual/`.

---

## 15. تدقيق النزاهة (المرحلة 7)

| سؤال | إجابة |
|------|--------|
| هل شاهدت الموقع فعلياً؟ | **نعم** — Playwright Chromium على localhost:4173 |
| هل التقطت الصور المذكورة؟ | **نعم** — 71 PNG في `audit/visual/` |
| هل اختبرت كل مقاس؟ | **نعم** — 320, 375, 390, 768, 1024, 1440, 1920 |
| القائمة والروابط؟ | **جزئياً** — فتح menu + nav `#doctors` على 390؛ `#results` على 1440؛ **إغلاق menu غير مؤكد بصرياً** |
| أحكام من الكود فقط؟ | **قليل** — mostly screenshots؛ CTA hidden ≥768 من CSS معروف + log timeout |
| أقسام لا يمكن تقييمها لنقص محتوى؟ | **نعم** — gallery results بصرياً؛ services list |

---

## 16. الحكم النهائي

1. **مستوى من يراه غريب:** freelance **mid+** UI polish، **ليس** agency launch-ready.
2. **مصمم بعناية vs مولّد:** **هيكل بعناية** + **محتوى/حالات كموقع under construction**.
3. **تشابه AI/قوالب:** **6/10**.
4. **جودة بصرية إجمالية:** **~5.8/10** (مع محتوى كامل قد ترتفع إلى ~7 إن results/services/booking اكتملت).
5. **أقسام 9/10؟** **لا** — لا section بلا placeholder أو ثغرة UX في اللقطات الحالية.
6. **أضعف 3 أقسام live:** results (empty+dev copy)، booking (dev+layout wide)، footer (legacy+placeholder).
7. **3 أخطاء «عادي»:** dashed empty state، green pill CTAs everywhere، dual-doctor symmetric cards pattern.
8. **أكبر قفزة واحدة:** **before/after حقيقي** في `#results` + إزالة dev copy.
9. **ما يمنع Awwwards:** نقص **محتوى بصري مCompleted**، لحظات تفاعل/حركة **غير مُقيّمة**، و**ثقة زائر** من broken journey.
10. **المشكلة الأساسية:** **محتوى + UX copy** أولاً، ثم **اتساق brand**، ثم polish تكوين (CTA overlap, scroll margins).

---

*تم إنشاء هذا التقرير دون تعديل `index.html`, `src/style.css`, `src/main.js`, أو `src/config.js`.*
