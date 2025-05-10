/**
 * Sorts a sortable table.
 *
 * @param table - The HTMLTableElement to be sorted.
 * @param alt_sort - A boolean indicating whether to use alternative sorting.
 */
export function sortSortable(table: HTMLTableElement, alt_sort: boolean) {
  table.dispatchEvent(new Event('sort-start', { bubbles: true }))

  const null_last_class = 'n-last'

  const th = table.tHead!.querySelector('th[aria-sort]') as HTMLTableCellElement
  const th_row = table.tHead!.children[0] as HTMLTableRowElement

  const direction = th.getAttribute('aria-sort')
  const reverse = direction === 'ascending'

  const sort_null_last = table.classList.contains(null_last_class)

  function getValue(element: HTMLTableCellElement): string {
    if (element) {
      if (alt_sort && element.dataset.sortAlt) return element.dataset.sortAlt
      if (element.dataset.sort) return element.dataset.sort
      if (element.textContent) return element.textContent
    }
    return ''
  }

  const compare = (a: HTMLTableRowElement, b: HTMLTableRowElement, index: number) => {
    const x = getValue(b.cells[index])
    const y = getValue(a.cells[index])
    if (sort_null_last) {
      if (x === '' && y !== '') {
        return -1
      }
      if (y === '' && x !== '') {
        return 1
      }
    }

    // use unary plus to (try to) convert to numbers
    const temp = +x - +y
    const bool = isNaN(temp) ? x.localeCompare(y) : temp

    if (bool === 0 && th_row.cells[index] && th_row.cells[index].hasAttribute('data-sort-tbr')) {
      return compare(a, b, +th_row.cells[index].dataset.sortTbr!)
    }

    return reverse ? -bool : bool
  }

  for (let i = 0; i < table.tBodies.length; i++) {
    const org_tbody: HTMLTableSectionElement = table.tBodies[i]

    // Put the array rows in an array, so we can sort them...
    const rows: HTMLTableRowElement[] = [].slice.call(org_tbody.rows, 0)

    // Sort them using Array.prototype.sort()
    rows.sort(function (a: HTMLTableRowElement, b: HTMLTableRowElement) {
      return compare(a, b, +(th.dataset.sortCol ?? th.cellIndex))
    })

    // Make an empty clone
    const clone_tbody = org_tbody.cloneNode() as HTMLTableSectionElement

    // Put the sorted rows inside the clone
    clone_tbody.append(...rows)

    // And finally replace the unsorted tbody with the sorted one
    table.replaceChild(clone_tbody, org_tbody)
  }
  table.dispatchEvent(new Event('sort-end', { bubbles: true }))
}
