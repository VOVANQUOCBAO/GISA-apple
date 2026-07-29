# WCAG 2.2 AA manual accessibility audit

- Date: 2026-07-18
- Reviewer: CDX
- OS: Microsoft Windows NT 10.0.26200.0
- Browser: Playwright Chromium 149.0.7827.55 (Playwright 1.61.1)
- Scope: core header, navigation, search, filters, pagination, forms, and the nine representative template routes in `tests/e2e/accessibility.spec.ts`
- Automated baseline: 9/9 representative routes have zero serious or critical axe violations; no axe rule is disabled.

| Check | Method and evidence | Result | Issue / exception |
| --- | --- | --- | --- |
| Keyboard: header and mega menu | Tab/focus the desktop menu trigger, Enter opens it, Escape closes it and restores focus. Covered by `accessibility.spec.ts` and `navigation.spec.ts`. | PASS | None |
| Keyboard: mobile menu | At 390×844, the dialog opens from its trigger, retains keyboard focus, expands a submenu, and Escape closes it back to the trigger. Covered by `navigation.spec.ts`. | PASS | None |
| Keyboard: search | Search has a programmatic label; Enter submits the query and browser history remains usable. Covered by `search.spec.ts`. | PASS | None |
| Keyboard: filters and pagination | Filter and pagination links are native anchors, expose current state, remain in the tab order, and have real destinations. Covered by `search.spec.ts`, `listings.spec.ts`, and the axe route audit. | PASS | None |
| Keyboard: form | All fields are label-addressable; Space selects the disclosure checkbox; Tab reaches submit; Enter submits the local simulation. Covered by `forms.spec.ts`. | PASS | None |
| Visible focus and sticky header | Global 3px focus outline is visible. The first Tab exposes the skip link inside the viewport; menu focus is not covered by the sticky header. Covered by `accessibility.spec.ts`. | PASS | None |
| Zoom 200% | A 1440×900 desktop viewport reduced to its 200% CSS viewport (720×450) reflows all nine representative routes with one visible `h1` and no horizontal overflow. | PASS | None |
| Text spacing | WCAG spacing overrides (line height 1.5, paragraph spacing 2×, letter spacing 0.12em, word spacing 0.16em) were injected at 390×844 on the form flow; content reflowed without horizontal overflow or clipped controls. | PASS | None |
| Screen-reader names and labels | Axe accessible-name/label checks pass on all representative routes. Search, navigation dialogs, pagination, filters, and form controls expose explicit names. | PASS | None |
| Error summary | Invalid form submission focuses the alert summary; each message links to its field and fields expose `aria-invalid`. Covered by `forms.spec.ts`. | PASS | None |
| Document language | Root document exposes `lang="vi"`; checked in browser and by axe. | PASS | None |
| Image alternatives | No rendered image lacks an `alt` attribute on representative routes; axe image-alt checks pass. Decorative and content image treatment follows the asset manifest. | PASS | None |
| Reduced motion | With `prefers-reduced-motion: reduce`, animation/transition durations collapse and smooth scrolling computes to `auto`. Covered by `accessibility.spec.ts`. | PASS | None |
| Touch target | Mobile filter and pagination controls measure at least 44×44 CSS pixels; navigation and form controls use the same minimum target. Covered by `responsive.spec.ts`. | PASS | None |
| Color and Orange/white | `#F26F33` on white is 2.96:1 and is not used as normal text or white-text background. Interactive orange surfaces use `#1A1A1A` text at 5.88:1; axe contrast checks pass. | PASS | None |

No blocking WCAG 2.2 AA issue remains in the audited core flows. Future real content and replacement brand assets must be re-audited for alternative text, language, and contrast before publication.
