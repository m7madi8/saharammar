# Temporary results gallery — image license log

These assets are **illustrative only**. They are **not** clinical outcomes of Sahar × Layan dental clinic.

Local crops live in `public/images/results/temporary/`. Source composites are kept in `public/images/results/temporary/source/` for traceability.

To switch to real clinic cases: set `results.activeSet` to `'clinic'` and populate `results.clinicCases` (each entry must have `source: 'clinic'`). Do **not** reuse temporary paths in `clinicCases`.

---

## case-feldspathic-before.jpg / case-feldspathic-after.jpg

| Field | Value |
| --- | --- |
| **Description** | Same patient: anterior crowns replaced with feldspathic VM9 porcelain (before / after). |
| **Local files** | `case-feldspathic-before.jpg`, `case-feldspathic-after.jpg` |
| **Source composite** | `source/feldspathic-crowns-composite.jpg` |
| **Source page** | https://commons.wikimedia.org/wiki/File:Feldspathic_VM9_Porcelain_Crowns.jpg |
| **Original file URL** | https://upload.wikimedia.org/wikipedia/commons/6/6f/Feldspathic_VM9_Porcelain_Crowns.jpg |
| **Author** | AmirAttallah |
| **License** | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| **Attribution** | AmirAttallah / Wikimedia Commons (CC BY-SA 4.0). Composite cropped into before (top) and after (bottom) halves. Watermark on source: “AMIR ATTALLAH DENTAL STUDIO”. |
| **Commercial use** | Allowed with attribution and ShareAlike on derivatives. |
| **Modification** | Cropping permitted under license; documented here. |

---

## case-gingivitis-before.jpg / case-gingivitis-after.jpg

| Field | Value |
| --- | --- |
| **Description** | Same patient: severe gingivitis before and after scaling. |
| **Local files** | `case-gingivitis-before.jpg`, `case-gingivitis-after.jpg` |
| **Source composite** | `source/gingivitis-composite.jpg` |
| **Source page** | https://commons.wikimedia.org/wiki/File:Gingivitis_before_and_after.jpg |
| **Original file URL** | https://upload.wikimedia.org/wikipedia/commons/7/78/Gingivitis_before_and_after.jpg |
| **Author** | DRosenbach (English Wikipedia / Wikimedia Commons) |
| **License** | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| **Attribution** | DRosenbach / Wikimedia Commons (CC BY-SA 3.0). Composite cropped into before (top) and after (bottom) halves. |
| **Commercial use** | Allowed with attribution and ShareAlike on derivatives. |
| **Modification** | Cropping permitted under license; documented here. |

---

## case-open-bite-before.jpg / case-open-bite-after.jpg

| Field | Value |
| --- | --- |
| **Description** | Same patient: orthodontic treatment of anterior open bite (before / after). |
| **Local files** | `case-open-bite-before.jpg`, `case-open-bite-after.jpg` |
| **Source composite** | `source/open-bite-composite.jpg` |
| **Source page** | https://commons.wikimedia.org/wiki/File:Treat_open_bite.jpg |
| **Original file URL** | https://upload.wikimedia.org/wikipedia/commons/9/94/Treat_open_bite.jpg |
| **Author** | Jeffrey Dorfman |
| **License** | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| **Attribution** | Jeffrey Dorfman / Wikimedia Commons (CC BY-SA 3.0). Composite cropped into left (before) and right (after) halves. |
| **Commercial use** | Allowed with attribution and ShareAlike on derivatives. |
| **Notes** | Original upload sourced from nycdentist.com; Commons uploader states CC BY-SA 3.0 on the file page. Resolution 600×211 — suitable for secondary grid, not hero. |

---

## case-orthodontic-before.jpg / case-orthodontic-after.jpg

| Field | Value |
| --- | --- |
| **Description** | Same patient: before and after removable orthodontic retainers / braces treatment. |
| **Local files** | `case-orthodontic-before.jpg`, `case-orthodontic-after.jpg` |
| **Source composite** | `source/orthodontic-braces-composite.jpg` |
| **Source page** | https://commons.wikimedia.org/wiki/File:Before_and_After_Photos_following_Orthodontic_Treatment_-_Teeth_Braces.jpg |
| **Original file URL** | https://upload.wikimedia.org/wikipedia/commons/4/4f/Before_and_After_Photos_following_Orthodontic_Treatment_-_Teeth_Braces.jpg |
| **Author** | Jeffrey Dorfman |
| **License** | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| **Attribution** | Jeffrey Dorfman / Wikimedia Commons (CC BY-SA 3.0). Composite cropped into left (before) and right (after) halves. |
| **Commercial use** | Allowed with attribution and ShareAlike on derivatives. |
| **Notes** | Resolution 600×207 — low; used as secondary example only. |

---

## Images considered but not used

| Source | Reason |
| --- | --- |
| Clinic website uploads without clear Commons license verification | Rejected |
| AI / stock without verifiable same-patient pairs | Rejected |
| `-5-CL-before and after.jpg` | Dental radiograph simulation, not clinical photography — poor fit for patient-facing gallery |
| `Treatment_Steps_for_Feldspathic_VM9_Porcelain_Crowns.jpg` | Multi-step panel; kept source copy optional; display uses dedicated before/after composite instead |

---

## Regenerating crops

```powershell
powershell -ExecutionPolicy Bypass -File scripts/split-temporary-results.ps1
```
