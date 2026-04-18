# Pyon themes

Each folder is a self-contained Tailwind + shadcn theme. The `pyon` CLI copies
the selected `theme.css` into both `apps/web/src/app/globals.css` and
`apps/app/src/index.css`, sets `data-pyon-theme="<name>"` on `<html>`, and then
appends palette/font overrides on top.

## Catalogue

| id                | vibe                                                        | default font       |
|-------------------|-------------------------------------------------------------|--------------------|
| `minimalist`      | clean low-contrast neutrals, subtle borders                 | Inter              |
| `neo-brutalism`   | chunky borders, hard 4px shadows, square corners            | Space Grotesk      |
| `glassmorphism`   | frosted translucent surfaces over a vivid gradient backdrop | Inter              |
| `claymorphism`    | soft pastels, dual shadows, large radius, 3D squish         | Poppins            |
| `retro-synthwave` | deep purple night with magenta + cyan neons and soft glow   | Space Grotesk      |
| `terminal`        | CRT amber/green monospace on black, dashed borders          | JetBrains Mono     |

## Adding a theme

Drop a `themes/<id>/theme.css` file that defines the standard shadcn HSL
variables (`--background`, `--foreground`, `--primary`, ..., `--radius`) plus
`--font-sans` and `--font-mono`, then add the id to the choices in `cli/pyon`
(`THEME_IDS`) and to `docs/THEMES.md`.
