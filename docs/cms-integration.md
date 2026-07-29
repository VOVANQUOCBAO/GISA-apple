# CMS integration handoff

This frontend has no default production CMS endpoint and contains no CMS secret. `getContentRepository()` returns the checked fixture repository unless deployment explicitly sets both:

```dotenv
CONTENT_SOURCE=http
CONTENT_API_BASE_URL=https://cms.example.org/api/
```

`CONTENT_API_BASE_URL` must be an absolute HTTP(S) URL. A missing or invalid URL fails immediately when the repository is composed. The optional HTTP adapter appends the endpoints below to the configured base path; the example therefore requests `https://cms.example.org/api/content`.

## Transport contract

| Repository operation | HTTP request |
| --- | --- |
| `list` | `GET content?collection={collection}&page={n}&pageSize={n}&filter.{field}={value}` |
| `search` | `GET search?q={query}&collection={collection}&page={n}&pageSize={n}&filter.{field}={value}` |
| `getBySlug` | `GET content/{collection}/{slug}` |
| `getByPath` | `GET content?path={absolutePath}` |
| `listIndexablePaths` | paged `GET content?indexable=true&page={n}&pageSize=100` |

Detail endpoints return one content record or HTTP 404. List, search, and indexable responses use this envelope and return full content records; the adapter derives the smaller UI summary itself:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "pageSize": 12,
  "pageCount": 1,
  "availableFilters": { "topic": ["Phát triển bền vững"] }
}
```

Pagination is one-based. `page`, `pageSize`, `total`, and `pageCount` are integers; `page` and `pageSize` are positive, `total` is non-negative, and `pageCount` is at least one. The CMS clamps an out-of-range page to the last page. Filters are exact, case-normalized matches against metadata fields. Search trims and normalizes Vietnamese text and searches at least title, summary, and tags. Results use deterministic newest-first ordering with a stable title fallback. `availableFilters` describes values available before the current filters narrow the result.

## Content schema and field semantics

Every response crosses the same Zod `contentRecordSchema` boundary used by fixtures. Required record fields are:

| Field | Semantics |
| --- | --- |
| `id` | Stable CMS identifier; never reuse it for another record. |
| `kind` | Singular renderer kind: `project`, `publication`, `tool`, `course`, `expert`, `initiative`, `news`, `notice`, or `partner`. |
| `collection` | Plural collection matching the kind: `projects`, `publications`, `tools`, `courses`, `experts`, `initiatives`, `news`, `notices`, or `partners`. |
| `slug` | Non-empty route segment, unique within collection and locale. |
| `path` | Canonical public path beginning with `/`; redirects are maintained separately. |
| `locale` | `vi` or `en`. It describes this record, not browser preference. |
| `translationKey` | Stable key shared by translations of the same content. |
| `title`, `summary` | Non-empty plain text. Do not send HTML. |
| `body` | Ordered rich-text blocks defined below. |
| `publishedAt` | Optional ISO date (`YYYY-MM-DD`), not a free-form date. |
| `image` | Optional approved local asset descriptor. |
| `tags` | Array of non-empty public labels. |
| `evidenceStatus` | Editorial provenance state described below. |
| `sourceUrl`, `sourceLabel` | Absolute evidence URL and a human-readable source label. |
| `checkedAt` | ISO date of the last evidence review. |
| `metadata` | Filter/detail facts as string, string array, or omitted value. Never embed presentation markup. |

Unknown or malformed payloads fail at the adapter boundary; the UI never receives partially parsed CMS data.

## Evidence and publishing gate

Map CMS workflow states explicitly:

| Frontend status | Meaning | Public/indexable |
| --- | --- | --- |
| `verified` | Confirmed against an approved public source. | Yes |
| `provided_by_gisa` | Supplied and approved by GISA. | Yes |
| `strategic_proposal` | Proposed positioning or future content. | No |
| `needs_verification` | Incomplete or awaiting source review. | No |

The CMS must exclude previews, drafts, scheduled-but-unpublished records, and the two non-publishable evidence states from public endpoints. The adapter repeats the evidence gate as defense in depth for list, search, detail, and sitemap paths. `sourceUrl`, `sourceLabel`, and `checkedAt` remain required even when the source is GISA-provided.

## Rich text mapping

Rich text is an ordered array of typed blocks, not HTML:

- `{ "type": "paragraph", "text": "..." }`
- `{ "type": "heading", "level": 2, "text": "..." }` where level is `2` or `3`
- `{ "type": "list", "items": ["..."] }` with at least one non-empty item

Sanitize CMS rich text before mapping it. Unsupported embeds, scripts, iframes, inline styles, empty blocks, and arbitrary heading levels must be rejected or converted editorially before publishing. Links and richer media require a schema change, renderer, accessibility review, and contract test before the CMS may emit them.

## Assets, alt text, and rights

The record `image` object requires `src`, `alt`, positive integer `width`, and positive integer `height`. `src` must begin with `/`; the CMS integration must ingest or proxy approved files into the site-owned asset pipeline rather than return temporary remote URLs. Width and height are intrinsic pixels, not display dimensions.

Each ingested asset also needs an asset-manifest entry with source path, source type (`provided_by_gisa` or `verified_public_source`), rights status (`temporary_internal_use` or `approved_for_web`), review date, and notes. Production content may use only `approved_for_web` assets. Alt text must communicate the image purpose in the record locale; use an empty alt only for a deliberately decorative asset and document that decision in the manifest.

## Locale and translations

Vietnamese is the only currently complete public locale. An English record may be exposed only when all required fields, evidence, routes, metadata, assets, and QA are complete. Translations share `translationKey` but have distinct `id`, `slug`, `path`, localized text, source review, and possibly localized assets. Missing translations must not silently fall back to mixed-language fields.

## Cache and revalidation decision points

The adapter intentionally supplies no cache policy. Before enabling HTTP in production, the hosting/CMS owners must agree on:

- publication-to-live freshness target and a webhook or time-based revalidation strategy;
- cache keys including locale, collection, query, page, page size, and sorted filters;
- whether detail 404s are negatively cached and for how long;
- sitemap invalidation after publish, unpublish, path, or evidence-status changes;
- preview isolation so draft responses can never populate the public cache;
- stale-on-error behavior and rollback procedure.

Apply those decisions at the server composition/deployment layer. Do not add browser-side collection fetching or expose CMS credentials.

## Error behavior

`HttpContentRepository` reports transport boundary failures as `ContentSourceError`:

- `network`: fetch rejection or non-success response other than 404;
- `schema`: invalid JSON or a response that fails the shared Zod schema;
- `not_found`: HTTP 404 (nullable detail operations translate this to `null` to preserve repository semantics).

Configuration errors are explicit startup errors. Do not catch schema errors and render unverified fields. Production observability should log the error kind, endpoint path, status, and request correlation ID without logging secrets or personal data.

## Form adapter replacement

Content transport does not enable real form submission. Forms currently default to `SimulatedFormAdapter`, and their disclosure promises that data does not leave the browser. A production submission integration must implement `FormSubmissionAdapter.submit(FormInput)`, add server-side validation, consent evidence, spam/rate controls, retention/deletion rules, secure error handling, and an approved privacy notice. Replace the injected adapter only after those controls exist; update the simulated wording and tests in the same release.

## Contract proof

Run the fixture and mocked HTTP implementations through the same contract:

```powershell
corepack pnpm test src/content/repositories
```

The boundary tests also prove rejection of malformed payloads, typed network/not-found errors, the default fixture composition, and explicit HTTP environment validation. Application code imports `getContentRepository`/`ContentRepository`; only repository tests and composition code may import fixtures directly.

## Checklist: add a content type

- Add the singular `kind` and plural `collection` to TypeScript and Zod enums.
- Define required metadata semantics, evidence source, route, and template mapping.
- Add fixture coverage and make both repositories pass the shared contract.
- Add list/detail/search, sitemap, SEO, accessibility, responsive, and content-audit coverage.
- Define CMS model permissions, draft exclusion, filters, ordering, and migration/rollback.
- Approve asset rights, alt text rules, and any new rich-text blocks.
- Update this handoff before enabling the type in production.

## Checklist: add a locale

- Add the locale to TypeScript/Zod and define canonical/hreflang routing.
- Require a stable `translationKey` and complete localized fields; forbid silent fallback.
- Localize metadata, validation, forms, navigation, structured data, alt text, and source labels.
- Define CMS translation workflow, review ownership, publish/unpublish coupling, and preview isolation.
- Run repository contract, route, SEO, accessibility, responsive, visual, and content audits for the locale.
- Enable the language switch only after the release checklist passes.
