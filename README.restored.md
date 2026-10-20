# GISA: recovered source with VI/EN

This branch restores the complete source uploaded to Vercel on October 1, 2026, then adds English to that restored version. The deployment contained changes that were absent from its referenced GitHub commit.

- Source deployment: `dpl_AYGepZkCJmRZAKk3SYUbUXMmyzjG`.
- Recovery checkpoint: `0db1ad4` (before reapplying English).
- All 606 recovered deployment source files were checked against their SHA-1 identifiers.
- The original content records, supplied homepage banners, activity photographs, and all 14 expert portraits are preserved.
- English covers the previously supplied introduction, research, consulting, sponsor content, homepage, and restored expert profiles. Other sections retain Vietnamese. Text embedded in supplied artwork remains in the original artwork.
- The language selector retains the current route, filters, and page number.

## Local preview

Use Node.js 22 and pnpm 10:

```sh
pnpm install --frozen-lockfile
pnpm dev -- --port 3004
```

Open http://localhost:3004 and select VI or EN.

This review branch is separate from `main`; it has not been promoted to gisa.edu.vn.
