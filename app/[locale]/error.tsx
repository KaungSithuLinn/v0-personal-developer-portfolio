"use client"

// Audit P0-1: locale error boundary

export default function LocaleError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-card dark:from-background dark:to-card p-6">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground mb-8">
          We encountered an unexpected error in this section. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
