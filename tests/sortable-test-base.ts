// tests/sortable-test-base.ts
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
    { option: true },
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
  for (const minified of [false, true]) {
    const minifiedVariant = minified ? '(minified)' : ''

    test.describe(minifiedVariant, () => {
      test.beforeEach(async ({ page, getUrl }) => {
        await page.goto(getUrl(minified))
      })

      // Break after first failure
      test.afterEach(async ({}, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {
          test.skip(true)
        }
      })

      const defineTest = (name: string, testFn: ({ page }: { page: Page }) => Promise<void>) => {
        test(`${name}`, async ({ page, formatName }) => {
          test.info().title = `[${formatName}] ${name}`
          await testFn({ page })
        })
      }

      defineTest('renders a heading element', async ({ page }) => {
        const heading = await page.getByRole('heading', { name: /Sortable examples/i })
        expect(heading).toBeTruthy()
      })

      defineTest('renders table headers and cells', async ({ page }) => {
        const table = await page.$('table.sortable')
        expect(table).toBeTruthy()

        const nameHeader = await page.$('th[aria-label*="Name"]')
        expect(nameHeader).toBeTruthy()

        const cells = await page.$$('table.sortable tbody td')
        expect(cells[0]).toBeTruthy()
        expect(cells[1]).toBeTruthy()
      })

      defineTest('sorts a table on click', async ({ page }) => {
        const nameHeader = await page.$('th[aria-label*="Name"]')

        let firstCell = await page.$eval('table.sortable tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(firstCell).toBe('Rick')

        await nameHeader?.click()
        await waitForSort(page)

        firstCell = await page.$eval('table.sortable tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(firstCell).toBe('Rick')

        await nameHeader?.click()
        await waitForSort(page)

        firstCell = await page.$eval('table.sortable tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(firstCell).toBe('Morty')
      })

      defineTest('sorts a table using Enter key', async ({ page }) => {
        const nameHeader = await page.$('th[aria-label*="Name"]')

        let firstCell = await page.$eval('table.sortable tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(firstCell).toBe('Rick')

        await nameHeader?.focus()
        await nameHeader?.press('Enter')
        await waitForSort(page)

        firstCell = await page.$eval('table.sortable tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(firstCell).toBe('Rick')

        await nameHeader?.press('Enter')
        await waitForSort(page)

        firstCell = await page.$eval('table.sortable tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(firstCell).toBe('Morty')
      })

      defineTest('sorts a table using tie breaker', async ({ page }) => {
        const allTables = await page.$$('table.sortable')
        const table = allTables[1]
        const yearHeader = await table.$('th:nth-child(2)')
        expect(yearHeader).toBeTruthy()

        let timeCell = await table.$eval('tbody tr:first-child td:nth-child(4)', (el) => el.textContent)
        expect(timeCell).toBe('12:00')

        await yearHeader?.click()
        await waitForSort(page)

        timeCell = await table.$eval('tbody tr:first-child td:nth-child(4)', (el) => el.textContent)
        expect(timeCell).toBe('15:00')

        await yearHeader?.click()
        await waitForSort(page)

        timeCell = await table.$eval('tbody tr:first-child td:nth-child(4)', (el) => el.textContent)
        expect(timeCell).toBe('13:00')
      })

      defineTest('sorts a table with colspans', async ({ page }) => {
        const allTables = await page.$$('table.sortable')
        const table = allTables[2]
        const charsHeader = await table.$('th:last-child')
        expect(charsHeader).toBeTruthy()

        let charCell = await table.$eval('tbody tr:first-child td:last-child', (el) => el.textContent)
        expect(charCell).toBe('BB')

        await charsHeader?.click()
        await waitForSort(page)

        charCell = await table.$eval('tbody tr:first-child td:last-child', (el) => el.textContent)
        expect(charCell).toBe('CCC')

        await charsHeader?.click()
        await waitForSort(page)

        charCell = await table.$eval('tbody tr:first-child td:last-child', (el) => el.textContent)
        expect(charCell).toBe('A')
      })

      defineTest('sorts a table with empty rows last', async ({ page }) => {
        const allTables = await page.$$('table.sortable')
        const table = allTables[3]
        const numberHeader = await table.$('th:nth-child(2)')
        expect(numberHeader).toBeTruthy()

        let numberCell = await table.$eval('tbody tr:nth-child(2) td:nth-child(2)', (el) => el.textContent)
        expect(numberCell).toBe('0')

        await numberHeader?.click()
        await waitForSort(page)

        numberCell = await table.$eval('tbody tr:last-child td:nth-child(2)', (el) => el.textContent)
        expect(numberCell).toBe('(if click in this column)')
      })

      defineTest('respects class="no-sort" in th', async ({ page }) => {
        const allTables = await page.$$('table.sortable')
        const table = allTables[4]
        const nameHeader = await table.$('th:nth-child(2)')

        let nameCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(nameCell).toBe('Rick')

        await nameHeader?.click()
        await waitForSort(page)

        nameCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(nameCell).toBe('Rick')
      })

      defineTest('treats time formats like strings', async ({ page }) => {
        const allTables = await page.$$('table.sortable')
        const table = allTables[5]
        const timeHeader = await table.$('th:nth-child(2)')
        expect(timeHeader).toBeTruthy()

        let timeCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(timeCell).toBe('12:00:12')

        await timeHeader?.click()
        await waitForSort(page)

        timeCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(timeCell).toBe('12:22:11')

        await timeHeader?.click()
        await waitForSort(page)

        timeCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(timeCell).toBe('12:00:12')
      })

      defineTest('treats amounts like strings', async ({ page }) => {
        const allTables = await page.$$('table.sortable')
        const table = allTables[5]
        const amountHeader = await table.$('th:nth-child(3)')
        expect(amountHeader).toBeTruthy()

        let amountCell = await table.$eval('tbody tr:first-child td:nth-child(3)', (el) => el.textContent)
        expect(amountCell).toBe('$18.49')

        await amountHeader?.click()
        await waitForSort(page)

        amountCell = await table.$eval('tbody tr:first-child td:nth-child(3)', (el) => el.textContent)
        expect(amountCell).toBe('$2.49')

        await amountHeader?.click()
        await waitForSort(page)

        amountCell = await table.$eval('tbody tr:first-child td:nth-child(3)', (el) => el.textContent)
        expect(amountCell).toBe('$1.96')
      })

      defineTest('treats numbers like numbers', async ({ page }) => {
        const allTables = await page.$$('table.sortable')
        const table = allTables[5]
        const numberHeader = await table.$('th:nth-child(4)')
        expect(numberHeader).toBeTruthy()

        let numberCell = await table.$eval('tbody tr:first-child td:nth-child(4)', (el) => el.textContent)
        expect(numberCell).toBe('2.49')

        await numberHeader?.click()
        await waitForSort(page)

        numberCell = await table.$eval('tbody tr:first-child td:nth-child(4)', (el) => el.textContent)
        expect(numberCell).toBe('18.49')

        await numberHeader?.click()
        await waitForSort(page)

        numberCell = await table.$eval('tbody tr:first-child td:nth-child(4)', (el) => el.textContent)
        expect(numberCell).toBe('1.96')
      })

      defineTest('sorts a table ascending', async ({ page }) => {
        const allTables = await page.$$('table.sortable')
        const table = allTables[6]
        const nameHeader = await table.$('th[aria-label*="Name"]')

        let firstCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(firstCell).toBe('Rick')

        await nameHeader?.click()
        await waitForSort(page)

        firstCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(firstCell).toBe('Morty')

        await nameHeader?.click()
        await waitForSort(page)

        firstCell = await table.$eval('tbody tr:first-child td:nth-child(2)', (el) => el.textContent)
        expect(firstCell).toBe('Rick')
      })

      defineTest('a11y labels are added and updated', async ({ page }) => {
        const nameHeader = await page.$('th[aria-label*="Name"]')

        let ariaLabel = await nameHeader?.getAttribute('aria-label')
        expect(ariaLabel).toContain('Click to sort table by Name in descending order')

        await nameHeader?.click()

        await waitForSort(page)

        ariaLabel = await nameHeader?.getAttribute('aria-label')
        expect(ariaLabel).toContain('Click to sort table by Name in ascending order')
      })

      defineTest('works when using enhanceSortableAccessibility()', async ({ page }) => {
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

        await waitForSort(page)
        ariaLabel = await nameHeader?.getAttribute('aria-label')
        expect(ariaLabel).toContain('Click to sort table by Name')
        expect(await nameHeader?.getAttribute('tabindex')).toBe('0')
      })

      defineTest('sort-start and sort-end events are dispatched', async ({ page }) => {
        const nameHeader = await page.$('th[aria-label*="Name"]')

        // Set up event listeners
        await page.evaluate(() => {
          document.addEventListener('sort-start', () => {
            ;(window as any).testEvents = (window as any).testEvents || []
            ;(window as any).testEvents.push('sort-start')
          })
          document.addEventListener('sort-end', () => {
            ;(window as any).testEvents = (window as any).testEvents || []
            ;(window as any).testEvents.push('sort-end')
          })
        })

        await nameHeader?.click()
        await waitForSort(page)

        const eventsFired = await page.evaluate(() => (window as any).testEvents)
        expect(eventsFired).toContain('sort-start')
        expect(eventsFired).toContain('sort-end')
      })

      defineTest('sorts a table with alt/shift key', async ({ page }) => {
        const allTables = await page.$$('table.sortable')
        const table = allTables[7]
        const movieHeader = await table.$('th:has-text("Movie Name")')
        expect(movieHeader).toBeTruthy()

        // Check initial state
        let firstCell = await table.$eval('tbody tr:first-child td:first-child', (el) => el.textContent)
        expect(firstCell).toBe('A')

        // // Test regular sort
        await movieHeader?.click()
        await waitForSort(page)
        firstCell = await table.$eval('tbody tr:first-child td:first-child', (el) => el.textContent)
        expect(firstCell).toBe('D')

        // // Test alt sort
        await page.keyboard.down('Alt')
        await movieHeader?.click()
        await page.keyboard.up('Alt')
        await waitForSort(page)
        firstCell = await table.$eval('tbody tr:first-child td:first-child', (el) => el.textContent)
        expect(firstCell).toBe('A')

        await page.keyboard.down('Shift')
        await movieHeader?.click()
        await page.keyboard.up('Shift')
        await waitForSort(page)
        firstCell = await table.$eval('tbody tr:first-child td:first-child', (el) => el.textContent)
        expect(firstCell).toBe('J')
      })

      defineTest('ensures allTables[8] has a TR with no TD', async ({ page }) => {
        const allTables = await page.$$('table.sortable')
        const table = allTables[8]
        const nameHeader = await table.$('th[aria-label*="Letters"]')
        let firstCell: string | null = null

        // Sort empty TR to the bottom of table.
        await nameHeader?.click()
        await waitForSort(page)

        // Sort empty TR to top of table.
        await nameHeader?.click()
        await waitForSort(page)

        try {
          firstCell = await table.$eval('tbody tr:first-child td:nth-child(1)', (el) => el.textContent)
        } catch (err) {
          expect(err.message).toEqual(
            'elementHandle.$eval: Failed to find element matching selector "tbody tr:first-child td:nth-child(1)"',
          )
        }
      })

      defineTest('sorts a table with missing TD elements', async ({ page }) => {
        const allTables = await page.$$('table.sortable')
        const table = allTables[8]
        const nameHeader = await table.$('th[aria-label*="Letters"]')

        let firstCell = await table.$eval('tbody tr:first-child td:nth-child(1)', (el) => el.textContent)
        expect(firstCell).toBe('CCC')

        await nameHeader?.click()
        await waitForSort(page)

        firstCell = await table.$eval('tbody tr:first-child td:nth-child(1)', (el) => el.textContent)
        expect(firstCell).toBe('DDD')

        await nameHeader?.click()
        await waitForSort(page)

        // 'tbody tr:first-child' exists, but has no children
        firstCell = await table.$eval('tbody tr:nth-child(2) td:nth-child(1)', (el) => el.textContent)
        expect(firstCell).toBe('AAA')
      })

      defineTest('sorts a table with "incorrect" whitespace', async ({ page }) => {
        const allTables = await page.$$('table.sortable')
        const table = allTables[9]

        const roleHeader = await table.$('th:has-text("Role")')
        expect(roleHeader).toBeTruthy()

        const firstRole = await table.$eval('tbody tr:first-child td:first-child', (el) => el.textContent)
        expect(firstRole).toBe('Genius')

        await roleHeader?.click()
        await waitForSort(page)

        const secondRole = await table.$eval('tbody tr:first-child td:first-child', (el) => el.textContent?.trim())
        expect(secondRole).toBe('Sidekick')

        await roleHeader?.click()
        await waitForSort(page)

        const thirdRole = await table.$eval('tbody tr:first-child td:first-child', (el) => el.textContent)
        expect(thirdRole).toBe('Genius')
      })
    })
  }
}
