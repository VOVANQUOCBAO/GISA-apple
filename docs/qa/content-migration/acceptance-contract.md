# GISA production content-migration acceptance contract

Date locked: 2026-07-18

This contract is blocking. A later implementation or visual review cannot compensate for an incomplete discovery union, absent editorial approval, unresolved route, or unapproved media.

## Required equations

All counts refer to the same dated snapshot and must be reported as exact integers with each documented exclusion linked to its evidence.

```text
discovered_public_urls = fetched_urls + documented_fetch_exclusions
fetched_urls = normalized_records + redirect_aliases + documented_normalization_exclusions
approved_public_records = generated_public_records
approved_public_assets = referenced_public_assets
unresolved_public_urls = 0
```

Definitions:

- `discovered_public_urls` is the deduplicated union of sitemap, primary navigation, paginated listing, and embedded same-origin detail links.
- `fetched_urls` contains successful same-origin responses captured in the snapshot manifest; redirects to another origin are recorded for review rather than followed automatically.
- `normalized_records` and `redirect_aliases` account for every fetched public page not covered by a documented normalization exclusion.
- `approved_public_records` is the set of explicit human approvals eligible for publication; it must equal the generated public index exactly.
- `approved_public_assets` is the set of assets approved for web publication; it must equal the local assets referenced by generated public records and approved site settings exactly.
- `unresolved_public_urls` includes missing manifest rows, exhausted fetch failures without an approved exclusion, parser failures without an approved exclusion, and URLs without a canonical, one-hop redirect, or explicit exclusion outcome.

## Evidence rules

1. Every discovery-union URL has one manifest row and retains all discovery provenance values.
2. Every exclusion records the URL, stage, reason code, evidence, reviewer, and review date.
3. Every public record, organization field, contact, social profile, featured selection, metric, and media candidate has a stable approval entry.
4. Only GISA or the content owner may approve or reject editorial and rights decisions. The implementation agent must not self-approve them.
5. Every approved legacy URL resolves directly or through one permanent redirect to one indexable canonical destination; chains and loops fail acceptance.
6. Production rendering, search, sitemap, metadata, and JSON-LD read generated approved data through `ContentRepository`, never fixtures or raw imported records.
7. Every referenced public asset is local, checksum-verified, provenance-tracked, and approved for web use. Remote hotlinks and placeholders fail acceptance.
8. The locked Option 2 visual controls presentation only. It cannot authorize names, copy, claims, metrics, partners, contacts, people, or imagery.

## Blocking reports

The imported-stage report must show discovery-channel totals, fetch outcomes, normalization outcomes, content types, extraction confidence, duplicates, media candidates, issues, and exact exclusions. The published-stage report must show approval totals and prove the record and asset equations. Final coverage must also prove production responses for every discovery-union URL and generated canonical route.
