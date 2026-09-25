import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Case Studies API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches case studies ordered by newest first', async () => {
    const result = await payload.find({
      collection: 'case-studies',
      limit: 100,
      sort: '-createdAt',
    })

    expect(result).toBeDefined()
    expect(Array.isArray(result.docs)).toBe(true)
    expect(result.docs.length).toBeGreaterThan(0)

    for (let i = 1; i < result.docs.length; i += 1) {
      const previousDate = new Date(result.docs[i - 1].createdAt).getTime()
      const currentDate = new Date(result.docs[i].createdAt).getTime()

      expect(previousDate).toBeGreaterThanOrEqual(currentDate)
    }

    const firstStudy = result.docs[0]

    expect(firstStudy).toHaveProperty('title')
    expect(firstStudy).toHaveProperty('slug')
    expect(firstStudy).toHaveProperty('client')
    expect(firstStudy).toHaveProperty('category')
    expect(firstStudy).toHaveProperty('summary')
  })
})
