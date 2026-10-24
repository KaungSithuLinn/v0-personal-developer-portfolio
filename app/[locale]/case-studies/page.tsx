export default function CaseStudiesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Case Studies</h1>
      <p className="mt-4 text-muted-foreground">
        Detailed write-ups of selected projects, including problem, approach, and measurable outcomes.
      </p>
      <article className="mt-8 rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold">Fraud Detection Platform</h2>
        <p className="mt-2 text-muted-foreground">
          Built behavioral biometrics and risk scoring workflows to reduce fraudulent transactions.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
          <li>Improved detection accuracy through multi-signal risk scoring.</li>
          <li>Reduced manual review load with automated triage.</li>
          <li>Delivered measurable fraud-loss reduction.</li>
        </ul>
      </article>
    </main>
  )
}
