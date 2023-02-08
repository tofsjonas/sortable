/**
 * sortable
 *
 * https://www.npmjs.com/package/sortable-tablesort
 * https://github.com/tofsjonas/sortable
 *
 * Makes html tables sortable, ie9+ (At least it used to be, probably not anymore)
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

    const descending_th_class = ' dir-d '
    const ascending_th_class = ' dir-u '
    const ascending_table_sort_class = 'asc'
    const regex_dir = / dir-(u|d) /
    const regex_table = /\bsortable\b/
    const alt_sort = e.shiftKey || e.altKey
    const element: HTMLTableCellElement = findElementRecursive(e.target as HTMLElement, 'TH')
    const tr: HTMLTableRowElement = findElementRecursive(element, 'TR')
    const table: HTMLTableElement = findElementRecursive(tr, 'TABLE')

    function reClassify(element: HTMLElement, dir: string) {
      element.className = element.className.replace(regex_dir, '') + dir
    }

    function getValue(element: HTMLTableCellElement) {
      // If you aren't using data-sort and want to make it just the tiniest bit smaller/faster
      // comment this line and uncomment the next one
      const value =
        (alt_sort && element.getAttribute('data-sort-alt')) || element.getAttribute('data-sort') || element.textContent
      return value
      // return element.textContent
    }
    if (regex_table.test(table.className)) {
      let column_index: number
      const nodes = tr.cells

      // Reset thead cells and get column index
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] === element) {
          column_index = parseInt(element.getAttribute('data-sort-col')) || i
        } else {
          reClassify(nodes[i], '')
        }
      }

      let dir = descending_th_class

      // Check if we're sorting ascending or descending
      if (
        element.className.indexOf(descending_th_class) !== -1 ||
        (table.className.indexOf(ascending_table_sort_class) !== -1 &&
          element.className.indexOf(ascending_th_class) == -1)
      ) {
        dir = ascending_th_class
      }

      // Update the `th` class accordingly
      reClassify(element, dir)
      const reverse = dir === ascending_th_class

      // loop through all tbodies and sort them
      for (let i = 0; i < table.tBodies.length; i++) {
        const org_tbody: HTMLTableSectionElement = table.tBodies[i]

        // Get the array rows in an array, so we can sort them...
        const rows: HTMLTableRowElement[] = [].slice.call(org_tbody.rows, 0)

        // Sort them using Array.prototype.sort()
        rows.sort(function (a: HTMLTableRowElement, b: HTMLTableRowElement) {
          const x = getValue((reverse ? a : b).cells[column_index])
          const y = getValue((reverse ? b : a).cells[column_index])
          const temp = parseFloat(x) - parseFloat(y)
          const bool = !isNaN(temp) ? temp : x.localeCompare(y)
          return bool
        })

        // Make a clone without content
        const clone_tbody = org_tbody.cloneNode()

        // Fill it with the sorted values
        while (rows.length) {
          clone_tbody.appendChild(rows.splice(0, 1)[0])
        }

        // And finally replace the unsorted table with the sorted one
        table.replaceChild(clone_tbody, org_tbody)
      }
    }
  } catch (error) {
    // console.log(error)
  }
})
