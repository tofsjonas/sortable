import { sortSortable } from './sortSortable'

export function sortableEventListener(e: MouseEvent) {
  // allows for elements inside TH
  function findElementRecursive(element: Node, tag: string): Node {
    return element.nodeName === tag ? element : findElementRecursive(element.parentNode!, tag)
  }

  try {
    const ascending_table_sort_class = 'asc'
    const no_sort_class = 'no-sort'
    const table_class_name = 'sortable'

    const alt_sort = e.shiftKey || e.altKey
    const element = findElementRecursive(e.target as HTMLElement, 'TH') as HTMLTableCellElement
    const tr = element.parentNode as HTMLTableRowElement
    const thead = tr.parentNode as HTMLTableSectionElement
    const table = thead.parentNode as HTMLTableElement

    // Should we sort?
    if (
      thead.nodeName === 'THEAD' && // sortable only triggered in `thead`
      table.classList.contains(table_class_name) &&
      !element.classList.contains(no_sort_class) // .no-sort is now core functionality, no longer handled in CSS
    ) {
      const nodes = tr.cells

      // Reset thead cells
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] !== element) {
          nodes[i].removeAttribute('aria-sort')
        }
      }

      let direction = 'descending'

      if (
        element.getAttribute('aria-sort') === 'descending' ||
        (table.classList.contains(ascending_table_sort_class) && element.getAttribute('aria-sort') !== 'ascending')
      ) {
        direction = 'ascending'
      }

      // Update the `th` class accordingly
      element.setAttribute('aria-sort', direction)

      table.dataset.timer && clearTimeout(+table.dataset.timer)

      // Add a tiny delay, so if you want to use the "click twice" method to re-sort, it will only sort once
      table.dataset.timer = setTimeout(() => {
        sortSortable(table, alt_sort)
      }, 1).toString()
    }
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // console.log(error)
  }
}
