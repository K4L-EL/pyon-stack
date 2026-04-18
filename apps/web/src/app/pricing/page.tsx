import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const tiers = [
  { name: "Starter", price: "$0", features: ["Up to 3 users", "Community support"] },
  { name: "Team", price: "$29", features: ["Unlimited users", "Email support", "Admin panel"] },
  { name: "Enterprise", price: "Contact", features: ["SSO", "SLA", "Dedicated support"] },
];

export default function PricingPage() {
  return (
    <div className="container py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold tracking-tight">Pricing</h1>
        <p className="mt-4 text-muted-foreground">Simple plans. Cancel anytime.</p>
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
