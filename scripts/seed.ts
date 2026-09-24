
import 'dotenv/config'

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse } from 'csv-parse/sync'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

type SeedRow = {
  title: string
  slug: string
  client: string
  category: string
  summary: string
  challenge: string
  solution: string
  featured: string
  completedAt: string
}

const validCategories = [
  'web-development',
  'mobile-application',
  'ui-ux-design',
  'digital-marketing',
] as const

type Category = (typeof validCategories)[number]

async function seed() {
  const payload = await getPayload({ config })

  try {
    const csvPath = path.resolve(dirname, '../seed.csv')

    const csvContent = readFileSync(csvPath, 'utf-8')

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    }) as SeedRow[]

    console.log(`Found ${records.length} case studies in CSV.`)

    for (const record of records) {
      if (!record.slug || !record.title) {
        throw new Error('A CSV row is missing a title or slug.')
      }

      if (
        !validCategories.includes(
          record.category as Category,
        )
      ) {
        throw new Error(
          `Invalid category: ${record.category}`,
        )
      }

      const existing = await payload.find({
        collection: 'case-studies',
        where: {
          slug: {
            equals: record.slug,
          },
        },
        limit: 1,
      })

      if (existing.totalDocs > 0) {
        console.log(`Skipping existing: ${record.title}`)
        continue
      }

      await payload.create({
        collection: 'case-studies',
        data: {
          title: record.title,
          slug: record.slug,
          client: record.client,
          category: record.category as Category,
          summary: record.summary,
          challenge: record.challenge,
          solution: record.solution,
          featured:
            record.featured.toLowerCase() === 'true',
          ...(record.completedAt
            ? { completedAt: record.completedAt }
            : {}),
        },
      })

      console.log(`Created: ${record.title}`)
    }

    console.log('CSV import completed successfully!')
  } finally {
    await payload.db.destroy?.()
  }
}

seed().catch((error) => {
  console.error('CSV import failed:', error)
  process.exitCode = 1
})