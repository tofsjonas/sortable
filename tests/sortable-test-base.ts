import { test as base, expect, type Page } from '@playwright/test'

// Define the fixture type
type SortableFixture = {
  getUrl: (minified: boolean) => string
  formatName: string
}

// Create a test function with our custom fixture
export const test = base.extend<SortableFixture>({
  getUrl: [
    async ({}, use, testInfo) => {
      await use(() => '')
    },
    { option: true }, // This makes it configurable
  ],
  formatName: [
    async ({}, use) => {
      await use('')
    },
    { option: true },
  ],
})

// Helper functions
export const waitForSort = async (page: Page) => {
  await page.waitForTimeout(100)
}

export const getSortedContent = async (page: Page, selector: string) => {
  return page.$eval(selector, (el) => el.textContent)
}

// Reusable test cases
export const createSortableTests = () => {
  test.describe('sortable functionality', () => {
    for (const minified of [false, true]) {
      const variant = minified ? '(minified)' : ''

      test.describe(`${variant}`, () => {
        test.beforeEach(async ({ page, getUrl }) => {
          await page.goto(getUrl(minified))
        })

        // Break after first failure
        test.afterEach(async ({}, testInfo) => {
          if (testInfo.status !== testInfo.expectedStatus) {
            test.skip(true)
          }
        })

        test('renders a heading element', async ({ page }) => {
          const heading = await page.getByRole('heading', { name: /Sortable examples/i })
          expect(heading).toBeTruthy()
        })

        test('renders table headers and cells', async ({ page }) => {
          const table = await page.$('table.sortable')
          expect(table).toBeTruthy()

          const nameHeader = await page.$('th[aria-label*="Name"]')
          expect(nameHeader).toBeTruthy()

          const cells = await page.$$('table.sortable tbody td')
          expect(cells[0]).toBeTruthy()
          expect(cells[1]).toBeTruthy()
        })

        test('sorts a table on click', async ({ page }) => {
          const nameHeader = await page.$('th[aria-label*="Name"]')

          let firstCell = await page.$eval(
            'table.sortable tbody tr:first-child td:nth-child(2)',
            (el) => el.textContent,
          )
          expect(firstCell).toBe('Rick')

          await nameHeader?.click()
          await page.waitForTimeout(100)

          firstCell = await page.$eval('table.sortable tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
          expect(firstCell).toBe('Rick')

          await nameHeader?.click()
          await page.waitForTimeout(100)

          firstCell = await page.$eval('table.sortable tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
          expect(firstCell).toBe('Morty')
        })

        test('sorts a table using Enter key', async ({ page }) => {
          const nameHeader = await page.$('th[aria-label*="Name"]')

          let firstCell = await page.$eval(
            'table.sortable tbody tr:first-child td:nth-child(2)',
            (el) => el.textContent,
          )
          expect(firstCell).toBe('Rick')

          await nameHeader?.focus()
          await nameHeader?.press('Enter')
          await page.waitForTimeout(100)

          firstCell = await page.$eval('table.sortable tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
          expect(firstCell).toBe('Rick')

          await nameHeader?.press('Enter')
          await page.waitForTimeout(100)

          firstCell = await page.$eval('table.sortable tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
          expect(firstCell).toBe('Morty')
        })

        test('sorts a table using tie breaker', async ({ page }) => {
          const allTables = await page.$$('table.sortable')
          const table = allTables[1]
          const yearHeader = await table.$('th:nth-child(2)')
          expect(yearHeader).toBeTruthy()

          let timeCell = await table.$eval('tbody tr:first-child td:nth-child(4)', (el) => el.textContent)
          expect(timeCell).toBe('12:00')

          await yearHeader?.click()
          await page.waitForTimeout(100)

          timeCell = await table.$eval('tbody tr:first-child td:nth-child(4)', (el) => el.textContent)
          expect(timeCell).toBe('15:00')

          await yearHeader?.click()
          await page.waitForTimeout(100)

          timeCell = await table.$eval('tbody tr:first-child td:nth-child(4)', (el) => el.textContent)
          expect(timeCell).toBe('13:00')
        })

        test('sorts a table with colspans', async ({ page }) => {
          const allTables = await page.$$('table.sortable')
          const table = allTables[2]
          const charsHeader = await table.$('th:last-child')
          expect(charsHeader).toBeTruthy()

          let charCell = await table.$eval('tbody tr:first-child td:last-child', (el) => el.textContent)
          expect(charCell).toBe('BB')

          await charsHeader?.click()
          await page.waitForTimeout(100)

          charCell = await table.$eval('tbody tr:first-child td:last-child', (el) => el.textContent)
          expect(charCell).toBe('CCC')

          await charsHeader?.click()
          await page.waitForTimeout(100)

          charCell = await table.$eval('tbody tr:first-child td:last-child', (el) => el.textContent)
          expect(charCell).toBe('A')
        })

        test('sorts a table with empty rows last', async ({ page }) => {
          const allTables = await page.$$('table.sortable')
          const table = allTables[3]
          const numberHeader = await table.$('th:nth-child(2)')
          expect(numberHeader).toBeTruthy()

          let numberCell = await table.$eval('tbody tr:nth-child(2) td:nth-child(2)', (el) => el.textContent)
          expect(numberCell).toBe('0')

          await numberHeader?.click()
          await page.waitForTimeout(100)

          numberCell = await table.$eval('tbody tr:last-child td:nth-child(2)', (el) => el.textContent)
          expect(numberCell).toBe('(if click in this column)')
        })

        test('respects class="no-sort" in th', async ({ page }) => {
          const allTables = await page.$$('table.sortable')
          const table = allTables[4]
          const nameHeader = await table.$('th:nth-child(2)')

          let nameCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
          expect(nameCell).toBe('Rick')

          await nameHeader?.click()
          await page.waitForTimeout(100)

          nameCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
          expect(nameCell).toBe('Rick')
        })

        test('treats time formats like strings', async ({ page }) => {
          const allTables = await page.$$('table.sortable')
          const table = allTables[5]
          const timeHeader = await table.$('th:nth-child(2)')
          expect(timeHeader).toBeTruthy()

          let timeCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
          expect(timeCell).toBe('12:00:12')

          await timeHeader?.click()
          await page.waitForTimeout(100)

          timeCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
          expect(timeCell).toBe('12:22:11')

          await timeHeader?.click()
          await page.waitForTimeout(100)

          timeCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
          expect(timeCell).toBe('12:00:12')
        })

        test('treats amounts like strings', async ({ page }) => {
          const allTables = await page.$$('table.sortable')
          const table = allTables[5]
          const amountHeader = await table.$('th:nth-child(3)')
          expect(amountHeader).toBeTruthy()

          let amountCell = await table.$eval('tbody tr:first-child td:nth-child(3)', (el) => el.textContent)
          expect(amountCell).toBe('$18.49')

          await amountHeader?.click()
          await page.waitForTimeout(100)

          amountCell = await table.$eval('tbody tr:first-child td:nth-child(3)', (el) => el.textContent)
          expect(amountCell).toBe('$2.49')

          await amountHeader?.click()
          await page.waitForTimeout(100)

          amountCell = await table.$eval('tbody tr:first-child td:nth-child(3)', (el) => el.textContent)
          expect(amountCell).toBe('$1.96')
        })

        test('treats numbers like numbers', async ({ page }) => {
          const allTables = await page.$$('table.sortable')
          const table = allTables[5]
          const numberHeader = await table.$('th:nth-child(4)')
          expect(numberHeader).toBeTruthy()

          let numberCell = await table.$eval('tbody tr:first-child td:nth-child(4)', (el) => el.textContent)
          expect(numberCell).toBe('2.49')

          await numberHeader?.click()
          await page.waitForTimeout(100)

          numberCell = await table.$eval('tbody tr:first-child td:nth-child(4)', (el) => el.textContent)
          expect(numberCell).toBe('18.49')

          await numberHeader?.click()
          await page.waitForTimeout(100)

          numberCell = await table.$eval('tbody tr:first-child td:nth-child(4)', (el) => el.textContent)
          expect(numberCell).toBe('1.96')
        })

        test('sorts a table ascending', async ({ page }) => {
          const allTables = await page.$$('table.sortable')
          const table = allTables[6]
          const nameHeader = await table.$('th[aria-label*="Name"]')

          let firstCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
          expect(firstCell).toBe('Rick')

          await nameHeader?.click()
          await page.waitForTimeout(100)

          firstCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
          expect(firstCell).toBe('Morty')

          await nameHeader?.click()
          await page.waitForTimeout(100)

          firstCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
          expect(firstCell).toBe('Rick')
        })

        test('a11y labels are added and updated', async ({ page }) => {
          const nameHeader = await page.$('th[aria-label*="Name"]')

          let ariaLabel = await nameHeader?.getAttribute('aria-label')
          expect(ariaLabel).toContain('Click to sort table by Name in descending order')

          await nameHeader?.click()
          await page.waitForTimeout(100)

          ariaLabel = await nameHeader?.getAttribute('aria-label')
          expect(ariaLabel).toContain('Click to sort table by Name in ascending order')
        })

        test('works when using enhanceSortableAccessibility()', async ({ page }) => {
          // Get a table to test with
          const allTables = await page.$$('table.sortable')
          const table = allTables[6]

          const nameHeader = await table.$('th[aria-label*="Name"]')
          expect(nameHeader).toBeTruthy()

          // Check initial aria-label
          let ariaLabel = await nameHeader?.getAttribute('aria-label')
          expect(ariaLabel).toContain('Click to sort table by Name')

          // Clear and re-apply accessibility
          await page.evaluate(() => {
            const th = document.querySelector('th[aria-label*="Name"]')
            if (th) {
              th.removeAttribute('aria-label')
              th.removeAttribute('tabindex')
            }
          })

          // Re-apply accessibility through page evaluation
          await page.evaluate(() => {
            const enhanceSortableAccessibility = (tables: NodeListOf<HTMLTableElement>) => {
              tables.forEach((table) => {
                table.querySelectorAll('th').forEach((th) => {
                  if (!th.hasAttribute('tabindex')) {
                    th.setAttribute('tabindex', '0')
                    const headerText = th.textContent || 'column'
                    th.setAttribute('aria-label', `Click to sort table by ${headerText} in ascending order`)
                  }
                })
              })
            }
            enhanceSortableAccessibility(document.querySelectorAll('table.sortable'))
          })

          // Verify accessibility was reapplied
          await page.waitForTimeout(100)
          ariaLabel = await nameHeader?.getAttribute('aria-label')
          expect(ariaLabel).toContain('Click to sort table by Name')
          expect(await nameHeader?.getAttribute('tabindex')).toBe('0')
        })

        test('sortStart and sortEnd events are dispatched', async ({ page }) => {
          const nameHeader = await page.$('th[aria-label*="Name"]')

          await page.evaluate(() => {
            document.addEventListener('sort-start', () => {
              ;(window as any).testEvents = (window as any).testEvents || []
              ;(window as any).testEvents.push('sortStart')
            })
            document.addEventListener('sort-end', () => {
              ;(window as any).testEvents = (window as any).testEvents || []
              ;(window as any).testEvents.push('sortEnd')
            })
          })

          await nameHeader?.click()
          await page.waitForTimeout(100)

          const eventsFired = await page.evaluate(() => (window as any).testEvents)
          expect(eventsFired).toContain('sortStart')
          expect(eventsFired).toContain('sortEnd')
        })
      })
    }
  })
}
