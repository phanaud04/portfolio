# Audrey Phan Portfolio — Style Guide / Brand Source of Truth

> Source: values extracted directly from computed CSS on the live Framer site (audreyphan.framer.website), August 2026. Use this file as the single source of truth when rebuilding the site in code. Where a value is marked **[VERIFY]**, it needs confirmation or an asset from Audrey before build.

---

## 1. Typography

### Font families in use

| Font | Role | Weight(s) seen | Notes |
|---|---|---|---|
| **IvyPresto Headline** | Display / hero type | Thin (100), Light (300) | Serif display font. Used for the largest, most emotive text — hero heading ("Let's create together"), and large intro phrase fragments ("Audrey", "pairing"). Licensed font — files now in `Fonts/IvyPrestoHeadline/`, wired up in `Fonts/fonts.css`. |
| **Suisse Int'l** | Primary UI / body sans | Thin (275), Light (300), Regular (400) | Workhorse sans-serif for headings/labels/body across the site (project titles, descriptions, subheading). Licensed font — full weight range now in `Fonts/SuisseIntl/`, wired up in `Fonts/fonts.css`. |
| **Suisse Int'l Mono** | Monospace accent | Regular | **Resolved:** this is the site-wide label/eyebrow/microcopy treatment — case-study eyebrows and meta labels (Section 8), `CaseStudySectionNav` items, Play page item captions, footer nav/contact links, PDF-thumbnail filenames. Anywhere small, uppercase-or-tight-tracking, secondary-to-a-heading text appears, it's this font, not Suisse Int'l sans. |
| **Space Mono** | Footer / playful accent | Regular (400) | Google Font — freely available. Used in the footer CTA ("can you help me get up there?"). |
| Inter | System fallback | Regular | Appears in a fallback stack (`Inter, Inter-Regular, system-ui, Arial, sans-serif`) — likely a Framer default, not intentionally chosen. |

**Build note:** IvyPresto and Suisse Int'l are paid/licensed fonts and can't be pulled from Google Fonts — they're now self-hosted from `Fonts/` instead (see `Fonts/fonts.css`). Confirm the license covers web embedding before shipping.

### Type scale (as used, largest to smallest)

| Size | Font | Weight | Line-height | Letter-spacing | Used for |
|---|---|---|---|---|---|
| 61px | IvyPresto Headline Light | 300 | 73.2px (1.2×) | normal | Hero / closing CTA heading ("Let's create together") |
| 30px | IvyPresto Headline Thin | 100 | 0.95× | normal | Hero intro statement (`AudreyHeadline`) — was 35px, sized back down 2026-08-13 to read better in the narrower centered column (see Section 7) |
| 23px | Suisse Int'l Light | 300 | 23px (1.0×) | normal | Project card titles (h4) |
| 17px | Suisse Int'l Light | 300 | 21px (1.24×) | normal | Hero subheading / role cycler (`.hero-subheading`) — was 18–20px across earlier passes, settled smaller 2026-08-13 alongside the headline resize |
| 18px | Suisse Int'l Light | 300 | 21.6px (1.2×) | normal | Project card descriptions, case-study body copy |
| 13px | Suisse Int'l Regular | 400 | 20px (~1.54×) | **-0.37px** | Nav items (work / play / about) — tight tracking, generous line-height |
| 11px | Space Mono | 400 | 14.3px (1.3×) | normal | Footer microcopy |

**Hero column (2026-08-13):** the hero intro block (`AudreyHeadline` + subheading) is centered — both as a text-align and as a block, via `margin: 0 auto` — in a fixed **600px** column (`.hero-inner` in `Hero.css`; briefly 738px earlier the same day, narrowed further after review), no longer tied to matching the project-card grid width. Reuse 600px for any future hero-style centered text block rather than re-deriving a width from the grid.

**Pattern to carry into code:** display/headline sizes run tighter line-height (0.9–1.0×) than body/UI sizes (1.2–1.5×) — keep that ratio relationship rather than a single global line-height token.

---

## 2. Color Palette

