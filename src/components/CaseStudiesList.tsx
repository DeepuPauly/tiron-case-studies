
'use client'

import { useMemo, useState } from 'react'
import type { CaseStudy } from '@/payload-types'
import CaseStudyCard from './CaseStudyCard'

type Props = {
  studies: CaseStudy[]
}

const PROJECTS_PER_PAGE = 6

const categories = [
  { label: 'All Projects', value: 'all' },
  { label: 'Web Development', value: 'web-development' },
  { label: 'Mobile Apps', value: 'mobile-application' },
  { label: 'UI/UX Design', value: 'ui-ux-design' },
  { label: 'Digital Marketing', value: 'digital-marketing' },
]

export default function CaseStudiesList({
  studies,
}: Props) {
  // Search, category and pagination state
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter projects by category and search
  const filteredStudies = useMemo(() => {
    const searchQuery = search.trim().toLowerCase()

    return studies.filter((study) => {
      const matchesCategory =
        category === 'all' ||
        study.category === category

      const searchText = [
        study.title,
        study.client,
        study.summary,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        searchText.includes(searchQuery)

      return matchesCategory && matchesSearch
    })
  }, [studies, search, category])

  // Calculate the total number of pages
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredStudies.length / PROJECTS_PER_PAGE,
    ),
  )

  // Ensure the current page is within the valid range
  const activePage = Math.min(
    currentPage,
    totalPages,
  )

  // Calculate the starting index
  const startIndex =
    (activePage - 1) * PROJECTS_PER_PAGE

  // Get only the projects for the current page
  const paginatedStudies = useMemo(() => {
    return filteredStudies.slice(
      startIndex,
      startIndex + PROJECTS_PER_PAGE,
    )
  }, [filteredStudies, startIndex])

  // Generate page numbers
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  )

  // Reset pagination when category changes
  const handleCategoryChange = (
    selectedCategory: string,
  ) => {
    setCategory(selectedCategory)
    setCurrentPage(1)
  }

  // Reset pagination when search changes
  const handleSearchChange = (
    searchValue: string,
  ) => {
    setSearch(searchValue)
    setCurrentPage(1)
  }

  // Navigate to a specific page
  const handlePageChange = (
    pageNumber: number,
  ) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return
    }

    setCurrentPage(pageNumber)
  }

  return (
    <>
      {/* Category filters and search */}

      <div className="filter-section">
        <div
          className="category-filters"
          role="group"
          aria-label="Filter projects by category"
        >
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              className={
                category === item.value
                  ? 'filter-button active'
                  : 'filter-button'
              }
              aria-pressed={
                category === item.value
              }
              onClick={() =>
                handleCategoryChange(item.value)
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        <input
          className="search-input"
          type="search"
          placeholder="Search case studies..."
          value={search}
          onChange={(event) =>
            handleSearchChange(event.target.value)
          }
          aria-label="Search case studies"
        />
      </div>

      {/* Results count */}

      <div
        className="results-count"
        role="status"
        aria-live="polite"
      >
        Showing {filteredStudies.length} of{' '}
        {studies.length} projects
      </div>

      {/* Case study cards */}

      {filteredStudies.length > 0 ? (
        <>
          <div className="case-grid">
            {paginatedStudies.map((study) => (
              <CaseStudyCard
                key={study.id}
                study={study}
              />
            ))}
          </div>

          {/* Pagination controls */}

          {totalPages > 1 && (
            <nav
              className="pagination"
              aria-label="Case studies pagination"
            >
              {/* Previous button */}

              <button
                type="button"
                className="pagination-button"
                onClick={() =>
                  handlePageChange(activePage - 1)
                }
                disabled={activePage === 1}
                aria-label="Previous page"
              >
                ← Previous
              </button>

              {/* Page numbers */}

              <div className="pagination-numbers">
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    className={
                      activePage === pageNumber
                        ? 'pagination-button active'
                        : 'pagination-button'
                    }
                    onClick={() =>
                      handlePageChange(pageNumber)
                    }
                    aria-label={`Go to page ${pageNumber}`}
                    aria-current={
                      activePage === pageNumber
                        ? 'page'
                        : undefined
                    }
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              {/* Next button */}

              <button
                type="button"
                className="pagination-button"
                onClick={() =>
                  handlePageChange(activePage + 1)
                }
                disabled={
                  activePage === totalPages
                }
                aria-label="Next page"
              >
                Next →
              </button>
            </nav>
          )}

          {/* Current page information */}

          {totalPages > 1 && (
            <p className="pagination-info">
              Page {activePage} of {totalPages}
            </p>
          )}
        </>
      ) : (
        /* Empty state */

        <div className="empty-state">
          <h2>No case studies found</h2>

          <p>
            Try another search or select a
            different category.
          </p>
        </div>
      )}
    </>
  )
}