export default function AboutPage() {
  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight">About __PYON_DISPLAY_NAME__</h1>
      <p className="mt-6 text-muted-foreground">
        __PYON_DISPLAY_NAME__ is built on the PYON stack. Replace this copy with your
        company story, team, and values.
      </p>
      <h2 className="mt-12 text-2xl font-semibold">What we believe</h2>
      <ul className="mt-4 space-y-2 text-muted-foreground list-disc pl-6">
        <li>Boring technology is a feature.</li>
        <li>Typed boundaries, untyped meetings.</li>
        <li>Ship small, ship often.</li>
      </ul>
    </div>
  );
}
