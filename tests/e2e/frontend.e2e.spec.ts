import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/')

    expect(response?.status()).toBe(200)

    await expect(page).toHaveTitle(/Tiron\s*\|\s*Case Studies/i)

    const heading = page.locator('h1').first()

    await expect(heading).toBeVisible()

    await expect(heading).toContainText('Work that makes')
    await expect(heading).toContainText('an impact.')
  })
})