| Color | Hex (approx.) | RGB | Role |
|---|---|---|---|
| Off-white | `#FCFCFC` | rgb(252,252,252) | Primary page background |
| Pure white | `#FFFFFF` | rgb(255,255,255) | Card/chip backgrounds, hero text on dark |
| Near-black | `#0F0B11` | rgb(15,11,17) | Primary text (slightly warm black, not pure #000) |
| Pure black | `#000000` | rgb(0,0,0) | Secondary text / some backgrounds (buttons, footer section) |
| **Accent purple** | `#A14FCC` | rgb(161,79,204) | Brand accent — used on active nav label ("work") |
| Translucent gray | `#E0E0E0` @ 40% opacity | rgba(224,224,224,0.4) | Nav pill background (glassy/frosted look) |
| Translucent charcoal | `#222222` @ 80% opacity | rgba(34,34,34,0.8) | Overlay backgrounds |
| **Footer tan** | `#FBF5E7` | rgb(251,245,231) | Footer background — a light, warm cream. Lightened from an earlier, more saturated tan (`#F7F0DD`) that read too dark against the rest of the site's near-white pages. |

**Note:** `rgb(0,0,238)` (browser-default link blue) also appeared in the scan — this is almost certainly an unstyled default anchor color, not an intentional brand color. Flag for Claude Code to override/ignore rather than replicate.

### Confirmed accent gradient (from AudreyHeadline / AudreyCharacter source)

The single purple found on the live page is one stop in a full 5-color gradient, confirmed directly from component defaults — **WCAG AA compliant (≥4.5:1 contrast) against a white background**:

```
--gradient-audrey: linear-gradient(
  90deg,
  #AE5F00,  /* burnt orange/amber */
  #A14FCC,  /* purple — the accent seen in nav */
  #003AD9,  /* blue */
  #00872D,  /* green */
  #7E7601   /* olive/gold */
);
```

This gradient is the brand's signature accent treatment — applied as animated `background-clip: text` on the hero headline's first clause, and reused as the fill on the AudreyCharacter mascot. Treat it as a single reusable token, not five separate ad hoc colors.

---

## 3. Spacing System

Observed gap values (flex/grid): **130px, 70px, 40px, 25px, 10px, 8px**
Observed padding values: `0 0 7px`, `0 0 2px`, `0 100px` (section horizontal padding), `8px 20px` (button), `6px 10px`, `20px`, `4px 8px` (chip)

Suggested token scale to formalize in code (round to a consistent base-8/base-10 system so Claude Code has a scale to reference rather than one-off values):

```
--space-1: 4px
--space-2: 8px
--space-3: 10px
--space-4: 20px
--space-5: 25px
--space-6: 40px
--space-7: 70px
--space-8: 100px   (section side padding)
--space-9: 130px   (large section/block gaps)
```

---

## 4. Shape & Radius

| Radius | Used on |
|---|---|
| 90px (fully round) | Small status dot (17×17px) |
| 19px | Floating nav pill (204×38px) — roughly half of height, "pill" shape |
| 13px / 12px | Small tag/chip elements (~55–57×24–26px) |
| 10px / 11px | Buttons (~138–190px wide × 36–41px tall) |

Pattern: radius scales with element height rather than using one flat value everywhere — buttons and chips use a radius close to half their height (soft pill-ish, not fully round except the tiny status dot).

---

## 5. Layout Notes

- Nav is a floating pill, frosted/translucent background, fixed width ~204px.
- Section side padding observed at 100px — likely the main content gutter on desktop; **[VERIFY]** mobile/responsive breakpoint behavior, since Framer sites are usually designed desktop-first with separate mobile canvases (the site's meta tag shows `viewport width=1440`, confirming a fixed-width desktop design that needs real responsive treatment in code).
- Project cards use video/image previews with title, category, year, and description overlaid or adjacent.

---

## 6. Voice & Tone / Content Patterns

Carried over from Audrey's established writing rules (cover letters, case studies, site copy):

- **Conversational, peer-level tone** — not corporate, not overly polished. Process over polish.
- **No em dashes.**
- **Sentences should not start with "I."**
- **Avoid puffery** — grounded, specific claims over vague superlatives.
- Copy leans lowercase/casual in places (e.g. nav labels "work / play / about" instead of "Work / Play / About"; footer line "can you help me get up there?").
- Personal, slightly playful asides mixed with credibility markers (e.g. "Design Intern @ Centene (Fortune 19)" — pairs approachable tone with a concrete authority signal).
- Project descriptions are short, plain-language, outcome-oriented rather than jargon-heavy.

---

## 7. Component Reference: AudreyHeadline & AudreyCharacter

Both live in `src/components/` (`AudreyHeadline.tsx`, `AudreyCharacter.tsx`) — re-implementations of the original Framer code components with `addPropertyControls`/Framer plumbing stripped and props replaced by a hardcoded `CONFIG` object at the top of each file. **Updated substantially 2026-08-13** — the two components used to talk to each other for a drop-into-text "pinning" interaction that has since been removed; see below.

> **`/Components` (capital C, repo root) is the original frozen Framer source** for these plus `GradientCtaButton`, `GlowingEffect`, `CaseStudySectionNav`, and `TextCycler` — kept for historical reference only. It has **not** been updated alongside the `src/components/` behavior changes described in this section (no snap/pin logic removed there, old button glow still present, etc.). Don't treat it as a second source of truth or copy patterns back out of it without checking against the live `src/components/` version first.

### AudreyHeadline
- Renders the hero sentence as individual `<span>` words. The first clause ("Audrey Phan is a product designer who solves problems with an art director's eye,") is painted with the animated gradient above via `background-clip: text`; the second clause ("pairing deep thinking with craft that doesn't blend in.") is plain black text.
- **Gradient motion:** the gradient continuously sweeps back and forth (`0 → 100 → 0`, eased with a cosine curve) over a **10s cycle**, computed so all gradient words read as one continuous image rather than independently animating.
- **Cursor interaction:** words part like curtains around the mouse — default `cursorRadius: 90px`, `cursorStrength: 30px` (max px each word shifts), `verticalReach: 22px` (how far above/below the text line the cursor still triggers the effect). Movement is eased (lerp factor 0.2) for a soft, springy feel, not an instant snap.
- **Accessibility:** fully respects `prefers-reduced-motion` — freezes the gradient sweep and disables the cursor-push effect for users who have that OS setting on.
- **Character bridge (simplified 2026-08-13):** exposes exactly one method on `window.__audreyHeadline` — `reportPointer(x, y, radius)` — so `AudreyCharacter` can report its own position (with a footprint radius) while being dragged, and the words part around its body the same way they part around a mouse cursor. That's cosmetic only now; there is no snap/pin/drop-into-a-gap contract anymore (`getSnapPoint`/`setPinnedGap`/`getGapAnchor` were removed — don't re-add calls to them from memory of the old behavior).
- Default type props: `wordSpacing: 4px`, `textAlign: center` (was `left` — centered 2026-08-13 alongside the hero column change in Section 1), font-size **30px** (was 35px).

### AudreyCharacter
- A small wandering mascot (SVG circle body + simple limbs) that patrols back and forth on top of one project card by default (`walkCardIndex: 1` = the second/BITS card), not the full viewport width. `walkSpeed: 45px/s`, `size: 64px`, `bottomOffset: 28px` (viewport-bottom fallback if no card is mounted).
- Filled with a solid color by default (`useGradient: false`, `color: #A14FCC`) — can be switched to the same 5-color gradient token as the headline via `useGradient: true`.
- **Periodic point gesture:** every ~4.5–8.5s it pauses mid-patrol, faces forward, and raises its left arm toward the headline in a rise/hold/lower arc with a little insistent wag — as if saying "up there, c'mon." The speech bubble text does **not** change during this gesture; it's intentionally the same "pick me up! i need to go over there." shown while walking, so the point and the ask read as one continuous thought rather than two different lines swapping in and out.
- **Draggable, but no snapping (reworked 2026-08-13):** pick it up and drag it anywhere — while dragging, the headline's words still part around its body (via the `reportPointer` bridge above), but letting go never docks it into a word gap or anywhere else specific. **Dropping it always triggers a gravity-accelerated fall** (`gravity: 2200px/s²`, applied to a `fallVelocity` ref each frame) straight down to the bottom of the screen.
- **Grounding is permanent (added 2026-08-13, same day as the fall rework above):** the first time a fall lands, a `groundedRef` flag flips on for the rest of the session — from then on the character patrols the full width of the *viewport* bottom (same fallback path already used when no card is mounted) instead of climbing back onto its card. Earlier in the same day it did climb back onto the card after landing; that read as the character "bouncing" rather than actually falling, so it was changed to stay down for good once grounded. If this is ever revisited, the flag to touch is `groundedRef` in the main animation loop's card-lookup block.
- **Scrolling also triggers a fall**, from whatever the character is doing (unless it's already mid-drag or mid-fall) — but it's throttled to **once per 1.5s** (`SCROLL_FALL_COOLDOWN_MS`). A single scroll gesture fires dozens of native `scroll` events (especially trackpad momentum), and without the cooldown the character would re-trigger a fresh fall every time it landed and resumed walking, glitching through the fall animation on a loop for as long as scrolling continued. If this component is ever forked or this behavior extended, keep the cooldown — it's load-bearing, not an arbitrary number.
- **Speech bubble:** black background (`#000000`), white text (`#FFFFFF`), **Space Mono 12px**, rounded, small tail pointing down at the character. Text by mode: walking/pointing → `"pick me up! i need to go over there."`, dragging → `"wheee! don't let go yet!"`, falling (and for ~2s after landing) → `"ahh, that was scary!"` with a surprised "O" mouth and wider eyes. (The old `pinned`/`dragging near/far` variants no longer exist — don't reintroduce copy that promises the character will "land right there" or similar, since there's nothing for it to land on anymore but the ground.)
- Bubble pulses visible/hidden on a 4s cycle (visible 3s of every 4) rather than staying static — a small "restated" pulsing effect, not a fade. Forced fully visible (no pulsing) while the "scared" flag is active.
- Space Mono is loaded via a Google Fonts `@import` directly in the component — freely licensed, no font file needed.

**Voice pattern:** the mascot's dialogue is first-person, lowercase, a little wistful/funny — consistent with the site's overall playful-but-grounded tone noted in Section 6. Keep new bubble copy in that register if it's ever extended.

---

## 8. Case Study Page Typography (added for /wsdot and future case studies)

Case study pages (long-form project write-ups linked from the work grid) introduce a few text roles the homepage scale didn't cover. Values below are canonical — reuse the existing homepage tokens (Section 1) wherever a role overlaps rather than inventing new sizes.

| Role | Font | Weight | Size | Line-height | Notes |
|---|---|---|---|---|---|
| Case study H1 (page title, e.g. "Improving commuters' travel experiences...") | IvyPresto Headline | **Thin (100)** | 25px | 30px (1.2×) | Was Light (300) — corrected to Thin. |
| Case eyebrow (small label above a heading, e.g. "Overview", "Problem Space") | **Suisse Int'l Mono** | Regular (400) | 13px | 18px | Was Suisse Int'l (sans). Muted color, `rgba(15,11,17,0.45)`; small letter-spacing (`0.02em`). Same mono family as the homepage project-card chips (Section 1) — mono is now the site-wide label/eyebrow treatment, not just a chip thing. |
| Case section heading (sub-headers within a section, e.g. "WSDOT's IOS app hasn't been updated in 7 years.") | IvyPresto Headline | **Light (300)** | 23px | 28px | Was Suisse Int'l Regular, briefly Thin — settled on **Light**, matching the H1's weight family but staying visually one step down via size, not weight. Only the H1 uses Thin; every other display headline on a case study page uses Light. |
| Case pull-quote (colored callout box, e.g. "The Challenge" / the "how might we" statement) | IvyPresto Headline | **Thin (100)** | 26px | 32px (1.23×) | Was Suisse Int'l Regular 24px. The HMW-style statement reads as a display moment now, matching the H1's weight specifically (not the Light section headings). |
| Case body copy | Suisse Int'l | Light (300) | 18px | 21.6px (1.2×) | Unchanged — same token as project card descriptions (Section 1). |
| Case meta label/value (Role / Team / Timeline / Skills) | Label: Suisse Int'l Mono · Value: Suisse Int'l | Label 400 · Value 300 | 12–15px | 18–20px | Label switched to mono to match the eyebrow treatment. The meta block itself is now a bordered card (1px `rgba(15,11,17,0.1)`, 18px radius) rather than bare text in a row. |
| **Content column width** | — | — | **650px** | — | Every top-level block on a case study page (hero row, hero image, stat row, meta row, each section) shares this exact width, centered (`margin: 0 auto`) so text and media always share the same left/right edge. Widened slightly from the original 607px Framer frame width — 607 read a touch too narrow in the coded version. |

**Spacing:**
- *Within* a section: `.case-block` bottom margin is `--space-6` (40px), heading-to-body gap is `--space-3` (10px), image top-margin is `--space-5` (25px) — tightened from an earlier, airier pass per Audrey's "reduce the spacing between sentences" note.
- *Between* top-level blocks (hero → stat row → each section in turn): a single consistent `--space-8` (100px) gap, applied as `margin-top` on each block (`.case-stats`, `.case-section`) rather than splitting it into top+bottom padding on both sides of every boundary. The earlier padding-based approach silently doubled to ~200px between some sections while staying ~65–100px elsewhere — inconsistent for no visual reason. One rule, one number, applied uniformly, fixes it.

### Layout accents (added 2026-08, inspired by meganyap.me/work/lingofable)

Audrey liked the structural rhythm of that site's case study (stat cards, a tinted meta box, alternating-color feature cards, a bold-framed showcase image, card-style takeaways) and asked for those patterns folded into her own case studies — **reskinned in her existing brand** (white `#FCFCFC` background, near-black text, the 5-color `--gradient-audrey` accent, existing radius scale), not the source site's warm cream/rose palette. Established patterns to reuse on future case studies:

- **Stat row** — 3 cards (`.case-stats` / `.case-stat`) directly under the hero meta box, pulling numbers already stated in the copy (e.g. downloads, a % improvement, an award) into a quick-scan highlight. Number in IvyPresto Thin, accent-purple; label in Suisse Mono.
- **Meta box as a card** — bordered rounded card, not bare text (see table above).
- **Feature grid tinting** — `.case-feature-card` cycles through four very-low-opacity tints of the brand gradient's stops (amber/green/blue/purple, ~8% opacity) via `:nth-child(4n+1..4)`, instead of one flat gray for every card.
- **Framed showcase image** — one image per case study (pick the most "finished-looking" screenshot, e.g. a wireframe or hero mockup) gets a bold `8px solid` near-black border + 28px radius (`.case-image--framed`) instead of the plain rounded-corner treatment every other image uses. Don't apply this to every image — it's a highlight, not a default.
- **Small/inset image** (`.case-image--sm`, added 2026-08-13) — caps a `.case-image` to 50% width, centered (`margin: 0 auto`). Use this when a piece of media (usually a demo video) is visually "too loud" at full column width relative to the surrounding text — e.g. the final ferries walkthrough video in the WSDOT Outcome section. Combine as `className="case-image case-image--sm"`.
- **Takeaways as cards** — each `<li>` in `.case-takeaways` is now a bordered card (not a bare list row), consistent with the meta-box and stat-card treatment.

### GradientCtaButton (`src/components/GradientCtaButton.tsx`)

Reusable pill CTA (used for "Jump to Solution" and any future in-page or external case-study CTA). Not a one-off — pull this component into every future case study rather than hand-rolling a button. **Redesigned 2026-08-13** — the original blurred-halo treatment read as too subtle/didn't visibly change on hover, so it was replaced with a crisper stroke-and-color-shift approach:

- Near-black pill (`#0b0b0b`) with a **thin gradient stroke ring** (`::before`, `padding: 2.5px`, masked to just the ring) painted in `--gradient-audrey` at `260% 100%` background-size — no blur, no glow-behind-the-pill halo (that whole approach was removed, along with its `.gradient-cta-glow` span).
- **Colors shift on hover**, not just brighten: the ring's `background-position` animates from `0% 50%` to `100% 50%` over 0.5s, so the visible color mix genuinely changes (e.g. orange/purple by default → blue/green on hover) rather than the same colors just glowing harder. This is the main "does something on hover" signal — lean on this pattern (position-shift a gradient, not filter/opacity) for any future hover state that needs to read as a clear before/after.
- A light-refraction **shine** still sweeps across the pill surface on hover, but kept subtle (`rgba(255,255,255,0.28)`, was `0.75`) — a soft highlight, not a bold white flash.
- Respects `prefers-reduced-motion` (shine hidden, ring transition disabled).
- Props: `children`, `targetId` (smooth-scrolls to that element id on click — this is how "Jump to Solution" works), or `href` to render as a link instead of a button.

### Carousel (`src/components/Carousel.tsx`)

Generic one-slide-at-a-time image carousel — prev/next arrow buttons plus dot navigation, sliding `transform: translateX` transition (0.45s). Takes a plain `slides: {src, alt}[]` prop; arrows/dots only render if there's more than one slide. Introduced 2026-08-13 for the WSDOT Problem Context section (replacing a single flattened image that had carousel-look chrome baked into the pixels but wasn't actually interactive) — **use this any time a case study needs to show more than one "before" or comparison screen in the same visual slot**, rather than flattening multiple screens into one static image again.

### FeatureUsagePieChart (`src/components/FeatureUsagePieChart.tsx`)

Plain-React reimplementation of a Framer pie-chart code component (same stripping pattern as AudreyHeadline/AudreyCharacter — `addPropertyControls` removed, props became a destructured-with-defaults function signature). Pure SVG, no charting library. Computes slice paths from a hardcoded `{label, value, color, showInSlice}[]` dataset, labels only the largest slices directly on the chart, and renders a full legend below. Reuse this pattern (hand-rolled SVG arcs, not a charting dependency) for any future simple pie/donut chart rather than pulling in a library for one chart.

### FractionStatRow (`src/components/FractionStatRow.tsx`, added 2026-08-13, icons swapped in 2026-08-14)

Small reusable "X of Y participants said..." row for interview/survey findings — a big `n/d` fraction (weight 500 — was 600, toned down 2026-08-14 for reading less shouty), a short finding sentence, and a row of `d` little person-pictogram icons (`n` filled in `--color-accent`, the rest a light gray fill) visualizing the fraction. Was a row of plain dots at first; swapped for a hand-drawn SVG "person" glyph (circle head + rounded-shoulder body, `PersonIcon` in the same file) 2026-08-14 to read as literal people rather than an abstract progress meter. All icons are pinned to the same baseline via `align-items: flex-end` on the row and `transform-origin: bottom center` on each icon (so the hover-scale grows upward, not from center) — **keep both of those if this pattern is copied elsewhere; without them a taller/hovered icon visibly "floats" above its neighbors instead of standing on the same ground line.** Takes `stats: {numerator, denominator, body}[]` and renders one column per entry (`.fraction-stat-row` is a 3-column grid, collapses to 1 column under 480px). Built to replace a flattened screenshot of this exact pattern in the WSDOT case study (the "3/5 ... 5/5 ... 4/5 ..." stakeholder-interview callout) — **reuse this any time a case study wants to show interview/survey tallies rather than screenshotting a design tool's output.**

### Case study scroll-reveal microanimations (`src/hooks/useCaseStudyReveal.ts`, added 2026-08-13)

A reusable hook — call it once per case study page component (see `WsdotCaseStudy.tsx`) — that fades/slides content up into view the first time it scrolls on screen, plus hover polish defined alongside it in `styles/caseStudy.css`:

- The hook adds a `case-reveal-ready` class (defined in `caseStudy.css`: `opacity:0; transform: translateY(22px)`) to every `.case-block`, `.case-stat`, `.case-feature-card`, and `.case-takeaways li`, then uses one shared `IntersectionObserver` (`threshold: 0.12`) to add `case-reveal-visible` the first time each element enters view, unobserving it after — a one-time reveal, not a re-trigger on scroll-back.
- Uses `useLayoutEffect`, not `useEffect` — the ready class has to land before first paint or there's a one-frame flash of fully-visible content that then blips invisible before animating back in.
- **Progressive enhancement by construction:** the ready/hidden state only exists as a class the JS adds. If the hook never runs, content simply renders at full opacity — there's no CSS rule that hides `.case-block` etc. by default. Keep that property if this pattern is extended.
- Grouped tiles (stat row, feature grid, takeaways list) get a small per-item `transition-delay` stagger (`nth-child(2)` +0.08s, `nth-child(3)` +0.16s, etc.) so they cascade in rather than popping together as one flat block.
- Separately (not scroll-triggered — just `:hover`): `.case-image`/`.case-hero-image` media zooms slightly (`scale(1.025)`), `.case-feature-card` and `.case-stat` lift (`translateY(-3px/-4px)` + soft shadow), `.case-takeaways li` nudges right (`translateX(4px)`).
- All of the above is gated behind `prefers-reduced-motion: reduce` (reveal disabled, all these transitions disabled) in one media query block at the end of `caseStudy.css`.
- **For a future case study page:** import and call `useCaseStudyReveal()` in the page component, same as WSDOT does — the CSS classes it depends on already live in the shared `caseStudy.css`, so no per-page setup beyond that one hook call.

### IntroLoader shrink-to-target pattern (`src/components/IntroLoader.tsx`, reworked 2026-08-13)

The full-screen loading mark no longer just fades out in place — it measures the real nav logo's on-screen position (`document.querySelector(".logo")`, since `Nav` mounts alongside `IntroLoader` in `App.tsx` and the logo `<img>` exists in the DOM the whole time, just visually covered) and animates shrinking/translating into that exact spot, so the loader reads as the mark "becoming" the nav logo rather than two unrelated elements handing off. Sequence: measure both elements' `getBoundingClientRect()`, compute a `translate(dx, dy) scale(logoWidth / markWidth)`, apply it as an inline style with a `transition: transform 0.7s cubic-bezier(0.4,0,0.2,1)` on the mark, fade the loader's background out concurrently over 0.6s. Skipped under `prefers-reduced-motion` (falls back to the plain in-place fade). **Reuse this measure-the-real-target-then-animate-into-it approach** for any future "this element becomes that element" transition — it's more robust than hardcoding pixel coordinates because it stays correct if the target's layout ever changes.

Shimmer on the mark itself was also softened 2026-08-13: gradient stops moved from `#a14fcc → #efd6fb → #a14fcc` (near-white highlight, high contrast) to `#a14fcc → #c495db → #a14fcc` (a lighter purple, not near-white), and the cycle slowed from 1.6s to 2.2s. If shimmer is added to other elements, prefer a same-hue lighter step over a near-white one — that's what makes it read as "subtle" rather than "flashing."

### GlowingEffect (`src/components/GlowingEffect.tsx`)

Cursor-tracking glow-border effect — a thin arc of the brand gradient traces a card or nav item's border, following the pointer as it approaches. Ported from a Tailwind + `motion/react` reference component into plain CSS + `framer-motion`'s standalone `animate()`, with the color swapped from the reference's arbitrary pink/gold/green/blue to the site's own 5-stop brand gradient via `--gradient-audrey-conic` (tokens.css) — a `repeating-conic-gradient` built from the same colors as `--gradient-audrey`.

- Renders as an absolutely-positioned overlay (`inset:0`); the parent needs `position: relative` and its own `border-radius` for the effect's `border-radius: inherit` to line up.
- Tracks pointer position document-wide (not just on the element) so the arc starts easing toward the cursor before it's actually over the element — driven by `proximity` (px beyond the box edge that still counts as "near").
- A circular dead zone at the element's center (`inactiveZone`, a fraction of the box's shorter side) — pointer positions inside it are treated as inactive, which avoids flicker when the cursor sits still near dead-center. This means hovering exactly in the middle of a small element can look inert; the effect is meant to be noticed as the cursor *arrives*, not while parked at center.
- Currently applied to: homepage `ProjectCard`s (`spread=40, borderWidth=2, inactiveZone=0.4`), About page `.scrap-photo`s, and Play page tiles (all `spread=32, borderWidth=2, inactiveZone=0.4`) — anywhere a hoverable image-card needs a "this is a distinct object" cue.
- No `prefers-reduced-motion` gate yet on the pointer-tracking itself (only `GradientCtaButton`'s glow/shine respect it) — worth adding if this pattern spreads further.
- **`CaseStudySectionNav` does *not* use `GlowingEffect`** (an earlier draft of this doc said it did — corrected). Its hover state is a plain CSS treatment instead: the item's text color shifts toward the accent, the label nudges right (`translateX(4px)`), and an underline reveals left-to-right — the same directional-underline mechanic reused for the footer's link hover (Section 11). A background-highlight-box treatment was tried and explicitly reverted in favor of this — keep it as color + underline + offset, not a filled highlight pill, if this component is revisited.

## 9. Homepage Project Cards (updated 2026-08)

Project cards on the work grid went from bare image+text floating on the page background to actual bordered card containers, plus a hover state inspired by meganyap.me/home's project cards:

- **Card shell** (`.project-card`): white background, `1px solid rgba(161,79,204,0.16)` border (a faint tint of the brand purple — this is the "different... outline" that makes cards read as distinct objects against the `#FCFCFC` page background), 20px radius, internal padding so the image doesn't bleed to the card edge.
- **Hover, all cards**: lifts (`translateY(-4px)`), gains a soft shadow, border tint deepens, and the `GlowingEffect` cursor-tracking gradient arc appears on the card's edge (see above).
- **Hover, image**: scales to 1.06 inside its `overflow:hidden` frame, and a bottom-anchored dark scrim fades in.
- **Hover, linked cards only** (currently just WSDOT — the only project with a real case study page): a white "View Case Study →" pill fades/slides up over the scrim. Cards without a destination page do **not** get this pill — showing a CTA that goes nowhere would be worse than not showing one. Add it automatically the moment a project gets a real `href` in `src/data/projects.ts`; don't hand-author it per card.
- **Custom cursor label system (generalized 2026-08-13):** `CustomCursor.tsx` used to hardcode "View Case Study" for any `.project-card--linked`. It now reads a generic `data-cursor-label` attribute off whatever's hovered (`ProjectCard` sets it to `"View Case Study"` for linked cards, or to `project.cursorNote` for cards that have one but no `href`) — so **any element can opt into a cursor label just by adding that attribute**, not only project cards. A second attribute, `data-cursor-variant="note"`, switches the pill to a wider, wrapping, multi-line layout (`.custom-cursor--note` in `CustomCursor.css`) for longer text, while the plain `.custom-cursor--pill` stays a fixed-height single-line pill for short labels like "View Case Study" — kept as two separate CSS states so the common short-label case still animates smoothly from the resting dot (animating to `height: auto` doesn't tween in CSS, so the fixed-height variant had to stay fixed-height). Currently used for Vesta (`cursorNote: "project still in process. contact me for more details"` in `src/data/projects.ts`) — the pattern for **any future in-progress project**: give it a `cursorNote` instead of an `href`, no other wiring needed.

