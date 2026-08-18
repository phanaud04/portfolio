# Project Brief — Audrey Phan Portfolio Rebuild

## Goal
Rebuild my current Framer portfolio (audreyphan.framer.website) as a coded site, using this folder as the full source of truth. This is a pixel-accurate rebuild, not a reinterpretation — match the existing design unless I've explicitly noted a change.

## What's in this folder
- `audrey-portfolio-style-guide.md` — typography, color, spacing, radius, and voice/tone tokens, extracted directly from the live site's computed CSS. This is the primary reference for all visual decisions.
- `/components` — real source for AudreyHeadline and AudreyCharacter (originally built as Framer code components). Re-implement the same interaction logic and physics in plain React — strip anything Framer-specific (e.g. `addPropertyControls`, the `"framer"` import) and replace configurable props with hardcoded defaults or a plain config object.
- `/fonts` — licensed font files (IvyPresto Headline, Suisse Int'l), renamed to their real names.
- `/screenshots` — visual reference for each page, for layout and spacing QA.
- Page copy / content — [to be added]

## Priorities (if anything has to give)
1. **Spacing, type, and color accuracy** — these should match the style guide exactly.
2. **Animation feel** over animation timing precision — the cursor-push, gradient sweep, and mascot behavior should feel the same, but exact millisecond timing isn't sacred if it needs adjusting for the new stack.
3. **Accessibility is non-negotiable** — `prefers-reduced-motion` handling on AudreyHeadline must be preserved, not dropped for convenience.

## Known gaps / open items
- Suisse Int'l Thin (weight 275) font file not yet sourced.
- AudreyFooter component code not yet provided.
- Full page copy for case studies (WSDOT, BITS) and the about/play page not yet added.
- Screenshots beyond the homepage not yet captured.
- Mobile/responsive intent not yet decided — the live site is a fixed 1440px desktop design.

## How to use this folder
Read the style guide first for the token vocabulary, then the component source for real implementation patterns to extend rather than invent, then use screenshots to visually self-check the build against the original.
