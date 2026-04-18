# Themes, palettes, fonts, and AI copy

This document covers how `pyon`'s design system is wired end-to-end, so you
can extend it or debug a generated project.

## Architecture

At scaffold time, `pyon new` runs four apply steps _before_ the standard
`__PYON_*__` placeholder rewrite pass:

1. `apply_theme`   — copies `themes/<id>/theme.css` over both frontends'
                     base stylesheet, and stamps `data-pyon-theme` on the
                     host HTML.
2. `apply_palette` — writes a small CSS block of HSL variable overrides
                     (light + dark) into each frontend's stylesheet.
3. `apply_font`    — injects the Google Fonts `<link>` tag into each
                     frontend's `<head>` and overrides `--font-sans` /
                     `--font-mono`.
4. `apply_copy`    — replaces every `__PYON_COPY_*__` token with either
                     AI-generated content, AI-scraped brand copy, or the
                     curated fallback from `cli/fallbacks/copy.json`.

After those four steps the normal `__PYON_*__` rewrite pass runs, resolving
things like `__PYON_DISPLAY_NAME__`, `__PYON_NAMESPACE__`, `__PYON_DB__`,
and friends inside whatever copy was just applied.

## Themes

Each theme lives under `themes/<id>/theme.css` and is a **complete**
Tailwind stylesheet (i.e. it starts with `@tailwind base; components;
utilities;`). The CLI simply replaces `apps/web/src/app/globals.css` and
`apps/app/src/index.css` with this file, so themes can override anything —
including `@layer components` — without the apps having to import anything
extra.

The active theme is announced on the host element:

```html
<!-- apps/web/src/app/layout.tsx -->
<html lang="en" class="dark" data-pyon-theme="neo-brutalism">

<!-- apps/app/index.html -->
<html lang="en" class="dark" data-pyon-theme="neo-brutalism">
```

That attribute is primarily for your own CSS hooks (e.g. `[data-pyon-theme="terminal"] .pyon-logo { … }`); the themes themselves don't
branch on it because the CLI guarantees only one theme is ever applied.

### Adding a new theme

1. Create `themes/<id>/theme.css` — a full Tailwind + shadcn-compatible
   stylesheet. Start from one of the existing themes.
2. Declare the shadcn HSL variables in `:root` and `.dark` (`--background`,
   `--foreground`, `--primary`, `--primary-foreground`, `--secondary`,
   `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`,
   `--accent-foreground`, `--destructive`, `--destructive-foreground`,
   `--border`, `--input`, `--ring`, `--card`, `--card-foreground`,
   `--popover`, `--popover-foreground`, `--radius`, `--font-sans`,
   `--font-mono`).
3. Add `<id>` to the `KNOWN_THEMES` array in `cli/pyon`.
4. Add a one-liner to `themes/README.md`.
5. Add a matrix entry in `.github/workflows/cli-smoke.yml` so CI exercises
   it at least once.

## Color palettes

Palettes are additive, not standalone — they overlay a theme's default
colors with HSL tuples. Each preset is a JSON file with this shape:

```json
{
  "name": "Emerald",
  "description": "Confident green primary over neutral backgrounds.",
  "light": { "background": "…", "primary": "…", "accent": "…", … },
  "dark":  { "background": "…", "primary": "…", "accent": "…", … }
}
```

`apply_palette` walks both objects and appends a CSS block to the theme
stylesheet:

```css
/* --- pyon palette: emerald --- */
:root {
  --background: 0 0% 100%;
  --primary: 160 84% 39%;
  …
}
.dark {
  --background: 240 10% 4%;
  --primary: 152 76% 43%;
  …
}
```

### Adding a new preset

Create `palettes/<id>.json` with light + dark HSL tuples for at least
`background`, `foreground`, `primary`, `primary-foreground`, `accent`,
`accent-foreground`, `muted`, `muted-foreground`, `border`, `input`,
`ring`. Then add `<id>` to `KNOWN_PALETTES` in `cli/pyon`.

### Custom hex mode

If the user picks "Custom hex", `pyon` prompts for **primary**,
**background**, and **accent** colors, converts them to HSL via the
`hex_to_hsl` bash helper, and fills the remaining tokens with sensible
auto-derivatives (foreground = high-contrast neutral, muted = mid-grey,
etc.).

### URL mode

If the user pastes a URL, `pyon` fetches and flattens the page content,
then asks OpenAI to return a full palette (both `light` and `dark` maps)
matching the brand. The JSON is validated before it's applied — invalid
output falls back to the `slate` preset so the scaffold still builds.

## Fonts

`fonts/fonts.json` is a flat registry:

```json
{
  "fonts": [
    {
      "id": "inter",
      "name": "Inter",
      "kind": "sans",
      "css_family": "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
      "google_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
    }
  ]
}
```

`apply_font` substitutes the `<!-- __PYON_FONT_LINK__ -->` comment inside
each frontend's `<head>` with a `<link rel="preconnect">` + `<link
href="…">` pair, and overrides `--font-sans` (or `--font-mono` for
monospace fonts) in the theme stylesheet.

### Adding a new font

Append an entry to `fonts/fonts.json` with a unique `id`, `kind` (`sans`,
`mono`, `serif`, or `display`), `css_family` stack, and Google Fonts CSS2
URL. Add `<id>` to `KNOWN_FONTS` in `cli/pyon`.

## AI copy tokens

All user-facing strings that should be rebranded per project are marked
with `__PYON_COPY_<SLOT>__` placeholders. They live in:

- `apps/web/src/app/page.tsx`        — homepage hero + features
- `apps/web/src/app/about/page.tsx`  — about page
- `apps/web/src/app/pricing/page.tsx`— pricing page
- `apps/web/src/app/layout.tsx`      — meta description + footer tagline
- `apps/app/src/routes/dashboard.tsx`— dashboard welcome + cards
- `apps/api/Pyon.Api/Services/DataSeeder.cs` — seed blog post

The full slot list is the `copy` section of `cli/fallbacks/copy.json` (the
source of truth). Any new token you introduce must also appear there — the
CI workflow's "no placeholder tokens leaked" step will fail otherwise.

### Fallback copy rules

Fallback values MUST be single-line (no `\n`). This is because BSD `sed`
on macOS interprets `\n` in the replacement string as a literal newline,
which corrupts C# double-quoted strings. The CLI also defensively strips
any newline that sneaks into AI output before passing to `sed`.

### AI modes

- **`--describe "…"`** — short English description of the product.
  Prompts `gpt-5.4` (fallback `gpt-4o`) to return a JSON map of
  `__PYON_COPY_*__` → string values in the brand's tone.
- **`--ref-url https://…`** — fetches + flattens the target site with
  `curl`, then asks OpenAI to infer a _full brand_: theme suggestion,
  palette (light + dark), font family, and copy/tone. The applied theme
  and palette can be overridden with explicit flags; copy is always
  applied.
- **`--no-ai`** — skip all OpenAI calls and use the curated fallback copy.

The OpenAI API key is prompted at run-time via `prompt_secret` and is
never written to disk or committed.
