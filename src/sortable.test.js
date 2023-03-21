// https://dev.to/thawkin3/how-to-unit-test-html-and-vanilla-javascript-without-a-ui-framework-4io
import { fireEvent, getByRole, getAllByRole } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'

const js = fs.readFileSync(path.resolve(__dirname, '../sortable.min.js'), 'utf8')
const html = fs
  .readFileSync(path.resolve(__dirname, './sortable.test.html'), 'utf8')
  .replace('<script src="../sortable.js"></script>', `<script>${js}</script>`)

let dom
let container

describe('sortable.test.html', () => {
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
      name: /sortable test/i,
    })
    expect(h1).toBeInTheDocument()
  })

  it('renders table headers and cells', () => {
    const th = getByRole(container, 'columnheader', { name: /Name/i })
    expect(th).toBeInTheDocument()
    const tds = getAllByRole(container, 'cell')
    expect(tds[0]).toBeInTheDocument()
    expect(tds[1]).toBeInTheDocument()
  })

  it('sorts the table on click', async () => {
    const th = getByRole(container, 'columnheader', { name: /Name/i })

    const first = getAllByRole(container, 'cell')[1].textContent
    fireEvent.click(th)
    const middle = getAllByRole(container, 'cell')[1].textContent
    fireEvent.click(th)
    const last = getAllByRole(container, 'cell')[1].textContent

    expect(first).toBe('Rick')
    expect(middle).toBe('Rick') // since it is already sorted in that direction
    expect(last).toBe('Morty')
  })
})
