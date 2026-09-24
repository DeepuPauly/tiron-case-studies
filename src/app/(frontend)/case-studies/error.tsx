
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

type ErrorProps = {
  error: Error & {
    digest?: string
  }
  reset: () => void
}

export default function ErrorPage({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error('Case studies route error:', error)
  }, [error])

  return (
    <main className="case-detail flex min-h-screen items-center justify-center text-center">
      <div className="case-detail-container w-full max-w-[650px]">
        {/* Error label */}
        <span className="eyebrow">
          SOMETHING WENT WRONG
        </span>

        {/* Error heading */}
        <h1 className="mt-[25px] mb-5 text-[clamp(36px,5vw,60px)] leading-[1.2] tracking-[-2px]">
          Unable to Load
          <br />
          <span className="text-[var(--accent)]">
            Case Studies.
          </span>
        </h1>

        {/* Error description */}
        <p className="mt-5 mb-[35px] text-lg leading-[1.8] text-[var(--muted)]">
          We encountered an unexpected error
          while loading the page.
          Please try again or return to
          the homepage.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-5">
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-sm font-bold text-[#101010] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--accent)] no-underline transition-colors hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            ← Return Home
          </Link>
        </div>
      </div>
    </main>
  )
}