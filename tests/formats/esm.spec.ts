// tests/formats/esm.spec.ts
import { test, createSortableTests } from '../sortable-test-base'

test.describe('esm', () => {
  test.use({
    formatName: 'esm',
    getUrl: async ({}, use) => {
      await use((minified: boolean) => `/esm.html${minified ? '?minified=true' : ''}`)
    },
  })

  createSortableTests()
})
