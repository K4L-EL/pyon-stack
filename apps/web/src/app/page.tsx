import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="container py-24">
      <div className="mx-auto max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-semibold tracking-tight">
          __PYON_DISPLAY_NAME__
        </h1>
        <p className="text-lg text-muted-foreground">
          A modern full-stack starter. Next.js marketing, a Vite dashboard with admin &amp; CMS,
          an ASP.NET Core API on Postgres, and Terraform infrastructure — ready in one command.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/signup" className={buttonVariants()}>Get started</Link>
          <Link href="/blog" className={buttonVariants({ variant: "outline" })}>Read the blog</Link>
        </div>
      </div>

      <div className="mt-24 grid gap-6 md:grid-cols-3">
        {[
          { t: "Ship fast", d: "Batteries-included auth, admin, and CMS." },
          { t: "Typed end-to-end", d: "TypeScript + C# + EF Core, one source of truth." },
          { t: "Deploy anywhere", d: "Terraform + Docker. Bring your own cloud." },
        ].map((f) => (
          <div key={f.t} className="rounded-xl border p-6">
            <h3 className="font-semibold">{f.t}</h3>
            <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
