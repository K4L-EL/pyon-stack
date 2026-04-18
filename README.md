# PYON Stack

Batteries-included full-stack template:

- **apps/web** — Next.js 15 marketing site (shadcn + Tailwind)
- **apps/app** — Vite + React + TanStack Router dashboard, admin panel, and blog CMS
- **apps/api** — ASP.NET Core 8 API, EF Core, Postgres, JWT auth
- **infra/terraform** — modular Terraform for Postgres + hosting
- **docker/** — one-shot `docker compose up` local dev

## Quick start (new project)

```bash
curl -fsSL https://raw.githubusercontent.com/K4L-EL/pyon-stack/main/install.sh | sh
pyon new my-app
cd my-app
docker compose -f docker/docker-compose.yml up -d
```

The CLI prompts for project name, .NET namespace, Postgres DB name, and ports,
then rewrites every `__PYON_*__` placeholder and (optionally) creates a GitHub
repo and pushes the first commit.

## Design system

`pyon new` also asks you three design questions and applies them across both
frontends (`apps/web` + `apps/app`) so the marketing site and dashboard share
a consistent look out of the box.

**1. Theme** — the overall visual language (typography, borders, shadows,
component shapes). Ships with six presets:

- `minimalist` — clean, low-contrast, thin borders, subtle shadows
- `neo-brutalism` — chunky borders, hard shadows, square corners
- `glassmorphism` — translucent frosted surfaces over a gradient
- `claymorphism` — soft pastels, dual shadows, 3D squish on click
- `retro-synthwave` — deep purples, neon magenta/cyan, glow effects
- `terminal` — monospace, black + amber/green, dashed borders

Each theme is a self-contained Tailwind CSS bundle under `themes/<id>/theme.css`
that becomes the app's `globals.css` / `index.css`. The active theme is
announced on `<html data-pyon-theme="...">` so you can target it from custom
CSS. See `themes/README.md` for the full catalogue and instructions to add
your own.

**2. Color palette** — HSL overrides that sit on top of the chosen theme.
Eight curated presets are provided (`slate`, `zinc`, `emerald`, `rose`,
`indigo`, `amber`, `teal`, `cyan`), plus two dynamic modes:

- **custom hex** — give three hex codes (primary / background / accent) and
  the CLI converts them to HSL and fills the remaining tokens via a tiny
  built-in helper
- **url** — paste a website URL and the CLI asks OpenAI to infer a full
  palette (light + dark) from the site's visual identity

Palette presets live in `palettes/*.json`; see `palettes/README.md` for the
token list each palette overrides.

**3. Font** — picked from `fonts/fonts.json` (10 curated Google Fonts across
sans / mono / serif / display). The CLI injects the matching `<link>` tag
into both frontends and overrides `--font-sans` / `--font-mono` so shadcn
components pick it up automatically.

### AI copywriting

After the design picks, `pyon new` offers to fill every marketing, dashboard,
and seed-post copy slot with branded content. You can either:

- describe your product in a sentence (e.g. _"an AI meal-planner for
  families"_), or
- paste a reference website URL you'd like the tone/structure to resemble.

The CLI then calls OpenAI (defaulting to `gpt-5.4`, falling back to `gpt-4o`)
to produce every `__PYON_COPY_*__` token — hero titles, CTAs, feature
blurbs, pricing copy, dashboard greeting, seed blog post, etc. Your API key
is prompted interactively and **never persisted to disk**.

If you skip AI (`--no-ai`) or the network call fails, the CLI falls back to
curated generic copy from `cli/fallbacks/copy.json` so the scaffold always
builds cleanly.

See [`docs/THEMES.md`](docs/THEMES.md) for a deeper tour of the design
system, including how to add new themes, palettes, fonts, and copy slots.

### Non-interactive flags

All design + AI choices can be passed as flags for CI / scripting:

```bash
pyon new my-app --yes \
  --theme neo-brutalism \
  --palette emerald \
  --font space-grotesk \
  --describe "A minimalist invoicing tool for freelancers" \
  # or:  --ref-url https://linear.app
  # or:  --no-ai   (skip all OpenAI calls, use fallback copy)
```

## Local dev (the template itself)

```bash
pnpm install
pnpm -C apps/web dev       # http://localhost:3000
pnpm -C apps/app dev       # http://localhost:5173
dotnet run --project apps/api/Pyon.Api   # http://localhost:5080
```

Or bring up the full stack:

```bash
docker compose -f docker/docker-compose.yml up -d
```

## AI chat (Azure OpenAI)

The API ships with `POST /api/ai/chat` (JWT-protected) and the dashboard has a
`/chat` page that talks to it. It's off by default and turns on as soon as you
set a few environment variables on the API.

**Option A — Azure OpenAI (recommended)**

```bash
# .env (consumed by docker/docker-compose.yml)
AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com
AZURE_OPENAI_API_KEY=<key>
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini   # your Azure OpenAI deployment name
```

**Option B — plain OpenAI**

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Restart the API and hit the dashboard at `/chat`. `GET /api/ai/status` reports
whether the server considers itself configured.

**Provisioning on Azure via Terraform**

`infra/terraform/modules/openai` deploys an Azure OpenAI Cognitive Services
account plus a chat deployment. Enable it per-environment:

```hcl
# infra/terraform/environments/dev/terraform.tfvars
enable_openai        = true
openai_location      = "eastus"
openai_deployment    = "gpt-4o-mini"
openai_model         = "gpt-4o-mini"
openai_model_version = "2024-07-18"
openai_capacity      = 20
```

When `enable_openai = true`, the dev/prod stacks automatically wire
`AzureOpenAi__Endpoint`, `AzureOpenAi__ApiKey`, and `AzureOpenAi__Deployment`
into the API App Service settings.

## CLI reference

```
pyon new [name]          Scaffold a new project
pyon update              Pull latest template, show a diff against sibling pyon-stack/
pyon --version
pyon --help
```

## License

MIT
