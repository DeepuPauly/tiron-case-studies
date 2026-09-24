
import { getPayload } from 'payload'
import config from '@/payload.config'
import CaseStudiesList from '@/components/CaseStudiesList'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({
    config,
  })

  const { docs: caseStudies, totalDocs } =
    await payload.find({
      collection: 'case-studies',
      depth: 1,
      limit: 100,
      sort: '-createdAt',
    })

  return (
    <div className="site-wrapper">
      <header className="site-header">
        <div className="container header-content">
          <a href="/" className="logo">
            TIRON<span>.</span>
          </a>

          <nav className="navigation">
            <a href="/">Case Studies</a>
            <a href="/admin">Admin Panel</a>
          </nav>
        </div>
      </header>

      <main>
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
                <strong>04</strong>
                <span>Categories</span>
              </div>
            </div>
          </div>
        </section>

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

            <CaseStudiesList
              studies={caseStudies}
            />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <span>TIRON.</span>
          <p>
            © {new Date().getFullYear()} Tiron.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}