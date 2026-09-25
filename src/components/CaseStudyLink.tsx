'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'

type Props = {
  href: string
  className?: string
  children: ReactNode
}

export default function CaseStudyLink({ href, className, children }: Props) {
  const [isNavigating, setIsNavigating] = useState(false)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    setIsNavigating(true)
  }

  return (
    <>
      <Link href={href} className={className} onClick={handleClick}>
        {children}
      </Link>

      {isNavigating && (
        <span className="case-navigation-loading" role="status" aria-live="polite">
          Loading case study…
        </span>
      )}
    </>
  )
}
