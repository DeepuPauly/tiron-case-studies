
# TIRON Case Studies

A case studies application built with Next.js App Router, Payload CMS, MongoDB, and Tailwind CSS.

The application provides a searchable, filterable case study listing and individual detail pages. Case study content is managed through Payload CMS and can be populated using the included CSV seed script.

## Requirements

- Node.js and npm
- MongoDB, running locally or accessible through a connection string

## Local setup

1. Clone the repository and open the project directory:

   ```bash
   git clone https://github.com/DeepuPauly/tiron-case-studies.git
   cd tiron-case-studies
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set the environment variables:

   ```env
   DATABASE_URL=mongodb://127.0.0.1/your-database-name
   PAYLOAD_SECRET=replace-with-a-long-random-secret
   ```

   `DATABASE_URL` is the MongoDB connection string. `PAYLOAD_SECRET` is used by Payload CMS; use a strong secret and do not commit your `.env` file.

4. Start MongoDB if you are using a local database.

5. Seed the case studies:

   ```bash
   npm run seed
   ```

   The seed script reads `seed.csv` and creates case studies that do not already exist with the same slug. Running it again skips existing slugs rather than creating duplicates; it does not overwrite existing case studies.

6. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000/case-studies](http://localhost:3000/case-studies) to view the listing. Open [http://localhost:3000/admin](http://localhost:3000/admin) to access Payload CMS and create an admin account if prompted.

## Features

- Case study listing with text search, category filtering, and pagination
- Individual case study pages with challenge, solution, results, and technologies
- Case study management through Payload CMS
- Reproducible CSV seed data
- Responsive layouts and accessible labels for search, filters, and pagination
- Accessible navigation loading, error, empty-result, and HTTP 404 not-found states
- Page-specific title, description, Open Graph, and Twitter metadata for case study details

Cover-image metadata is included when a case study has an associated image.

## Implementation decisions

### Search, filtering, and pagination

The listing fetches case studies on the server, then passes them to a client component. Search and category filtering operate on the fetched data, and pagination displays six matching case studies per page. Changing the search term or category resets the page number so that the user does not remain on an out-of-range page.

The current server query retrieves up to 100 case studies, ordered by newest creation date. This keeps the implementation straightforward for the assessment dataset, but it is not a complete solution for a larger collection: case studies beyond the first 100 would not appear in search or filter results. For a production-scale dataset, I would move search, filtering, and pagination into the database query and return the total matching count.

### Ordering and featured content

The listing uses newest-first ordering based on `createdAt`. The CMS also includes a `featured` field, but the current listing does not prioritize featured records. A future enhancement could define an explicit featured-first ordering and provide editorial controls for featured placement.

### Empty results

When a search or category selection produces no matches, the listing displays an empty-result message rather than an empty grid. The user can change or clear the active filters to see results again.

### Case studies without results

The results field is optional. If a case study does not have measurable results yet, the detail page omits the Results & Impact section rather than displaying an empty section or placeholder metrics. This keeps the page meaningful while allowing case studies to be published before final results are available.

### Caching and content updates

The case studies listing uses a 60-second revalidation interval. This reduces repeated server work while allowing listing updates to appear after the revalidation window.

The detail route also declares a 60-second revalidation interval, but it is rendered dynamically; the interval alone should not be treated as proof that its Payload queries are cached. For a production deployment, I would verify the route's caching behavior and add explicit, CMS-triggered cache invalidation where appropriate.

A route-level `loading.tsx` boundary was intentionally avoided because it caused a nonexistent case study to display not-found content while returning HTTP 200. Instead, case study links provide an accessible client-side navigation loading indicator with a visible spinner and `role="status"`. The loading animation also respects the user's `prefers-reduced-motion` setting. This preserves loading feedback during navigation while allowing nonexistent case study URLs to return the correct HTTP 404 response.

## Tests

Run the integration tests:

```bash
npm run test:int
```

Run the end-to-end tests:

```bash
npm run test:e2e
```

Run both suites:

```bash
npm run test
```

The end-to-end suite uses Playwright. If browser binaries are not installed, install them with:

```bash
npx playwright install
```

## Production build

```bash
npm run build
npm run start
```

The application requires access to MongoDB and the environment variables described above when running.

## What I would improve with more time

- Move listing search, filtering, and pagination to database-backed queries for larger datasets.
- Add explicit featured-content ordering and editorial controls.
- Add CMS-triggered cache invalidation and verify detail-page caching behavior.
- Expand automated coverage for seeding, metadata, accessibility, and CMS content changes.
- Add deployment configuration, monitoring, and production media storage.