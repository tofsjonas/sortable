// tests/formats/auto.spec.ts
import { test, createSortableTests } from '../sortable-test-base'
import { expect } from '@playwright/test'

test.describe('auto', () => {
  test.use({
    formatName: 'auto',
    getUrl: async ({}, use) => {
      await use((minified: boolean) => `/auto.html${minified ? '?minified=true' : ''}`)
    },
  })

  createSortableTests()

  // Test specific to auto version - dynamic table addition and sorting
  for (const minified of [false, true]) {
    const minifiedVariant = minified ? '(minified)' : ''

    test.describe(minifiedVariant, () => {
      test.beforeEach(async ({ page, getUrl }) => {
        await page.goto(getUrl(minified))
      })

      test(`dynamically added table is sorted by MutationObserver`, async ({ page, formatName }) => {
        test.info().title = `[${formatName}] dynamically added table is sorted by MutationObserver`

        // Wait for the dynamically added table (added via setTimeout in index.html after 600ms)
        // We wait 1000ms to ensure it has time to be added and processed by the MutationObserver
        await page.waitForTimeout(1000)

        // Find the dynamically added table (should be the last table on the page)
        const allTables = await page.$$('table.sortable')
        const dynamicTable = allTables[0]

        // Verify the table exists
        expect(dynamicTable).toBeTruthy()

        const nameHeader = await dynamicTable.$('th:first-child')
        expect(nameHeader).toBeTruthy()

        const ariaSortValue = await nameHeader?.getAttribute('aria-sort')
        expect(ariaSortValue).toBe('ascending')

        // Verify the table has been sorted correctly
        const firstRowName = await dynamicTable.$eval('tbody tr:first-child td:first-child', (el) => el.textContent)
        const secondRowName = await dynamicTable.$eval('tbody tr:nth-child(2) td:first-child', (el) => el.textContent)

        expect(firstRowName).toBe('Jane Smith')
        expect(secondRowName).toBe('John Doe')

        // Test that we can still interact with the dynamically added table
        await nameHeader?.click()
        await page.waitForTimeout(100)

        // After clicking, it should sort in descending order
        const newAriaSortValue = await nameHeader?.getAttribute('aria-sort')
        expect(newAriaSortValue).toBe('descending')

        // Now Jane Smith should be first (ascending alphabetical order)
        const newFirstRowName = await dynamicTable.$eval('tbody tr:first-child td:first-child', (el) => el.textContent)
        const newSecondRowName = await dynamicTable.$eval(
          'tbody tr:nth-child(2) td:first-child',
          (el) => el.textContent,
        )
        expect(newFirstRowName).toBe('John Doe')
        expect(newSecondRowName).toBe('Jane Smith')
      })
    })
  }
})
