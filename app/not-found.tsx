"use client"

// Audit P0-1: root not-found handler

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-card dark:from-background dark:to-card p-6">
      <div className="max-w-md w-full text-center">
        <h2 className="text-6xl font-bold text-foreground mb-4">
          404
        </h2>
        <h3 className="text-2xl font-semibold text-foreground mb-4">
          Page Not Found
        </h3>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