---

## 11. Footer (`src/components/Footer.tsx`, provided/built 2026-08)

Section 10's old "not yet provided" gap is resolved — the footer is built and has been through a couple of redesign passes since:

- **Layout:** headline on the left, two stacked link groups on the right (nav: work/play/about; contact: email/linkedin/resume), copyright line beneath. Background is the footer-tan above.
- **Headline treatment:** "Let's create something together." renders as **four lines, one word per line** (`Let's` / `create` / `something` / `together.`), each in its own `<span>` — not wrapped by CSS, deliberately split in markup so the line breaks are exact regardless of viewport width. IvyPresto Headline, accent purple.
- **Links are plain text, not buttons** — an earlier pass used pill-shaped buttons (matching `GradientCtaButton`'s chrome) here, but that read as too heavy for a footer; they're now `.site-footer-link`s: Suisse Int'l Mono, uppercase, small tracking, with a right-to-left underline reveal on hover (`::after` sweeping `right: 100% → 0`) — same directional-reveal mechanic as `CaseStudySectionNav`'s hover, reused here since it's the site's established "this text is now a link" hover language.
- **`AsciiTrail` lives here at full effect** — this is the one place the component runs undimmed (see Section 14); everywhere else it's a dimmed ambient background layer.

## 12. About Page (`src/pages/About.tsx`)

Two-column layout: a fixed-width (420px) text column (bio + social icons) beside a photo column.

- **Photo treatment — "scrapbook," not a grid:** six polaroid-style photos (`.scrap-photo`: white padded frame, colored washi-tape strip, italic IvyPresto caption underneath) render across **two independent flex columns** (`PHOTO_COLUMNS` in `About.tsx`, photos split by `i % 2`), not a CSS grid. The second column gets a `margin-top` offset so it starts lower than the first, and each photo has its own hand-picked rotation (`--rot`, roughly ±4–8deg). The combination — independent column heights + offset start + varied rotation — is what makes six photos read as scattered across a corkboard rather than four/six cells in a tidy grid. **If a photo count or column count ever changes, keep the two independent-column structure** (not a grid) — a grid locks left/right photos into the same row height, which is exactly the "aligned rows" look this was built to avoid.
- Gaps are generous by design (48px between columns, 60px between photos in the same column, no overlap) — an earlier pass had tight, overlapping polaroids; it read as cluttered at this photo size, so spacing was opened up and overlap dropped entirely in favor of pure rotation + offset for visual variety.
- Captions are 17px italic IvyPresto — sized up from an initial 13px pass once the photos themselves were sized up, so the caption doesn't read as an afterthought next to a now-larger image.
- **`AsciiTrail` runs behind the whole page**, dimmed to 16% opacity (see Section 14) so it's felt as texture, not seen as a distinct effect.

## 13. Play Page (`src/pages/Play.tsx`)

A masonry-style grid of everything in `src/data/play.ts` (auto-generated from the `/Play` folder — don't hand-edit that file, re-run its generating script instead).

- **Layout:** one continuous 3-column masonry (`buildColumns()`), items distributed round-robin into columns rather than split into alternating "row" and "full-width feature" blocks (an earlier version special-cased videos/PDFs as full-width breakouts; that was dropped in favor of a single uniform column flow closer to a Pinterest-style reference layout). Each item is randomly bucketed into a size class (`s`/`m`/`l`, capped at 88%/96%/100% of its column) for masonry-style height variation. Wide container (1560px max) with generous side padding (`--space-8`, ~100px) rather than the narrower centered column most other pages use — "the work" is meant to span a wide middle section, not a single-column-width reading measure.
- **Randomized per visit:** the shuffle seed is `Date.now()` at mount (`useState(() => Date.now())`), not a fixed constant — every page load (and every visitor) gets a different arrangement. A **"⟲ Shuffle" button** (`GradientCtaButton` with a plain `onClick`, no `href`/`targetId`) at the top of the page re-rolls the seed on demand, rebuilding the columns via `useMemo`.
- **No cursor-label tooltip on hover** — items deliberately don't set `data-cursor-label` (unlike `ProjectCard`s on the homepage); hovering just shows the plain cursor dot plus the item's category caption revealing beneath it in-place.
- **`AsciiTrail` background is viewport-`fixed`, not page-`absolute`** here (see Section 14's perf note) — this page can scroll for several screens, so the canvas stays bounded to the viewport instead of scaling with total page height.

## 14. AsciiTrail (`src/components/AsciiTrail.tsx`)

A canvas-based ASCII/glyph trail that lights up along the cursor's path and decays behind it, sampling color from `--gradient-audrey` across the canvas's horizontal position (so it always reads as the same brand gradient sweep as the headline text, never a flat single tint). Ported from a Framer code component (`AsciiFlowTrail`) with the Framer-specific plumbing stripped and its props collapsed into one hardcoded `CONFIG` object — same pattern as `AudreyHeadline`/`AudreyCharacter`.

- **Two usage modes, by opacity:** full-strength as the footer's actual visual centerpiece (Section 11), or dimmed to ~16% opacity as ambient background texture on About, Home, and Play. Reuse the dimmed treatment (a wrapping div at `opacity: 0.16`, `pointer-events: none`, sitting behind the page's real content via `z-index`) for any future page that wants this same "felt, not seen" ambient layer — don't invent a new background effect.
- **Positioning matters for page length:** on About (bounded height), the wrapper is `position: absolute; inset: 0` sized to the page's own content box. On Home and Play — both of which can scroll well past one viewport (a full project grid, or the whole Play masonry) — the wrapper is `position: fixed; inset: 0` instead, so the canvas the component redraws every animation frame stays viewport-sized regardless of how long the page gets. **Use `fixed` for any page whose content height isn't small/bounded** — the per-frame cost scales with canvas area, and an `absolute` canvas stretched to a multi-thousand-pixel-tall page is a real, avoidable perf cost.
- Respects `prefers-reduced-motion` (the whole effect just doesn't run — no static fallback frame).
- `CONFIG.blendMode`/`CONFIG.drawBlendMode` are fixed values (`"Normal"`/`"Screen"`) left over from the original configurable Framer version — the branches handling other blend-mode options were dead code (unreachable given the fixed config) and were removed 2026-08 in favor of applying the one reachable formula directly. If this component is ever made configurable again, reintroduce the branching then, not preemptively.

## 15. CaseStudyNextProject (`src/components/CaseStudyNextProject.tsx`, added 2026-08)

Closing "up next" card for case study pages — full-bleed looping video (dimmed via `filter: brightness()`), a "Next Project" eyebrow, and the sibling project's name with an arrow that nudges right on hover. Takes `{ to, video, title }`. Currently wired both ways between WSDOT and BITS (`WsdotCaseStudy.tsx` → `/bits`, `BitsCaseStudy.tsx` → `/wsdot`) — **when a third case study is added, this becomes a small cycle (A→B→C→A) rather than a single pair**, and the component itself needs no changes, just new prop values on each page.

---

## 16. Favicon (`public/images/favicon.png`, generated from `public/images/logo-mark.svg`)

The tab/bookmark icon is generated from the same squiggle mark used as the nav logo, but **not** simply that PNG dropped in as-is — `logo.png` is a non-square crop (88×68), and browsers forcing a non-square source into a square favicon tile visibly squashes it. The favicon is instead rendered from the vector source (`logo-mark.svg`) onto a true square canvas, transparent background, with:
- Tight, even padding on all sides (the mark fills most of the tile) rather than the wider margin a naive "pad to square" pass would leave — favicons render as small as 16px, so any spare canvas is wasted legibility.
- A matching-color `stroke` added alongside the existing `fill` on the path, to bulk up the mark's line-weight — the artwork's native stroke width reads as too thin once scaled down to tab-icon size without this.

If the logo mark itself is ever redrawn, regenerate the favicon from the new SVG using this same recipe (square canvas, tight padding, added stroke weight) rather than re-cropping a PNG.

---

## 17. Open items before handing to Claude Code

1. ~~**Font files/licenses** for IvyPresto Headline and Suisse Int'l (both weights/styles used) — still needed.~~ **Resolved:** font files are in `/Fonts`, organized by family (`SuisseIntl/`, `SuisseIntlMono/`, `SuisseScreen/`, `IvyPrestoHeadline/`) with ready-to-import `Fonts/fonts.css` (`@font-face` rules for all 37 files) and `Fonts/fonts-manifest.json` (machine-readable weight/style/format per file). Space Mono is confirmed freely available via Google Fonts.
2. ~~**AudreyFooter component code** — not yet provided.~~ **Resolved:** built as `Footer.tsx` — see Section 11.
3. **Responsive/mobile behavior** — partially resolved. Every page now has its own max-width breakpoints (typically 720px/860px/1100px, per-page in each page's `.css` file) rather than one global strategy, which was the right call given how different the page layouts are (case-study single column vs. Play's 3-col masonry vs. About's two-column scrapbook). Still unverified: whether `AudreyCharacter`'s viewport-relative walking/card-climbing behavior holds up sensibly on narrow/touch viewports — it was built and tuned against desktop widths.
4. ~~Screenshots of each page/section as visual ground truth.~~ **Moot:** the live built site is now the visual reference; this doc no longer needs a separate screenshot set.
5. ~~Decide the re-implementation approach for `addPropertyControls`-based props.~~ **Resolved and applied consistently:** a hardcoded module-level `CONFIG` object, same pattern across every ported Framer component (`AudreyHeadline`, `AudreyCharacter`, `AudreyFriend`, `AsciiTrail`, `TextCycler`, `FeatureUsagePieChart`).
6. **`AudreyCharacter` (956 lines) and `AudreyFriend` (263 lines) share real logic** — `AudreyFriend`'s own header comment calls it "a trimmed-down copy of AudreyCharacter's walking the floor branch." A future pass could extract the shared walk-loop/leg-swing/bubble-pulse math into a hook, but both components are stateful, tightly-tuned, and highly interactive (see Section 7's fall/grounding/cooldown notes) — that refactor needs dedicated, careful visual regression testing, not a rolled-into-a-general-cleanup pass. Flagged, not attempted.
7. **Root-level reference folders (`/Play`, `/WSDOT`, `/BITS`, `/Me`, `/RealResponse`, `/Screenshots`, `/Fonts`, `/Components`) are intentionally not in version control.** They're pre-production source material (raw design exports, the original Framer components, QA screenshots) that the real app never imports from — everything the site actually serves lives in `public/images/`, `public/fonts/`, and `src/`. They stay on disk locally for reference but are `.gitignore`d to keep the repo to just the deployed app's code and assets. If one of these folders' contents needs to ship, copy the specific file into `public/` (the established pattern already used for every current asset) rather than un-ignoring the whole folder.

---

*Compiled from live computed styles on audreyphan.framer.website plus the AudreyHeadline and AudreyCharacter component source. Treat pixel values as accurate to the current live site; treat anything marked [VERIFY] as needing Audrey's confirmation before Claude Code builds against it.*
