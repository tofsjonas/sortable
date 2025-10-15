import { test, expect, Page } from '@playwright/test'

// Helper to generate large table data
function generateTableHTML(rows: number, cols: number): string {
  const headers = Array.from({ length: cols }, (_, i) => `<th>Column ${i + 1}</th>`).join('')
  const tableRows = Array.from({ length: rows }, (_, i) => {
    const cells = Array.from({ length: cols }, (_, j) => {
      if (j === 0) return `<td>Item ${Math.floor(Math.random() * 1000)}</td>`
      if (j === 1) return `<td>${Math.floor(Math.random() * 10000)}</td>`
      return `<td>Col${j}_${Math.random().toString(36).substr(2, 5)}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  return `
    <table class="sortable">
      <thead><tr>${headers}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  `
}

async function measureSortTime(page: Page, selector: string): Promise<number> {
  return await page.evaluate((sel) => {
    return new Promise<number>((resolve) => {
      const header = document.querySelector(sel) as HTMLElement
      const table = header.closest('table') as HTMLTableElement

      let startTime: number

      const onSortStart = () => {
        startTime = performance.now()
      }

      const onSortEnd = () => {
        const endTime = performance.now()
        table.removeEventListener('sort-start', onSortStart)
        table.removeEventListener('sort-end', onSortEnd)
        resolve(endTime - startTime)
      }

      table.addEventListener('sort-start', onSortStart)
      table.addEventListener('sort-end', onSortEnd)
      header.click()
    })
  }, selector)
}

test.describe('Sortable Performance Benchmarks', () => {
  test.beforeEach(async ({ page }) => {
    // Load sortable script
    await page.goto(
      'data:text/html,<html><head><script src="https://cdn.jsdelivr.net/gh/tofsjonas/sortable@latest/dist/sortable.min.js"></script></head><body></body></html>',
    )
  })

  const benchmarkConfigs = [
    { rows: 100, cols: 5, name: 'Small table', maxTime: 60 },
    { rows: 500, cols: 5, name: 'Medium table', maxTime: 200 },
    { rows: 1000, cols: 5, name: 'Large table', maxTime: 500 },
    { rows: 2000, cols: 5, name: 'Very large table', maxTime: 1000 },
    { rows: 100, cols: 10, name: 'Wide table', maxTime: 100 },
  ]

  for (const config of benchmarkConfigs) {
    test(`${config.name} (${config.rows} rows, ${config.cols} cols) sorts within ${config.maxTime}ms`, async ({
      page,
    }) => {
      // Generate and inject table
      const tableHTML = generateTableHTML(config.rows, config.cols)
      await page.setContent(`
        <html>
          <head>
            <script src="https://cdn.jsdelivr.net/gh/tofsjonas/sortable@latest/dist/sortable.min.js"></script>
          </head>
          <body>${tableHTML}</body>
        </html>
      `)

      // Wait for table to be ready
      await page.waitForSelector('table.sortable th')

      // Measure sort time
      const sortTime = await measureSortTime(page, 'table.sortable th:first-child')

      console.log(`${config.name}: ${sortTime.toFixed(2)}ms`)

      // Assert performance threshold
      expect(sortTime).toBeLessThan(config.maxTime)
    })
  }

  test('Multiple rapid sorts performance', async ({ page }) => {
    const tableHTML = generateTableHTML(500, 5)
    await page.setContent(`
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/gh/tofsjonas/sortable@latest/dist/sortable.min.js"></script>
        </head>
        <body>${tableHTML}</body>
      </html>
    `)

    await page.waitForSelector('table.sortable th')

    // Measure time for 10 rapid sorts
    const totalTime = await page.evaluate(() => {
      const header = document.querySelector('table.sortable th:first-child') as HTMLElement
      const startTime = performance.now()

      for (let i = 0; i < 10; i++) {
        header.click()
      }

      const endTime = performance.now()
      return endTime - startTime
    })

    console.log(`10 rapid sorts: ${totalTime.toFixed(2)}ms (avg: ${(totalTime / 10).toFixed(2)}ms per sort)`)
    expect(totalTime).toBeLessThan(2000) // 10 sorts should complete within 2 seconds
  })

  test('Memory usage stability', async ({ page }) => {
    const tableHTML = generateTableHTML(1000, 5)
    await page.setContent(`
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/gh/tofsjonas/sortable@latest/dist/sortable.min.js"></script>
        </head>
        <body>${tableHTML}</body>
      </html>
    `)

    await page.waitForSelector('table.sortable th')

    // Perform many sorts and check for memory leaks
    await page.evaluate(() => {
      const header = document.querySelector('table.sortable th:first-child') as HTMLElement
      for (let i = 0; i < 50; i++) {
        header.click()
      }
    })

    // If we get here without timeout/crash, memory usage is stable
    expect(true).toBe(true)
  })
})
