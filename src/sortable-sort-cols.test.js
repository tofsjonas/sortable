// https://dev.to/thawkin3/how-to-unit-test-html-and-vanilla-javascript-without-a-ui-framework-4io
import { fireEvent, getAllByRole, getByRole } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import path from 'path'

const js = fs.readFileSync(path.resolve(__dirname, '../sortable.js'), 'utf8')
const html = fs
  .readFileSync(path.resolve(__dirname, './sortable-sort-cols.test.html'), 'utf8')
  .replace('<script src="../sortable.js"></script>', `<script>${js}</script>`)

let dom
let container

describe('sortable-sort-cols.test.html', () => {
  beforeEach(() => {
    // Constructing a new JSDOM with this option is the key
    // to getting the code in the script tag to execute.
    // This is indeed dangerous and should only be done with trusted content.
    // https://github.com/jsdom/jsdom#executing-scripts
    dom = new JSDOM(html, { runScripts: 'dangerously' })
    container = dom.window.document.body
  })

  it('renders a heading element', () => {
    const h1 = getByRole(container, 'heading', {
      name: /sortable sort-cols test/i,
    })
    expect(h1).toBeInTheDocument()
  })

  it('renders table headers and cells', () => {
    const th = getByRole(container, 'columnheader', { name: /CHARS/ })
    expect(th).toBeInTheDocument()
    const tds = getAllByRole(container, 'cell')
    expect(tds[0]).toBeInTheDocument()
    expect(tds[1]).toBeInTheDocument()
    expect(tds[2]).toBeInTheDocument()
  })

  it('sorts the column given by data-sort-col on click', async () => {
    const th = getByRole(container, 'columnheader', { name: /CHARS/ })

    const first = getAllByRole(container, 'cell')[2].textContent
    fireEvent.click(th)
    const middle = getAllByRole(container, 'cell')[2].textContent
    fireEvent.click(th)
    const last = getAllByRole(container, 'cell')[2].textContent
    expect(first).toBe('BB')
    expect(middle).toBe('CCC')
    expect(last).toBe('A')
  })
})
