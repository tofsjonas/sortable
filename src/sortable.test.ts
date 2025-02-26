// // https://dev.to/thawkin3/how-to-unit-test-html-and-vanilla-javascript-without-a-ui-framework-4io
// import { fireEvent, getByRole, getAllByRole, waitFor as originalWaitFor } from '@testing-library/dom'
// import { expect, describe, beforeEach, it, vi } from 'vitest'

// import '@testing-library/jest-dom/vitest'

// import { JSDOM } from 'jsdom'
// import fs from 'fs'
// import path from 'path'
// import { enhanceSortableAccessibility } from './enhanceSortableAccessibility'
// // Determine whether to use minified versions based on an environment variable
// const use_minified = process.env.USE_MINIFIED === 'true'

// // Construct file paths based on the above flag
// const js_filename = use_minified ? 'sortable.min.js' : 'sortable.js'
// const a11y_js_filename = use_minified ? 'sortable.a11y.min.js' : 'sortable.a11y.js'

// console.log(`Testing with ${js_filename} and ${a11y_js_filename}`)

// const js = fs.readFileSync(path.resolve(__dirname, `../dist/${js_filename}`), 'utf8')
// const a11y_js = fs.readFileSync(path.resolve(__dirname, `../dist/${a11y_js_filename}`), 'utf8')

// const html = fs
//   .readFileSync(path.resolve(__dirname, '../index.html'), 'utf8')
//   .replace('<script type="module" src="/src/sortable.ts"></script>', `<script>${js}</script>`)
//   .replace('<script type="module" src="/src/sortable.a11y.ts"></script>', `<script>${a11y_js}</script>`)

// let dom
// let container: HTMLElement
// let waitFor: typeof originalWaitFor

// describe('Testing sortable', () => {
//   beforeEach(() => {
//     // Constructing a new JSDOM with this option is the key
//     // to getting the code in the script tag to execute.
//     // This is indeed dangerous and should only be done with trusted content.
//     // https://github.com/jsdom/jsdom#executing-scripts
//     dom = new JSDOM(html, { runScripts: 'dangerously' })
//     container = dom.window.document.body

//     // we have to bind waitFor to the container, otherwise it will not work
//     waitFor = (callback, options) => originalWaitFor(callback, { ...options, container })
//   })

//   it('renders a heading element', () => {
//     const h1 = getByRole(container, 'heading', {
//       name: /Sortable examples/i,
//     })
//     expect(h1).toBeInTheDocument()
//   })

//   it('renders table headers and cells', () => {
//     const table = getAllByRole(container, 'table')[0]

//     const th = getByRole(table, 'columnheader', { name: /Name/i })
//     expect(th).toBeInTheDocument()
//     const tds = getAllByRole(table, 'cell')
//     expect(tds[0]).toBeInTheDocument()
//     expect(tds[1]).toBeInTheDocument()
//   })

//   it('sorts a table on click', async () => {
//     const table = getAllByRole(container, 'table')[0]
//     const th = getByRole(table, 'columnheader', { name: /Name/i })
//     const first = getAllByRole(table, 'cell')[1].textContent
//     expect(first).toBe('Rick')
//     fireEvent.click(th)
//     await waitFor(() => {
//       const middle = getAllByRole(table, 'cell')[1].textContent
//       expect(middle).toBe('Rick')
//     })
//     fireEvent.click(th)
//     await waitFor(() => {
//       const last = getAllByRole(table, 'cell')[1].textContent
//       expect(last).toBe('Morty')
//     })
//   })

//   it('sorts a table using Enter key', async () => {
//     const table = getAllByRole(container, 'table')[0]
//     const th = getByRole(table, 'columnheader', { name: /Name/i })
//     const first = getAllByRole(table, 'cell')[1].textContent
//     expect(first).toBe('Rick')

//     fireEvent.keyDown(th, { key: 'Enter', code: 'Enter' })
//     await waitFor(() => {
//       const middle = getAllByRole(table, 'cell')[1].textContent
//       expect(middle).toBe('Rick')
//     })

//     fireEvent.keyDown(th, { key: 'Enter', code: 'Enter' })
//     await waitFor(() => {
//       const last = getAllByRole(table, 'cell')[1].textContent
//       expect(last).toBe('Morty')
//     })
//   })

