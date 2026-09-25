import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'
const CASE_STUDIES_URL = `${BASE_URL}/case-studies`
const PROJECTS_PER_PAGE = 6

test.describe('Case Studies', () => {

    test('supports keyboard navigation for interactive controls', async ({ page }) => {
  const search = page.getByRole('searchbox', {
    name: 'Search case studies',
  })

  await search.focus()
  await expect(search).toBeFocused()

  await page.keyboard.press('Tab')

  const focusedElement = page.locator(':focus')
  await expect(focusedElement).toBeVisible()

  const firstProjectLink = page
    .locator('.case-card')
    .first()
    .getByRole('link')
    .first()

  await firstProjectLink.focus()
  await expect(firstProjectLink).toBeFocused()

  await page.keyboard.press('Enter')

  await expect(page).toHaveURL(
    /\/case-studies\/[^/]+$/,
    { timeout: 15000 },
  )

  await expect(
    page.getByRole('heading', { level: 1 }),
  ).toBeVisible()
})

  test.beforeEach(async ({ page }) => {
    const response = await page.goto(CASE_STUDIES_URL)

    expect(response?.status()).toBe(200)

    await expect(
      page.getByRole('heading', {
        name: 'Selected Projects',
        level: 2,
      }),
    ).toBeVisible()
  })

  test('displays the case studies listing', async ({ page }) => {
    const cards = page.locator('.case-card')

    await expect(cards.first()).toBeVisible()

    const totalProjects = await cards.count()

    expect(totalProjects).toBeGreaterThan(0)
    expect(totalProjects).toBeLessThanOrEqual(PROJECTS_PER_PAGE)

    await expect(page.getByRole('status')).toContainText(
      /showing \d+ of \d+ projects/i,
    )
  })

  test('filters projects by category', async ({ page }) => {
    const categoryButton = page.getByRole('button', {
      name: 'Web Development',
      exact: true,
    })

    await categoryButton.click()

    await expect(categoryButton).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    const cards = page.locator('.case-card')
    const count = await cards.count()

    if (count === 0) {
      await expect(
        page.getByRole('heading', {
          name: 'No case studies found',
        }),
      ).toBeVisible()

      return
    }

    for (const card of await cards.all()) {
      await expect(card.locator('.card-category')).toHaveText(
        'Web Development',
      )
    }
  })

  test('searches for a case study', async ({ page }) => {
    const firstCard = page.locator('.case-card').first()

    await expect(firstCard).toBeVisible()

    const firstProjectTitle = (
      await firstCard.locator('h2').innerText()
    ).trim()

    const search = page.getByRole('searchbox', {
      name: 'Search case studies',
    })

    await search.fill(firstProjectTitle)

    const cards = page.locator('.case-card')

    await expect(cards.first()).toBeVisible()

    const count = await cards.count()

    expect(count).toBeGreaterThan(0)

    for (const card of await cards.all()) {
      const cardText = (await card.innerText()).toLowerCase()

      expect(cardText).toContain(
        firstProjectTitle.toLowerCase(),
      )
    }
  })

  test('displays an empty state for an unmatched search', async ({
    page,
  }) => {
    const search = page.getByRole('searchbox', {
      name: 'Search case studies',
    })

    await search.fill('project-that-does-not-exist-12345')

    await expect(
      page.getByRole('heading', {
        name: 'No case studies found',
      }),
    ).toBeVisible()

    await expect(page.locator('.case-card')).toHaveCount(0)

    await expect(page.getByRole('status')).toContainText(
      /^Showing 0 of \d+ projects$/,
    )
  })

  test('navigates between listing pages', async ({ page }) => {
    const nextButton = page.getByRole('button', {
      name: 'Next page',
    })

    expect(
      await nextButton.count(),
      'Seed at least seven case studies to test pagination.',
    ).toBe(1)

    await expect(page.locator('.case-card')).toHaveCount(
      PROJECTS_PER_PAGE,
    )

    await expect(nextButton).toBeEnabled()

    await nextButton.click()

    await expect(
      page.getByText(/Page 2 of \d+/),
    ).toBeVisible()

    const previousButton = page.getByRole('button', {
      name: 'Previous page',
    })

    await expect(previousButton).toBeEnabled()

    await previousButton.click()

    await expect(
      page.getByText(/Page 1 of \d+/),
    ).toBeVisible()

    await expect(previousButton).toBeDisabled()
  })

  test('resets pagination when the search changes', async ({
    page,
  }) => {
    const firstCard = page.locator('.case-card').first()

    await expect(firstCard).toBeVisible()

    const firstProjectTitle = (
      await firstCard.locator('h2').innerText()
    ).trim()

    const nextButton = page.getByRole('button', {
      name: 'Next page',
    })

    expect(
      await nextButton.count(),
      'Seed at least seven case studies to test pagination reset.',
    ).toBe(1)

    await nextButton.click()

    await expect(
      page.getByText(/Page 2 of \d+/),
    ).toBeVisible()

    await page
      .getByRole('searchbox', {
        name: 'Search case studies',
      })
      .fill(firstProjectTitle)

    await expect(
      page.locator('.case-card').first(),
    ).toContainText(firstProjectTitle)

    await expect(
      page.getByText(/Page 2 of \d+/),
    ).toHaveCount(0)

    const previousButton = page.getByRole('button', {
      name: 'Previous page',
    })

    if (await previousButton.count()) {
      await expect(previousButton).toBeDisabled()
    }
  })

  test('opens a case study detail page', async ({ page }) => {
    const firstCard = page.locator('.case-card').first()

    await expect(firstCard).toBeVisible()

    const projectTitle = (
      await firstCard.locator('h2').innerText()
    ).trim()

    const projectLink = firstCard
      .locator('h2')
      .getByRole('link')

    const href = await projectLink.getAttribute('href')

    expect(href).not.toBeNull()
    expect(href).toMatch(/^\/case-studies\/[^/]+$/)

    await projectLink.click()

    await expect(page).toHaveURL(
    `${BASE_URL}${href}`,
    { timeout: 15000 },
    )

    await expect(
      page.getByRole('heading', {
        name: projectTitle,
        level: 1,
      }),
    ).toBeVisible()
  })

  test('shows a not-found page for an invalid slug', async ({
    page,
  }) => {
    await page.goto(
      `${CASE_STUDIES_URL}/project-that-does-not-exist-12345`,
    )

    await expect(
      page.getByText('This page could not be found.'),
    ).toBeVisible()

    await expect(
      page.locator('.case-detail-header'),
    ).toHaveCount(0)
  })
})