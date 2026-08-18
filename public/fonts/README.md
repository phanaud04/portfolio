# Fonts

Organized for easy use by Claude Code (or any build tool) — grouped by family, clean filenames, and machine-readable metadata.

## Structure

```
Fonts/
  fonts.css              @font-face rules for every font below — import this directly
  fonts-manifest.json    machine-readable list: family, weight, style, format, path
  SuisseIntl/             18 files  (weights 250–900, upright + italic)
  SuisseIntlMono/          3 files  (Thin / Regular / Bold)
  SuisseScreen/           14 files  (weights 275–700, upright + italic)
  IvyPrestoHeadline/       2 files  (Thin, Light — webfont .woff2, likely pulled from the live site)
```

## Usage

Import the stylesheet, then reference the family names in CSS:

```css
@import "./Fonts/fonts.css";

h1 { font-family: "Suisse Int'l", sans-serif; font-weight: 700; }
```

Font families available: `Suisse Int'l`, `Suisse Int'l Mono`, `Suisse Screen`, `IvyPresto Headline`.

Non-standard numeric weights (e.g. 250, 275, 375, 450) come straight from each font's OS/2 table — CSS `font-weight` accepts any number 1–1000, so they work as-is; round to the nearest standard step (100/300/400/700/etc.) if a tool complains.

`fonts-manifest.json` has the same data in JSON if you need to generate `@font-face` rules programmatically instead.

## Note

These are commercial fonts (Suisse from Swiss Typefaces, IvyPresto from Colophon). Confirm licensing covers your intended use (e.g. web embedding) before shipping.