//   it('sorts a table using tie breaker', async () => {
//     const table = getAllByRole(container, 'table')[1]
//     const th = getByRole(table, 'columnheader', { name: /Year/ })
//     const first = getAllByRole(table, 'cell')[3].textContent
//     expect(first).toBe('12:00')
//     fireEvent.click(th)
//     await waitFor(() => {
//       const middle = getAllByRole(table, 'cell')[3].textContent
//       expect(middle).toBe('15:00')
//     })
//     fireEvent.click(th)
//     await waitFor(() => {
//       const last = getAllByRole(table, 'cell')[3].textContent
//       expect(last).toBe('13:00')
//     })
//   })

//   it('sorts a table with colspans', async () => {
//     const table = getAllByRole(container, 'table')[2]
//     const th = getByRole(table, 'columnheader', { name: /CHARS/ })
//     const first = getAllByRole(table, 'cell')[2].textContent
//     expect(first).toBe('BB')
//     fireEvent.click(th)
//     await waitFor(() => {
//       const middle = getAllByRole(table, 'cell')[2].textContent
//       expect(middle).toBe('CCC')
//     })
//     fireEvent.click(th)
//     await waitFor(() => {
//       const last = getAllByRole(table, 'cell')[2].textContent
//       expect(last).toBe('A')
//     })
//   })

//   it('sorts a table with empty rows last', async () => {
//     const table = getAllByRole(container, 'table')[3]
//     const th = getByRole(table, 'columnheader', { name: /Number/ })
//     const first = getAllByRole(table, 'cell')[7].textContent
//     expect(first).toBe('0.2')
//     fireEvent.click(th)
//     await waitFor(() => {
//       const middle = getAllByRole(table, 'cell')[7].textContent
//       expect(middle).toBe('(if click in this column)')
//     })
//     fireEvent.click(th)
//     await waitFor(() => {
//       const last = getAllByRole(table, 'cell')[7].textContent
//       expect(last).toBe('(if click in this column)')
//     })
//   })

//   it('respects class="no-sort" in th', async () => {
//     const table = getAllByRole(container, 'table')[4]
//     const th = getByRole(table, 'columnheader', { name: /Name/ })
//     const first = getAllByRole(table, 'cell')[1].textContent
//     expect(first).toBe('Rick')
//     fireEvent.click(th)
//     await waitFor(() => {
//       const middle = getAllByRole(table, 'cell')[1].textContent
//       expect(middle).toBe('Rick')
//     })
//     fireEvent.click(th)
//     await waitFor(() => {
//       const last = getAllByRole(table, 'cell')[1].textContent
//       expect(last).toBe('Rick')
//     })
//   })

//   it('treats time formats like strings', async () => {
//     const table = getAllByRole(container, 'table')[5]
//     const th = getByRole(table, 'columnheader', { name: /Time/ })
//     const first = getAllByRole(table, 'cell')[1].textContent
//     expect(first).toBe('12:00:12')
//     fireEvent.click(th)
//     await waitFor(() => {
//       const middle = getAllByRole(table, 'cell')[1].textContent
//       expect(middle).toBe('12:22:11')
//     })
//     fireEvent.click(th)
//     await waitFor(() => {
//       const last = getAllByRole(table, 'cell')[1].textContent
//       expect(last).toBe('12:00:12')
//     })
//   })

//   it('treats amounts like strings', async () => {
//     const table = getAllByRole(container, 'table')[5]
//     const th = getByRole(table, 'columnheader', { name: /Amount/ })
//     const first = getAllByRole(table, 'cell')[2].textContent
//     expect(first).toBe('$18.49')
//     fireEvent.click(th)
//     await waitFor(() => {
//       const middle = getAllByRole(table, 'cell')[2].textContent
//       expect(middle).toBe('$2.49')
//     })
//     fireEvent.click(th)
//     await waitFor(() => {
//       const last = getAllByRole(table, 'cell')[2].textContent
//       expect(last).toBe('$1.96')
//     })
//   })

