import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="container py-24">
      <div className="mx-auto max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-semibold tracking-tight">
          __PYON_COPY_HERO_TITLE__
        </h1>
        <p className="text-lg text-muted-foreground">
          __PYON_COPY_HERO_SUB__
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/signup" className={buttonVariants()}>__PYON_COPY_HERO_CTA_PRIMARY__</Link>
          <Link href="/blog" className={buttonVariants({ variant: "outline" })}>__PYON_COPY_HERO_CTA_SECONDARY__</Link>
        </div>
      </div>

      <div className="mt-24 grid gap-6 md:grid-cols-3">
        {[
          { t: "__PYON_COPY_FEATURE_1_TITLE__", d: "__PYON_COPY_FEATURE_1_DESC__" },
          { t: "__PYON_COPY_FEATURE_2_TITLE__", d: "__PYON_COPY_FEATURE_2_DESC__" },
          { t: "__PYON_COPY_FEATURE_3_TITLE__", d: "__PYON_COPY_FEATURE_3_DESC__" },
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
