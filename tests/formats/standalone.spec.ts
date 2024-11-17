import { test, createSortableTests } from '../sortable-test-base'

// Use override for the fixture
test.use({
  formatName: 'standalone',
  getUrl: async ({}, use) => {
    await use((minified: boolean) => `/standalone.html${minified ? '?minified=true' : ''}`)
  },
})

createSortableTests()
