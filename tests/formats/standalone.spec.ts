import { test, createSortableTests } from '../sortable-test-base'

test.describe('standalone', () => {
  test.use({
    formatName: 'standalone',
    getUrl: async ({}, use) => {
      await use((minified: boolean) => `/standalone.html${minified ? '?minified=true' : ''}`)
    },
  })

  createSortableTests()
})
