# Information Technology Page — Section-by-Section Review (2025-10-10)

This review covers the entire `programs/informationtechnology.html` page. It lists quick wins you can apply immediately and deeper refactors to consider next. No functional changes have been made yet beyond a safe backup.

## Summary
- Visual hierarchy and content are strong. The page already feels premium and data-driven.
- Main improvement themes:
  - Accessibility and semantics (landmarks, aria states, focus management)
  - Performance polish (debounce, lazy rendering, pagination defaults)
  - Consistency and maintainability (CSS tokens, utilities, small utilities extraction)
  - Subtle UX tightening (copy, micro-hints, error/empty states, share/URL state)

## 1) Global/Nav
Quick wins:
- Add `aria-current="page"` on the active Programs link.
- Toggle button should have `aria-expanded`, `aria-controls` pointing to the menu, and a label like `aria-label="Toggle menu"`.
- Add a skip link to jump to the main content.

Next steps:
- Extract the nav to a shared partial if multiple pages reuse it; keep active highlighting by path.

## 2) Hero
Quick wins:
- Wrap the stats in a `<section aria-labelledby="hero-stats-h">` and add an `id`ed heading for screen readers.
- Ensure the decorative backgrounds have `aria-hidden="true"` and `role="presentation"` on purely decorative elements.
- Reduce animation on `prefers-reduced-motion: reduce`.

Next steps:
- Consider reducing min-height on small screens to avoid push-below-the-fold interactions.

## 3) Framework Selection
Quick wins:
- Add `role="button" tabindex="0"` to the cards, and key handlers for Enter/Space; ensure the “Choose …” button remains the primary control.
- Include small helper text below price: “All-inclusive level bundle. Override in assets/data/pricing.json.”
- Use a consistent numeric format for ranges (e.g., en-US).

Next steps:
- Move the click handler from inline `onclick` to delegated JS to improve separation.

## 4) Category Overview
Quick wins:
- The dynamic vendor/focus badges are excellent. Add `aria-label` to badges: `Filter by vendor X` and `Filter by focus Y`.
- Ensure the entire card is not clickable to avoid accidental filter changes; keep clicks on badges/tags only.

Next steps:
- Consider small per-category icons swapped via CSS var if needed for theming.

## 5) Advanced Filtering
Quick wins:
- Add labels with `for` attributes for all selects and inputs; keep the visuals but ensure explicit association.
- Debounce search input (200–300ms) to avoid excessive rerenders.
- Persist `groupBy` and `densityToggle` in URL state.
- Default PAGE_SIZE 18 or 24 for desktop; keep 12 on mobile.
- Ensure `aria-live="polite"` on results count and selection summary is already set—good; add on pagination updates.

Next steps:
- Optional: add a compact “Filters” summary bar on mobile that opens a modal sheet.

## 6) Results Cards
Quick wins:
- Move inline styles to CSS classes for consistency and caching.
- On “Why?” popover, add focus trap and close on Escape; ensure the popover is announced via `role="dialog"` or `aria-modal="true"`.
- Add a `Remove` state for selected items at current level; keep previous-level items `Locked`.
- Display vendor area chip only when it differs from the filter to avoid repetition.

Next steps:
- Small card skeleton shimmer while fetching or paginating.

## 7) L1 Guidance and Prereq Nudges
Quick wins:
- Great content. Make the “What’s this?” open the same modal component with a dedicated `id` and restore expanded/collapsed states across rerenders.

Next steps:
- Track dismissals in `sessionStorage` to avoid repeating long nudges.

## 8) Vendor Area
Quick wins:
- Ensure `vendorAreaFilter` is hidden unless a vendor is selected; it already toggles—good. Also reset when vendor changes.

Next steps:
- Consider a chips-based multi-select for areas where vendors have many domains (e.g., Microsoft).

## 9) Quote Panel
Quick wins:
- “Export Lx (JSON/CSV)” works. Add total across selected levels and a “Copy Link” inside the summary for discoverability.
- Add a small note when counts are zero to guide the user on how to select.

Next steps:
- Provide a print stylesheet to format nicely.

## 10) Footer
Quick wins:
- Add `rel="noopener"` to external links already present—good.
- Include structured data (Organization) in `<script type="application/ld+json">` optionally.

Next steps:
- Move footer into a shared include if you template other pages similarly.

## 11) Performance & Safety
Quick wins:
- Add a tiny debounce to `applyFilters` triggers; guard with a queued raf+timeout combo.
- Lazy-load logos with `loading="lazy"` (already present) and ensure sizes are fixed to avoid CLS.

Next steps:
- Consider splitting the large script into modules later and using a build step; not urgent.

## 12) Accessibility sweep (targeted)
- Add `lang` is already set—good.
- Ensure every interactive element is keyboard reachable and has a visible focus style.
- Use `aria-busy` on results container during rerender.
- Add `aria-live` to the “No results” box and ensure the hint buttons are buttons, not spans.

## 13) Minor copy tweaks
- Level names in selects: “Level 1 — Foundation” etc. already clear—good.
- Where we say “Proceed to Checkout,” consider “Review and Checkout” once min met.

## Proposed minimal edits batch
- Add aria attributes to nav toggle and active link.
- Debounce search input and applyFilters calls.
- Persist `groupBy` and `densityToggle` in URL.
- Add `aria-busy` toggling on results container and `aria-live` on pagination.
- Escape key to close “Why?” popover; focus return.

If you approve, I’ll apply the above minimal edits with clean, scoped changes and re-run a quick manual smoke check.
