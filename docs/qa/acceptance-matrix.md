# GISA responsive acceptance matrix

Date: 2026-07-18
Browser: Chromium, Playwright `chromium` project on Windows
Reviewer: CDX

## Production migration blocking gates

These gates supersede representative-fixture acceptance for the production migration. `PASS` is allowed only when the cited dated evidence proves the complete discovery union and human approval state.

| Gate | Blocking acceptance condition | Current result | Required evidence |
| --- | --- | --- | --- |
| Content coverage | Every sitemap, navigation, paginated-listing, and embedded-link URL has one outcome; all migration equations pass and `unresolved_public_urls = 0`. | PENDING | Snapshot manifest, imported coverage report, final coverage report, `content:verify`. |
| Manual approval | Every public record and site-setting field has an explicit GISA/content-owner decision; the agent did not self-approve any item. | PENDING | Content and site-setting approval manifests with reviewer, date, and notes. |
| Media provenance | Every referenced public asset is real, local, checksum-verified, source-tracked, and approved for web use. | PENDING | Asset approval manifest, public asset manifest, media verification report. |
| Canonical redirects | Every approved legacy URL is canonical or performs exactly one permanent redirect to a working canonical route; no chain, loop, or duplicate canonical exists. | PENDING | Generated route manifest and full-route production-server coverage. |
| Option 2 fidelity | Same-state side-by-side QA has no actionable P0/P1/P2 finding and `design-qa.md` ends with exactly `final result: passed`. | PENDING | Locked visual, normalized comparison images, focused crops, comparison history, Design QA report. |
| No production fixtures | App routes, components, search, sitemap, and metadata use only compiled approved content through `ContentRepository`. | PENDING | Content audit, dependency/import scan, production build and rendered-output scan. |

## Final 1440px visual comparison

Evidence reviewed on 2026-07-18:

- Implemented home: `tests/e2e/responsive.spec.ts-snapshots/home-1440-chromium-win32.png` (1440×6504).
- Layout reference: `D:/web/design-references/gisa-landing-option-2.png` (781×2012; reference only, not a content source).
- Previous public home: `D:/web/image-audit/current-gisa-home.png` (1440×7124).

| Criterion | Observation | Result |
| --- | --- | --- |
| Two-column hero | Value statement on the left and a compact consultation CTA on the right preserve option-2 hierarchy without its skyline or meeting imagery. | PASS |
| Palette | Deep teal, white, mist, navy and restrained orange accents follow the approved tokens and readable contrast. | PASS |
| Whitespace/rhythm | Alternating regions, bounded grids and clear headings create a calmer scan path than the legacy card wall. | PASS |
| CTA | Hero and closing actions are prominent without unsupported submission claims. | PASS |
| Content integrity | No reference-created image, partner, contact, fee or metric was copied; the only image is the manifest-controlled temporary GISA logo. | PASS |
| Legacy comparison | The new capture is 620px (about 8.7%) shorter, removes repeated logo/card clusters, and retains entry points to every group through navigation, gateways and selected collections. | PASS |

Reviewer: CDX · 2026-07-18. No frontend visual exception was approved or required; production brand/photo gates remain blocked in `release-readiness.md`.

Each row was checked by `tests/e2e/responsive.spec.ts` for horizontal overflow,
exactly one visible `h1`, and the skip link as the first keyboard focus target.
The committed full-page snapshot was then reviewed for clipped text, sticky
overlap, and cards that became too narrow. `PASS` below means both automated
checks and that visual review completed.

