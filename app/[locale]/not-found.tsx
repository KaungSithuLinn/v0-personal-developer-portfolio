"use client"

// Audit P0-1: locale not-found handler

import Link from "next/link"

export default function LocaleNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-md w-full text-center">
        <h2 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h2>
        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
