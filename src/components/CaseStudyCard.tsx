import CaseStudyLink from '@/components/CaseStudyLink'
import type { CaseStudy } from '@/payload-types'

type Props = {
  study: CaseStudy
}

export default function CaseStudyCard({ study }: Props) {
  const image =
    typeof study.coverImage === 'object' && study.coverImage !== null ? study.coverImage : null

  const categoryLabels: Record<string, string> = {
    'web-development': 'Web Development',
    'mobile-application': 'Mobile Application',
    'ui-ux-design': 'UI/UX Design',
    'digital-marketing': 'Digital Marketing',
  }

  return (
    <article className="case-card flex h-full flex-col overflow-hidden">
      <CaseStudyLink href={`/case-studies/${study.slug}`} className="card-image-link">
        <div className="card-image">
          {image?.url ? (
            <img src={image.url} alt={image.alt || study.title} loading="lazy" />
          ) : (
            <div className="image-placeholder">
              <span>{study.title}</span>
            </div>
          )}

          {study.featured && <span className="featured-badge">Featured</span>}
        </div>
      </CaseStudyLink>

      <div className="card-content">
        <span className="card-category">{categoryLabels[study.category] || study.category}</span>

        <h2>
          <CaseStudyLink href={`/case-studies/${study.slug}`}>{study.title}</CaseStudyLink>
        </h2>

        <p className="card-client">{study.client}</p>

        <p className="card-summary">{study.summary}</p>

        <CaseStudyLink href={`/case-studies/${study.slug}`} className="card-link">
          View Case Study &rarr;
        </CaseStudyLink>
      </div>
    </article>
  )
}