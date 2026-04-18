import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const tiers = [
  {
    name: "__PYON_COPY_PRICING_TIER_1_NAME__",
    price: "__PYON_COPY_PRICING_TIER_1_PRICE__",
    features: [
      "__PYON_COPY_PRICING_TIER_1_FEATURE_1__",
      "__PYON_COPY_PRICING_TIER_1_FEATURE_2__",
    ],
  },
  {
    name: "__PYON_COPY_PRICING_TIER_2_NAME__",
    price: "__PYON_COPY_PRICING_TIER_2_PRICE__",
    features: [
      "__PYON_COPY_PRICING_TIER_2_FEATURE_1__",
      "__PYON_COPY_PRICING_TIER_2_FEATURE_2__",
      "__PYON_COPY_PRICING_TIER_2_FEATURE_3__",
    ],
  },
  {
    name: "__PYON_COPY_PRICING_TIER_3_NAME__",
    price: "__PYON_COPY_PRICING_TIER_3_PRICE__",
    features: [
      "__PYON_COPY_PRICING_TIER_3_FEATURE_1__",
      "__PYON_COPY_PRICING_TIER_3_FEATURE_2__",
      "__PYON_COPY_PRICING_TIER_3_FEATURE_3__",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="container py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold tracking-tight">__PYON_COPY_PRICING_TITLE__</h1>
        <p className="mt-4 text-muted-foreground">__PYON_COPY_PRICING_SUB__</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {tiers.map((t) => (
          <Card key={t.name}>
            <CardHeader>
              <CardTitle>{t.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-semibold text-foreground">{t.price}</span>
                {t.price.startsWith("$") ? <span className="text-muted-foreground"> / mo</span> : null}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {t.features.map((f) => <li key={f}>• {f}</li>)}
              </ul>
              <Link href="/signup" className={buttonVariants({ className: "w-full" })}>
                Choose {t.name}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
