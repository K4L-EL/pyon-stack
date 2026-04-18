export default function AboutPage() {
  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight">__PYON_COPY_ABOUT_TITLE__</h1>
      <p className="mt-6 text-muted-foreground whitespace-pre-line">
        __PYON_COPY_ABOUT_BODY__
      </p>
      <h2 className="mt-12 text-2xl font-semibold">__PYON_COPY_ABOUT_VALUES_TITLE__</h2>
      <ul className="mt-4 space-y-2 text-muted-foreground list-disc pl-6">
        <li>__PYON_COPY_ABOUT_VALUE_1__</li>
        <li>__PYON_COPY_ABOUT_VALUE_2__</li>
        <li>__PYON_COPY_ABOUT_VALUE_3__</li>
      </ul>
    </div>
  );
}
