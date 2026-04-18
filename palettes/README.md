# Pyon palettes

Each `<name>.json` is an optional color overlay the `pyon` CLI appends to the
selected theme's CSS. Each palette defines the shadcn HSL variables for both
`:root` (light) and `.dark` (dark).

Presets: `slate`, `zinc`, `emerald`, `rose`, `indigo`, `amber`, `teal`, `cyan`.

Two non-preset modes are supported by the CLI:

- **Custom hex** — user provides primary + background + accent hex values,
  the CLI converts to HSL in bash and synthesises a palette on the fly.
- **URL extract** — with an OpenAI key, GPT reads the target site and emits a
  palette JSON in the same shape.

To keep the theme's own opinionated colors (e.g. neo-brutalism's yellow or
terminal's amber-green), pick "Theme default" in the palette prompt.
