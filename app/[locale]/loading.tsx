export default function LocaleLoading() {
  return (
    <main
      className="mx-auto flex min-h-[60vh] max-w-4xl flex-col justify-center px-6 py-16"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading portfolio content</span>
      <div
        aria-hidden="true"
        className="font-mono text-xs leading-5 text-muted-foreground/70 sm:text-sm"
      >
        <div className="mb-6 h-10 w-2/3 animate-pulse rounded bg-muted/40" />
        <div className="mb-3 h-4 w-full animate-pulse rounded bg-muted/30" />
        <div className="mb-3 h-4 w-11/12 animate-pulse rounded bg-muted/30" />
        <div className="mb-8 h-4 w-4/5 animate-pulse rounded bg-muted/30" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 animate-pulse rounded-xl border border-border/60 bg-muted/20" />
          <div className="h-32 animate-pulse rounded-xl border border-border/60 bg-muted/20" />
        </div>
      </div>
    </main>
  )
}