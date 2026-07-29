# Option 2 layout specification

Date locked: 2026-07-18

Selected concept: Option 2 — “Knowledge in Motion”

Visual truth: `docs/design-targets/gisa-option-2-knowledge-in-motion.png`

## Interpretation contract

The locked 829×1898 PNG controls composition, hierarchy, typography, spacing, palette, and component character. Its measured vertical regions are normalized proportionally to a 1440px-wide desktop canvas in `design-target.json`; those measurements establish the initial section proportions, not a fixed page height. Responsive layouts must preserve hierarchy and rhythm at 1024, 768, and 390px without scaling the desktop page as a single image.

Approved real content may change line wrapping and section height. Copy length, omitted optional fields, typography-first media fallbacks, and other content-safety deviations may differ from the mock only when the relevant content or fallback has been approved by GISA or the content owner. The mock is never a factual source.

## Region measurements

| Region | Source y/height | 1440px y/height | Composition to preserve |
| --- | ---: | ---: | --- |
| Header | 0 / 57 | 0 / 99 | Compact white institutional header, natural-ratio logo, primary navigation, restrained orange consultation CTA. |
| Hero | 57 / 310 | 99 / 538 | Two-column editorial lead: headline and actions at left; approved real media or typography-first fallback plus compact enquiry form at right. |
| Activity strip | 367 / 79 | 637 / 137 | Six concise gateways in one quiet horizontal band on desktop, adapting to a readable grid on narrow screens. |
| Impact journey | 446 / 262 | 774 / 455 | “Từ tri thức đến tác động” process on the left and a large approved brand/real-artwork focal area on the right. |
| RISES | 708 / 136 | 1229 / 236 | Five evenly weighted values with strong initials and restrained dividers. |
| Six pillars | 844 / 239 | 1465 / 415 | Two rows of three editorial pillar summaries with library icons and colored rules. |
| Featured work | 1083 / 215 | 1880 / 373 | Balanced media/text split with taxonomy, approved summary, metadata, and canonical full-card action. |
| Conditional metrics | 1298 / 95 | 2253 / 165 | Full-width deep-teal band; render only when every displayed metric is separately approved. |
| Insights | 1393 / 244 | 2418 / 424 | Section heading plus one leading story and a compact latest-story column, using approved real media or image-free variants. |
| Consultation process | 1637 / 109 | 2842 / 189 | Five connected, numbered steps with short labels and descriptions; the sequence must remain legible without relying on color alone. |
| CTA | 1746 / 50 | 3031 / 87 | Narrow deep-teal conversion band with one clear consultation action. |
| Footer | 1796 / 102 | 3118 / 178 | Dense but readable institutional footer using only approved organization and social settings. |

## Visual system

- Headings use a high-contrast editorial serif; body, labels, navigation, forms, and metadata use a humanist sans serif. Task 25 locks Source Serif 4 and Source Sans 3 locally.
- Deep teal and white carry most surfaces. Orange is reserved for primary conversion actions and limited emphasis; green, blue, and navy organize secondary concepts.
- Desktop sections use a centered content grid, generous white space, fine rules, restrained borders, and minimal elevation. Decorative gradients and code-drawn motifs are not permitted.
- The supplied GISA logo and approved real media retain their natural aspect ratio. Standard concepts use the selected icon library, not handcrafted SVG, CSS art, emoji, or glyph substitutes.
- Optional bands disappear cleanly when their factual inputs or media are not fully approved. No placeholder, mock metric, or “đang cập nhật” substitute may occupy the gap.

## Responsive acceptance

- At 1440px, preserve the measured region proportions and editorial density above.
- At 1024px, reduce columns deliberately while keeping the hero, featured story, and latest-story hierarchy clear.
- At 768px, stack complex two-column regions and keep activity/pillar/process groups as bounded readable grids.
- At 390px, use a single content column, full-width touch targets where appropriate, no horizontal overflow, and no clipped persistent controls.
- Motion must respect `prefers-reduced-motion`; the design does not require autoplay or decorative animation.
