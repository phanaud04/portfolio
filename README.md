# Audrey Phan — Portfolio

Coded rebuild of [audreyphan.framer.website](https://audreyphan.framer.website), built with Vite + React + TypeScript. See `PROJECT_BRIEF.md` and `audrey-portfolio-style-guide.md` for the source-of-truth brief and design tokens this was built against — the style guide in particular is kept up to date as a living component/pattern reference, not just an initial brief.

## Getting started

```bash
npm install
npm run dev        # start the dev server at http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run typecheck  # tsc only, no emit — useful on its own while iterating
npm run lint       # oxlint
npm run preview    # preview the production build locally
```

## Structure

- `src/pages/` — one file per route: `Home.tsx` (work grid), `WsdotCaseStudy.tsx`, `BitsCaseStudy.tsx`, `Play.tsx`, `About.tsx`.
- `src/components/` — shared UI. Notable ones: `AudreyHeadline.tsx` / `AudreyCharacter.tsx` / `AudreyFriend.tsx` (interactive hero headline + wandering mascots, re-implemented in plain React from the original Framer code components — see the style guide's Section 7 for behavior details), `AsciiTrail.tsx` (cursor-driven ambient background, used dimmed on About/Home/Play and at full strength in the footer), `CaseStudyNextProject.tsx` (shared "next project" card for case study pages), `GlowingEffect.tsx`, `GradientCtaButton.tsx`, `CaseStudySectionNav.tsx`.
- `src/data/` — `projects.ts` (work grid cards), `play.ts` (**auto-generated** from the `/Play` folder's contents — don't hand-edit, re-run its generating script instead), `contact.ts`.
- `src/styles/tokens.css` — design tokens (color, type, spacing, radius); `src/styles/caseStudy.css` — shared layout/typography for case study pages; `src/styles/global.css` — resets + font imports.
- `public/fonts/` — licensed IvyPresto Headline + Suisse Int'l font files, wired up via `public/fonts/fonts.css`.
- `public/images/` — every image/video/font the deployed site actually serves, organized by section (`projects/`, `wsdot/`, `bits/`, `play/<category>/`, `about/`).

## Not in version control (by design)

The root-level folders `Play/`, `WSDOT/`, `BITS/`, `Me/`, `RealResponse/`, `Screenshots/`, `Fonts/`, and `Components/` are pre-production reference material — raw design exports, the original Framer-source components, and QA screenshots used while building the site. Nothing in `src/` imports from them; everything actually served lives under `public/`. They're `.gitignore`d to keep the repo scoped to the deployed app rather than its entire design history. If something in one of those folders needs to ship, copy the specific file into `public/` (the pattern every current asset already follows).

## Known gaps

- `AudreyCharacter` and `AudreyFriend` share real walking/animation logic (`AudreyFriend` is a trimmed-down copy of `AudreyCharacter`'s "walking the floor" branch) — a candidate for a future shared-hook extraction, deliberately not attempted in a general cleanup pass given how tightly-tuned and stateful both are. See the style guide's Open Items for details.
- `AudreyCharacter`'s viewport-relative walking/card-climbing behavior is tuned against desktop widths; its behavior on narrow/touch viewports hasn't been specifically verified.
