
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { CaseStudy, Media } from '@/payload-types'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function CaseStudyPage({
  params,
}: PageProps) {
  const { slug } = await params

  // Connect to Payload CMS
  const payload = await getPayload({ config })

  // Find the case study using its slug
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 1,
  })

  // Return 404 if the case study does not exist
  if (docs.length === 0) {
    notFound()
  }

  const study: CaseStudy = docs[0]

  // Get the uploaded cover image
  const coverImage =
    study.coverImage &&
    typeof study.coverImage === 'object'
      ? (study.coverImage as Media)
      : null

  const imageUrl = coverImage?.url || null

  // Format the category name
  const categoryLabels: Record<string, string> = {
    'web-development': 'Web Development',
    'mobile-application': 'Mobile Application',
    'ui-ux-design': 'UI/UX Design',
    'digital-marketing': 'Digital Marketing',
  }

  const category =
    categoryLabels[study.category] || study.category

  return (
    <main className="case-detail">

      {/* Navigation */}
      <div className="case-detail-container">
        <Link
          href="/case-studies"
          className="case-back-link"
        >
          ← Back to Case Studies
        </Link>

        {/* Project Header */}
        <header className="case-detail-header">

          <span className="case-category">
            {category}
          </span>

          <h1>{study.title}</h1>

          <p className="case-summary">
            {study.summary}
          </p>

          <div className="case-meta">

            <div>
              <span>CLIENT</span>
              <strong>{study.client}</strong>
            </div>

            {study.completedAt && (
              <div>
                <span>COMPLETED</span>
                <strong>
                  {new Date(
                    study.completedAt
                  ).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })}
                </strong>
              </div>
            )}

            <div>
              <span>CATEGORY</span>
              <strong>{category}</strong>
            </div>

          </div>
        </header>

        {/* Cover Image */}
        {imageUrl && (
          <div className="case-cover">
            <img
              src={imageUrl}
              alt={
                coverImage?.alt || study.title
              }
            />
          </div>
        )}

        {/* Challenge */}
        <section className="case-section">
          <span className="section-label">
            01 / THE CHALLENGE
          </span>

          <h2>The Challenge</h2>

          <p>{study.challenge}</p>
        </section>

        {/* Solution */}
        <section className="case-section">
          <span className="section-label">
            02 / OUR SOLUTION
          </span>

          <h2>The Solution</h2>

          <p>{study.solution}</p>
        </section>

        {/* Results */}
        {study.results &&
          study.results.length > 0 && (
            <section className="case-section">

              <span className="section-label">
                03 / PROJECT RESULTS
              </span>

              <h2>Results & Impact</h2>

              <div className="case-results">
                {study.results.map(
                  (result, index) => (
                    <div
                      key={result.id || index}
                      className="result-card"
                    >
                      <strong>
                        {result.value}
                      </strong>

                      <span>
                        {result.metric}
                      </span>
                    </div>
                  )
                )}
              </div>

            </section>
          )}

        {/* Technologies */}
        {study.technologies &&
          study.technologies.length > 0 && (
            <section className="case-section">

              <span className="section-label">
                04 / TECHNOLOGY STACK
              </span>

              <h2>Technologies Used</h2>

              <div className="case-technologies">
                {study.technologies.map(
                  (technology, index) => (
                    <span
                      key={technology.id || index}
                      className="technology-tag"
                    >
                      {technology.name}
                    </span>
                  )
                )}
              </div>

            </section>
          )}

        {/* Footer Navigation */}
        <div className="case-detail-footer">
          <Link href="/case-studies">
            ← Explore More Projects
          </Link>
        </div>

      </div>
    </main>
  )
}