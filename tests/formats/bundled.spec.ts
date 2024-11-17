import { test, createSortableTests } from '../sortable-test-base'

// Use override for the fixture
test.use({
  formatName: 'bundled',
  getUrl: async ({}, use) => {
    await use((minified: boolean) => `/bundled.html${minified ? '?minified=true' : ''}`)
  },
})

createSortableTests()
