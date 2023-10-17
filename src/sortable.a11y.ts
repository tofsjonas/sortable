/**
 * This is a "plugin" for the sortable package:
 * https://www.npmjs.com/package/sortable-tablesort
 * https://github.com/tofsjonas/sortable
 *
 * Enhances the accessibility of class="sortable" tables by adding ARIA attributes and keyboard event listeners.
 * @param tables - A list of HTML table elements to enhance.
 */
const enhanceSortableAccessibility = (tables: NodeListOf<HTMLTableElement>) => {
  /**
   * Generates an aria-label attribute for a table header cell based on its content and current sort direction.
   * @param element - The table header cell to update.
   * @param default_direction - The default sort direction for the table.
   */
  function updateAriaLabel(element: HTMLTableCellElement, default_direction = '') {
    // Generate aria-label based on header content
    const header_text = element.textContent || 'element'

    const current_direction = element.getAttribute('aria-sort') ?? ''
    let new_direction = 'descending'

    if (current_direction === 'descending' || (default_direction && current_direction !== 'ascending')) {
      new_direction = 'ascending'
    }

    const aria_label = `Click to sort table by ${header_text} in ${new_direction} order`

    element.setAttribute('aria-label', aria_label)
    // element.setAttribute('title', aria_label)
  }

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
    const default_direction = table.classList.contains('asc') ? 'ascending' : ''
    const headers = table.querySelectorAll('th')

    // Iterate over each header cell in the table
    headers.forEach((header) => {
      const element = header as HTMLTableCellElement

      // Add tabindex attribute and generate initial aria-label attribute
      element.setAttribute('tabindex', '0')
      updateAriaLabel(element, default_direction)

      // Attach click event listener to update aria-label attribute
      element.addEventListener('click', () => {
        // Add a delay to allow the new sort order to be applied
        setTimeout(() => {
          updateAriaLabel(element, default_direction)
        }, 50)
      })

      // Attach keyboard event listener to trigger click event
      element.addEventListener('keydown', handleKeyDown)
    })
  })
}

// Attach function to DOMContentLoaded event to execute when page is loaded
document.addEventListener('DOMContentLoaded', () => {
  enhanceSortableAccessibility(document.querySelectorAll<HTMLTableElement>('.sortable'))
})
