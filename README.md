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
