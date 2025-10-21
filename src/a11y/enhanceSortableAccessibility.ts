// src/enhanceSortableAccessibility.ts

import { updateSortableAriaLabel } from './updateSortableAriaLabel'

/**
 * This is a "plugin" for the sortable package:
 * https://www.npmjs.com/package/sortable-tablesort
 * https://github.com/tofsjonas/sortable
 *
 * Enhances the accessibility of class="sortable" tables by adding ARIA attributes and keyboard event listeners.
 * @param tables - A list of HTML table elements to enhance.
 */
export function enhanceSortableAccessibility(tables: NodeListOf<HTMLTableElement> | HTMLTableElement[]) {
  /**
   * Handles keyboard events on table header cells and triggers a click event when the Enter key is pressed.
   * @param event - The keyboard event to handle.
   */
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const element = event.target as HTMLTableCellElement
      element.click()
    }
  }

  // Iterate over each table in the input list
  tables.forEach((table) => {
    const default_direction = table.classList.contains('asc') ? 'ascending' : 'descending'
    const headers = table.querySelectorAll('th')

    // Iterate over each header cell in the table
    headers.forEach((header) => {
      const element = header as HTMLTableCellElement

      // Skip if the header cell already has a tabindex attribute
      if (element.hasAttribute('tabindex')) return

      if (element.classList.contains('no-sort')) {
        updateSortableAriaLabel(element, 'no-sort')
        return
      }

      // Add tabindex attribute and generate initial aria-label attribute
      element.setAttribute('tabindex', '0')

      const update = () => {
        updateSortableAriaLabel(element, default_direction)
      }

      update()

      // Attach click event listener to update aria-label attribute
      element.addEventListener('click', () => {
        // Add a delay to allow the new sort order to be applied
        setTimeout(update, 50)
      })

      // Attach focus event listener to update aria-label attribute
      element.addEventListener('focus', update)

      // Attach keyboard event listener to trigger click event
      element.addEventListener('keydown', handleKeyDown)
    })
  })
}
