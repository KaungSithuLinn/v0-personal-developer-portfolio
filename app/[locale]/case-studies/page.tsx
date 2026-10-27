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
        <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Problem</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Fraud signals were fragmented, making manual review slow and inconsistent.
        </p>
        <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Approach</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Combined device, session, and behavioral signals into a multi-signal risk scoring workflow with automated triage.
        </p>
        <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Outcome</h3>
        <ul className="mt-1 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
          <li>Improved detection accuracy through multi-signal risk scoring.</li>
          <li>Reduced manual review load with automated triage.</li>
          <li>Delivered measurable fraud-loss reduction.</li>
        </ul>
      </article>

      <article className="mt-8 rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold">AI Portfolio Assistant</h2>
        <p className="mt-2 text-muted-foreground">
          Added a streaming AI assistant to help visitors explore projects, skills, and contact options.
        </p>
        <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Problem</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Static portfolio content made it hard for recruiters to quickly find relevant experience.
        </p>
        <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Approach</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Implemented a server-side Groq proxy with rate limiting, CSRF protection, and a client streaming widget.
        </p>
        <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Outcome</h3>
        <ul className="mt-1 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
          <li>Added interactive project discovery without exposing API keys.</li>
          <li>Kept responses concise and portfolio-focused.</li>
          <li>Preserved accessibility and responsive layout.</li>
        </ul>
      </article>
    </main>
  )
}
