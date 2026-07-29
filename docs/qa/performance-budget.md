# GISA frontend performance budget

## Fixed measurement profile

- Date: 2026-07-18
- Reviewer: CDX
- OS: Microsoft Windows NT 10.0.26200.0
- Browser: Playwright Chromium 149.0.7827.55 (Playwright 1.61.1)
- Viewport: 1440×900 CSS pixels
- Server: local Next.js production build (`pnpm build && pnpm start`)
- CPU/network: host CPU, unthrottled loopback network; one Playwright worker; retries disabled
- Route: `/`
- Interaction: open the first desktop submenu, then close it with Escape

## Budgets and measurement

| Metric | Budget | Measured | Status |
| --- | ---: | ---: | --- |
| Largest Contentful Paint (LCP) | ≤ 2500 ms | 156 ms | PASS |
| Cumulative Layout Shift (CLS) | ≤ 0.1 | 0 | PASS |
| Interaction to Next Paint proxy (longest Event Timing duration) | ≤ 200 ms | 32 ms | PASS |

`tests/e2e/performance.spec.ts` installs buffered `PerformanceObserver` instances before navigation, records LCP and layout shifts, then records the longest Event Timing duration for the audited interaction. The interaction metric is a deterministic local INP proxy; production field INP must still be monitored with real-user data after deployment.

The initial production measurement met every budget, so no speculative optimization was applied. The recorded values are both the before and after baseline for Task 15; future changes must be measured with the same profile before comparison.

Reliability budgets are zero failed requests, zero uncaught page errors, zero browser-console errors, zero remote image requests to `gisa.edu.vn` or mockup domains, and explicit intrinsic dimensions on every rendered `<img>`. The home page must not issue client fetch/XHR requests for content collections.
