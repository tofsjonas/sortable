const enhanceSortableAccessibility = (tables: NodeListOf<HTMLTableElement>) => {
  function updateAriaLabel(header_element: HTMLTableCellElement) {
    // Generate aria-label based on header content
    const header_text = header_element.textContent || ''
    const direction = header_element.classList.contains('dir-d') ? 'ascending' : 'descending'

    const aria_label = `Click to sort table by ${header_text} in ${direction} order`

    header_element.setAttribute('aria-label', aria_label)
    // header_element.setAttribute('title', aria_label)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const element = event.target as HTMLTableCellElement
      element.click()
    }
  }

  tables.forEach((table) => {
    const headers = table.querySelectorAll('th')
    headers.forEach((header) => {
      const header_element = header as HTMLTableCellElement

      header_element.setAttribute('tabindex', '0')
      updateAriaLabel(header_element)

      header_element.addEventListener('click', () => {
        // Add a delay to allow the new sort order to be applied
        setTimeout(() => {
          updateAriaLabel(header_element)
        }, 50)
      })

      // Attach event handlers
      header_element.addEventListener('keydown', handleKeyDown)
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  enhanceSortableAccessibility(document.querySelectorAll<HTMLTableElement>('.sortable'))
})
