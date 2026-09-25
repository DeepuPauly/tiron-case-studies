
import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import CaseStudiesList from '@/components/CaseStudiesList'

export const revalidate = 60

export default async function CaseStudiesPage() {
  const payload = await getPayload({ config })

  // Fetch case studies from Payload CMS
  const { docs: studies, totalDocs } = await payload.find({
    collection: 'case-studies',
    depth: 1,
    limit: 100,
    sort: '-createdAt',
  })

  const categories = new Set(
    studies.map((study) => study.category),
  )

  return (
    <div className="site-wrapper min-h-screen w-full">

      {/* Header */}
      <header className="site-header">
        <div className="container header-content">

          <Link href="/" className="logo">
            TIRON<span>.</span>
          </Link>

          <nav className="navigation">
            <Link href="/case-studies">
              Case Studies
            </Link>

            <Link href="/admin">
              Admin Panel
            </Link>
          </nav>

        </div>
      </header>

      <main>

        {/* Hero Section */}
        <section className="hero">
          <div className="container">

            <span className="eyebrow">
              OUR PORTFOLIO
            </span>

            <h1>
              Work that makes
              <br />
              an <span>impact.</span>
            </h1>

            <p className="hero-description">
              Explore our collection of digital
              experiences, innovative applications,
              and creative solutions.
            </p>

            <div className="hero-stats">

              <div>
                <strong>{totalDocs}</strong>
                <span>Projects</span>
              </div>

              <div>
                <strong>
                  {String(categories.size).padStart(2, '0')}
                </strong>
                <span>Categories</span>
              </div>

            </div>

          </div>
        </section>

        {/* Projects Section */}
        <section className="projects-section">
          <div className="container">

            <div className="section-heading">

              <span className="eyebrow">
                EXPLORE OUR WORK
              </span>

              <h2>Selected Projects</h2>

              <p>
                Discover the challenges we have
                solved and the solutions we have
                created.
              </p>

            </div>

            {/* Search, Filters and Project Cards */}
            <CaseStudiesList studies={studies} />

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-content">

          <span>
            TIRON<span style={{ color: '#a3e635' }}>.</span>
          </span>

          <p>
            &copy; {new Date().getFullYear()} Tiron.
            All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  )
}