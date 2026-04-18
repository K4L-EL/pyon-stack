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

## CLI reference

```
pyon new [name]          Scaffold a new project
pyon update              Pull latest template, show a diff against sibling pyon-stack/
pyon --version
pyon --help
```

## License

MIT
