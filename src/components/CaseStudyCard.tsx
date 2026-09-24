
import Link from 'next/link'
import type { CaseStudy } from '@/payload-types'

type Props = {
  study: CaseStudy
}

export default function CaseStudyCard({ study }: Props) {
  const image =
    typeof study.coverImage === 'object' &&
    study.coverImage !== null
      ? study.coverImage
      : null

  const categoryLabels: Record<string, string> = {
    'web-development': 'Web Development',
    'mobile-application': 'Mobile Application',
    'ui-ux-design': 'UI/UX Design',
    'digital-marketing': 'Digital Marketing',
  }

  return (
    <article className="case-card">
      <Link
        href={`/case-studies/${study.slug}`}
        className="card-image-link"
      >
        <div className="card-image">
          {image?.url ? (
            <img
              src={image.url}
              alt={image.alt || study.title}
              loading="lazy"
            />
          ) : (
            <div className="image-placeholder">
              <span>{study.title}</span>
            </div>
          )}

          {study.featured && (
            <span className="featured-badge">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="card-content">
        <span className="card-category">
          {categoryLabels[study.category] ||
            study.category}
        </span>

        <h2>
          <Link href={`/case-studies/${study.slug}`}>
            {study.title}
          </Link>
        </h2>

        <p className="card-client">
          {study.client}
        </p>

        <p className="card-summary">
          {study.summary}
        </p>

        <Link
          href={`/case-studies/${study.slug}`}
          className="card-link"
        >
          View Case Study →
        </Link>
      </div>
    </article>
  )
}