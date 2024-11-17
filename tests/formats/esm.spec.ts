import { test, createSortableTests } from '../sortable-test-base'

// Use override for the fixture
test.use({
  formatName: 'esm',
  getUrl: async ({}, use) => {
    await use((minified: boolean) => `/esm.html${minified ? '?minified=true' : ''}`)
  },
})

createSortableTests()
