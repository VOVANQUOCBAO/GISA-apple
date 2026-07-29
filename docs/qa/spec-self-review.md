# GISA specification self-review

Date: 2026-07-18
Reviewer: CDX
Specification: `D:/web/docs/superpowers/specs/2026-07-18-gisa-website-redesign-design.md`

`PASS` means the frontend scope and its evidence are complete. `BLOCKED (production)` means the frontend uses the required safe omission, fallback, or disclosure, but production publication still requires an external approval. No blocked gate is represented as an approved exception.

| Section | Requirement reviewed | Task / implementation | Test or evidence | Status | Exception / production constraint |
| ---: | --- | --- | --- | --- | --- |
| 1 | Multi-page product; option-2 direction; no reference-image data; accessible/responsive/CMS-ready | Tasks 1–17; App Router, repositories, forms, search, responsive shell | Build, route E2E, final visual review | PASS | None |
| 2 | Use checked references and preserve evidence limits | Asset manifest, source register, route/redirect registry | Content/asset/source audit | PASS | Reference images are not public assets. |
| 3 | Complete routes/states, reduced repetition, no unsupported facts | Tasks 3–11, 17 | 70 unit/component; 103 E2E; audit 0 violations | PASS | Partner/contact/fee/title/impact fields remain omitted when unapproved. |
| 4 | No CMS/backend/payment/auth/bulk import/deployment | Tasks 1, 10, 16 | Environment example, form tests, CMS handoff | PASS | Production infrastructure is outside scope. |
| 5 | Leadership, research, learning, partner and community journeys | Hubs, listings, details, contextual CTAs | Route/list/detail/search/form E2E | PASS | Unverified partner/sponsor records are hidden. |
| 6 | Ten top-level destinations, canonical sitemap and 39 legacy menu paths | Tasks 4–5, route audit | Navigation/redirect tests and sitemap sweep | PASS | Detail URL inventory beyond 39 menu paths is a production gate. |
| 7 | Nine templates and exact home order with bounded 1–4 selections | Tasks 6–10 | Home/template tests, route E2E, responsive snapshots | PASS | Global recoverable error UI exists; framework loading UI is deferred until a real async source is enabled. |
| 8 | Shared shell/cards/list/form/SEO; one navigation source; no page fixture imports | Tasks 5–12 | Refined import scan and component tests | PASS | None |
| 9 | Shared schema, four evidence states and sourced representative records | Tasks 3, 9, 16, 17 | Zod contracts, source register, audit | PASS | Only `verified` and `provided_by_gisa` publish. |
| 10 | Four local-only simulated forms and all required states/focus | Task 10 | Form unit 4/4; forms E2E 6/6 | PASS | Real CRM/API and retention/privacy controls are outside scope. |
| 11 | Evidence-backed search/filter/pagination with URL/history/empty state | Tasks 8, 11 | Listings/search E2E; repository contract | PASS | Filters appear only for real collection metadata. |
| 12 | Brand voice, palette, logo, typography and approved imagery | Tasks 2, 7, 13, 17 | Tokens/assets tests; snapshots; visual review | BLOCKED (production) | No approval. GISA brand authority unassigned on 2026-07-18; vector logo, font, photos and 17-color rights block production. Temporary raster is labeled `temporary_internal_use`. |
| 13 | Vietnamese-first; no fake English; translation mapping | Tasks 3, 5 | `lang=vi`; disabled EN switch; schema contract | PASS | English stays disabled until reviewed content exists. |
| 14 | 390/768/1024/1440 layouts, no overflow, usable targets | Tasks 7, 13 | 36 snapshots; responsive E2E; matrix | PASS | None |
| 15 | WCAG 2.2 AA core flows | Tasks 5, 6, 10, 14 | axe, keyboard, zoom, spacing, reduced-motion, manual checklist | PASS | Repeat manual review when approved imagery/fonts arrive. |
| 16 | SEO/indexing/conditional structured data and CWV reliability | Tasks 12, 15 | SEO/cross-browser E2E; LCP 180ms, CLS 0, INP proxy 24ms | PASS | Field monitoring begins after deployment. |
| 17 | Repository/API/CMS boundary and independent form adapter | Task 16 | Shared HTTP/fixture contract; CMS handoff | PASS | No production endpoint or secret is configured. |
| 18 | Navigation/template/form/browser/accessibility/content/visual acceptance | Tasks 4–17 | Audit/lint/type/build pass; 70/70 unit; 103/103 E2E | PASS | None |
| 19 | Definition of done and handoff documents | Tasks 16–17 | CMS handoff, this review, readiness, matrix | PASS (frontend) | Production launch remains blocked by Section 20. |
| 20 | Twelve external production verification gates | Release-readiness gate table | Owner/evidence/state for every gate | BLOCKED (production) | No gate has approval evidence on 2026-07-18; safe omissions are implemented. |
| 21 | Three frontend phases complete without backend/bulk content expansion | Commits for Tasks 1–17 | Git history and final verification | PASS | Branch disposition awaits user choice. |

## Required focused checks

| Focus | Evidence | Result |
| --- | --- | --- |
| All menu/routes | 10 groups, 39 legacy paths, page/redirect audit, sitemap sweep | PASS |
| Nine templates | Home, hub, listing, article, project, course, expert, form, search | PASS |
| Home order | Header/hero/trust/about/RISES/pillars/gateways/collections/contact/footer | PASS |
| Four evidence states | Schema enum plus publish gate | PASS |
| Form simulation | Disclosure, validation, pending, success, error, retry, focus | PASS |
| Search/filter/pagination | URL normalization, history, pagination, no-result reset | PASS |
| Brand | Approved palette/fallback stacks; temporary logo and omitted photos explicit | BLOCKED (production) |
| Language | Vietnamese; English disabled with explanation | PASS |
| Four viewports | Functional and visual evidence at all required widths | PASS |
| WCAG | Automated serious/critical count zero plus manual checklist | PASS |
| SEO/performance | Production indexing, conditional data, CWV budget | PASS |
| CMS boundary | Optional HTTP adapter, fixture default, complete handoff | PASS |
| Definition of done | Six technical gates and handoff documents complete | PASS (frontend) |
| Twelve production gates | Every gate has owner/evidence state | BLOCKED (production) |

## Exception audit

- Approved exceptions: none.
- Unapproved constraints remain `BLOCKED (production)` with date, responsible authority and scope in `release-readiness.md`.
- The frontend uses omission, disabled controls, conservative disclosures or a manifest-labeled temporary asset. No substitute facts or approvals were invented.
