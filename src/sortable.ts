/**
 * sortable v2.1.3
 *
 * https://www.npmjs.com/package/sortable-tablesort
 * https://github.com/tofsjonas/sortable
 *
 * Makes html tables sortable, No longer ie9+ 😢
 *
 * Styling is done in css.
 *
 * Copyleft 2017 Jonas Earendel
 *
 * This is free and unencumbered software released into the public domain.
 *
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 *
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * For more information, please refer to <http://unlicense.org>
 *
 */

document.addEventListener('click', function (e: MouseEvent) {
  try {
    // allows for elements inside TH
    function findElementRecursive(element: ParentNode, tag: string) {
      return element.nodeName === tag ? element : findElementRecursive(element.parentNode, tag)
    }

    const descending_th_class = 'dir-d'
    const ascending_th_class = 'dir-u'
    const ascending_table_sort_class = 'asc'

    const table_class_name = 'sortable'

    const alt_sort = e.shiftKey || e.altKey
    const element: HTMLTableCellElement = findElementRecursive(e.target as HTMLElement, 'TH')
    const tr: HTMLTableRowElement = findElementRecursive(element, 'TR')
    const table: HTMLTableElement = findElementRecursive(tr, 'TABLE')

    function reClassify(element: HTMLElement, dir: string) {
      element.classList.remove(descending_th_class)
      element.classList.remove(ascending_th_class)
      if (dir) element.classList.add(dir)
    }

    function getValue(element: HTMLTableCellElement) {
      const value = (alt_sort && element.dataset.sortAlt) || element.dataset.sort || element.textContent
      return value
    }

    if (table.classList.contains(table_class_name)) {
      let column_index: number
      const nodes = tr.cells
      const tiebreaker = parseInt(element.dataset.sortTbr)

      // Reset thead cells and get column index
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] === element) {
          column_index = parseInt(element.dataset.sortCol) || i
        } else {
          reClassify(nodes[i], '')
        }
      }

      let dir = descending_th_class

      // Check if we're sorting ascending or descending
      if (
        element.classList.contains(descending_th_class) ||
        (table.classList.contains(ascending_table_sort_class) && !element.classList.contains(ascending_th_class))
      ) {
        dir = ascending_th_class
      }

      // Update the `th` class accordingly
      reClassify(element, dir)
      const reverse = dir === ascending_th_class

      const compare = (a: HTMLTableRowElement, b: HTMLTableRowElement, index: number) => {
        const x = getValue((reverse ? a : b).cells[index])
        const y = getValue((reverse ? b : a).cells[index])
        const temp = parseFloat(x) - parseFloat(y)
        const bool = isNaN(temp) ? x.localeCompare(y) : temp
        return bool
      }

      // loop through all tbodies and sort them
      for (let i = 0; i < table.tBodies.length; i++) {
        const org_tbody: HTMLTableSectionElement = table.tBodies[i]

        // Put the array rows in an array, so we can sort them...
        const rows: HTMLTableRowElement[] = [].slice.call(org_tbody.rows, 0)

        // Sort them using Array.prototype.sort()
        rows.sort(function (a: HTMLTableRowElement, b: HTMLTableRowElement) {
          const bool = compare(a, b, column_index)
          return bool === 0 && !isNaN(tiebreaker) ? compare(a, b, tiebreaker) : bool
        })

        // Make an empty clone
        const clone_tbody = org_tbody.cloneNode() as HTMLTableSectionElement

        // Put the sorted rows inside the clone
        clone_tbody.append(...rows)

        // And finally replace the unsorted tbody with the sorted one
        table.replaceChild(clone_tbody, org_tbody)
      }
    }
  } catch (error) {
    // console.log(error)
  }
})