//   it('treats numbers like numbers', async () => {
//     const table = getAllByRole(container, 'table')[5]
//     const th = getByRole(table, 'columnheader', { name: /Number/ })
//     const first = getAllByRole(table, 'cell')[3].textContent
//     expect(first).toBe('2.49')
//     fireEvent.click(th)
//     await waitFor(() => {
//       const middle = getAllByRole(table, 'cell')[3].textContent
//       expect(middle).toBe('18.49')
//     })
//     fireEvent.click(th)
//     await waitFor(() => {
//       const last = getAllByRole(table, 'cell')[3].textContent
//       expect(last).toBe('1.96')
//     })
//   })

//   it('sorts a table ascending', async () => {
//     const table = getAllByRole(container, 'table')[6]

//     const th = getByRole(table, 'columnheader', { name: /Name/i })
//     const first = getAllByRole(table, 'cell')[1].textContent
//     expect(first).toBe('Rick')
//     fireEvent.click(th)
//     await waitFor(() => {
//       const middle = getAllByRole(table, 'cell')[1].textContent
//       expect(middle).toBe('Morty')
//     })
//     fireEvent.click(th)
//     await waitFor(() => {
//       const last = getAllByRole(table, 'cell')[1].textContent
//       expect(last).toBe('Rick')
//     })
//   })

//   it('a11y labels are added and updated', async () => {
//     const first_string = 'Click to sort table by Name in ascending order'
//     const second_string = 'Click to sort table by Name in descending order'

//     const table = getAllByRole(container, 'table')[6]
//     const th = getByRole(table, 'columnheader', { name: /Name/i })
//     const first = th.getAttribute('aria-label')
//     fireEvent.click(th)

//     await waitFor(() => {
//       const middle = th.getAttribute('aria-label')
//       expect(middle).toBe(second_string)
//     })

//     expect(first).toBe(first_string)
//   })

//   it('works when using enhanceSortableAccessibility()', async () => {
//     const first_string = 'Click to sort table by Name in ascending order'
//     const second_string = 'Click to sort table by Name in descending order'

//     const table = getAllByRole(container, 'table')[6] as HTMLTableElement
//     let th = getByRole(table, 'columnheader', { name: /Name/i })

//     // remove eventlistener from th
//     let clone = th.cloneNode(true) as HTMLElement
//     th.parentNode!.replaceChild(clone, th)

//     th = getByRole(table, 'columnheader', { name: /Name/i })

//     // double check that the eventlistener is removed
//     // this should NOT alter the a11y label
//     fireEvent.click(th)

//     // this, however, _should_ alter the a11y label
//     setTimeout(() => {
//       // th.setAttribute('tabindex', 5)
//       th.setAttribute('aria-label', '')
//       th.removeAttribute('tabindex')
//     }, 100)

//     await waitFor(() => {
//       const th = getByRole(table, 'columnheader', { name: /Name/i })
//       expect(th.getAttribute('aria-label')).satisfies((label: string | null) => label === '' || label === second_string)
//     })

//     // double check that it was empty and not second_string
//     const middle = th.getAttribute('aria-label')
//     expect(middle).toBe('')

//     // re-enable the a11y
//     enhanceSortableAccessibility([table])

//     await waitFor(() => {
//       const th = getByRole(table, 'columnheader', { name: /Name/i })
//       expect(th.hasAttribute('tabindex')).toBe(true)
//     })

//     fireEvent.click(th)

//     // see that it worked:
//     await waitFor(() => {
//       const th = getByRole(table, 'columnheader', { name: /Name/i })
//       expect(th.getAttribute('aria-label')).toBe(first_string)
//     })

//     // well, if we got here, we're good
//   })
//   it('sort-start and sort-end events are dispatched', async () => {
//     const startListener = vi.fn()
//     const endListener = vi.fn()

//     container.addEventListener('sort-start', startListener)
//     container.addEventListener('sort-end', endListener)

//     const table = getAllByRole(container, 'table')[0]
//     const th = getByRole(table, 'columnheader', { name: /Name/i })
//     fireEvent.click(th)
//     fireEvent.click(th)
//     await waitFor(() => {
//       const middle = getAllByRole(table, 'cell')[1].textContent
//       expect(middle).toBe('Morty')
//     })

//     expect(startListener).toHaveBeenCalledTimes(1)
//     expect(endListener).toHaveBeenCalledTimes(1)
//   })
// })
