import { test, createSortableTests } from '../sortable-test-base'

test.describe('bundled', () => {
  test.use({
    formatName: 'bundled',
    getUrl: async ({}, use) => {
      await use((minified: boolean) => `/bundled.html${minified ? '?minified=true' : ''}`)
    },
  })

  createSortableTests()
})