| Route | Template | Viewport | Overflow | Heading | Focus | Visual | Snapshot | Reviewer/date |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| `/` | Home | 390×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/home-390-chromium-win32.png` | CDX · 2026-07-18 |
| `/nghien-cuu` | Hub | 390×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/hub-390-chromium-win32.png` | CDX · 2026-07-18 |
| `/nghien-cuu/du-an` | Listing | 390×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/listing-390-chromium-win32.png` | CDX · 2026-07-18 |
| `/nghien-cuu/du-an/trade4sd` | Project detail | 390×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/project-390-chromium-win32.png` | CDX · 2026-07-18 |
| `/tin-tuc/tai-chinh-khi-hau-va-phat-trien` | Article detail | 390×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/article-390-chromium-win32.png` | CDX · 2026-07-18 |
| `/khoa-hoc/ke-toan-thuc-hanh-va-toi-uu-hoa-thue` | Course detail | 390×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/course-390-chromium-win32.png` | CDX · 2026-07-18 |
| `/chuyen-gia/nguyen-minh-khoi` | Expert detail | 390×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/expert-390-chromium-win32.png` | CDX · 2026-07-18 |
| `/cong-dong/sang-kien-kinh-te-ben-vung` | Initiative detail | 390×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/initiative-390-chromium-win32.png` | CDX · 2026-07-18 |
| `/dang-ky/tu-van` | Form | 390×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/form-390-chromium-win32.png` | CDX · 2026-07-18 |
| `/` | Home | 768×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/home-768-chromium-win32.png` | CDX · 2026-07-18 |
| `/nghien-cuu` | Hub | 768×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/hub-768-chromium-win32.png` | CDX · 2026-07-18 |
| `/nghien-cuu/du-an` | Listing | 768×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/listing-768-chromium-win32.png` | CDX · 2026-07-18 |
| `/nghien-cuu/du-an/trade4sd` | Project detail | 768×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/project-768-chromium-win32.png` | CDX · 2026-07-18 |
| `/tin-tuc/tai-chinh-khi-hau-va-phat-trien` | Article detail | 768×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/article-768-chromium-win32.png` | CDX · 2026-07-18 |
| `/khoa-hoc/ke-toan-thuc-hanh-va-toi-uu-hoa-thue` | Course detail | 768×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/course-768-chromium-win32.png` | CDX · 2026-07-18 |
| `/chuyen-gia/nguyen-minh-khoi` | Expert detail | 768×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/expert-768-chromium-win32.png` | CDX · 2026-07-18 |
| `/cong-dong/sang-kien-kinh-te-ben-vung` | Initiative detail | 768×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/initiative-768-chromium-win32.png` | CDX · 2026-07-18 |
| `/dang-ky/tu-van` | Form | 768×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/form-768-chromium-win32.png` | CDX · 2026-07-18 |
| `/` | Home | 1024×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/home-1024-chromium-win32.png` | CDX · 2026-07-18 |
| `/nghien-cuu` | Hub | 1024×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/hub-1024-chromium-win32.png` | CDX · 2026-07-18 |
| `/nghien-cuu/du-an` | Listing | 1024×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/listing-1024-chromium-win32.png` | CDX · 2026-07-18 |
| `/nghien-cuu/du-an/trade4sd` | Project detail | 1024×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/project-1024-chromium-win32.png` | CDX · 2026-07-18 |
| `/tin-tuc/tai-chinh-khi-hau-va-phat-trien` | Article detail | 1024×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/article-1024-chromium-win32.png` | CDX · 2026-07-18 |
| `/khoa-hoc/ke-toan-thuc-hanh-va-toi-uu-hoa-thue` | Course detail | 1024×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/course-1024-chromium-win32.png` | CDX · 2026-07-18 |
| `/chuyen-gia/nguyen-minh-khoi` | Expert detail | 1024×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/expert-1024-chromium-win32.png` | CDX · 2026-07-18 |
| `/cong-dong/sang-kien-kinh-te-ben-vung` | Initiative detail | 1024×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/initiative-1024-chromium-win32.png` | CDX · 2026-07-18 |
| `/dang-ky/tu-van` | Form | 1024×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/form-1024-chromium-win32.png` | CDX · 2026-07-18 |
| `/` | Home | 1440×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/home-1440-chromium-win32.png` | CDX · 2026-07-18 |
| `/nghien-cuu` | Hub | 1440×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/hub-1440-chromium-win32.png` | CDX · 2026-07-18 |
| `/nghien-cuu/du-an` | Listing | 1440×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/listing-1440-chromium-win32.png` | CDX · 2026-07-18 |
| `/nghien-cuu/du-an/trade4sd` | Project detail | 1440×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/project-1440-chromium-win32.png` | CDX · 2026-07-18 |
| `/tin-tuc/tai-chinh-khi-hau-va-phat-trien` | Article detail | 1440×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/article-1440-chromium-win32.png` | CDX · 2026-07-18 |
| `/khoa-hoc/ke-toan-thuc-hanh-va-toi-uu-hoa-thue` | Course detail | 1440×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/course-1440-chromium-win32.png` | CDX · 2026-07-18 |
| `/chuyen-gia/nguyen-minh-khoi` | Expert detail | 1440×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/expert-1440-chromium-win32.png` | CDX · 2026-07-18 |
| `/cong-dong/sang-kien-kinh-te-ben-vung` | Initiative detail | 1440×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/initiative-1440-chromium-win32.png` | CDX · 2026-07-18 |
| `/dang-ky/tu-van` | Form | 1440×900 | PASS | 1 h1 | Skip first | PASS | `tests/e2e/responsive.spec.ts-snapshots/form-1440-chromium-win32.png` | CDX · 2026-07-18 |
