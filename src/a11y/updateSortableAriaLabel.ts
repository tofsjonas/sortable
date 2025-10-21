/**
 * Generates an aria-label attribute for a table header cell based on its content and current sort direction.
 * @param element - The table header cell to update.
 * @param default_direction - The default sort direction for the table.
 */

type Direction = 'ascending' | 'descending' | 'no-sort'
export function updateSortableAriaLabel(element: HTMLTableCellElement, default_direction: Direction) {
  // Generate aria-label based on header content
  const header_text = element.textContent || 'element'

  let aria_label = `Column ${header_text} is not sortable`

  if (default_direction !== 'no-sort') {
    const current_direction = element.getAttribute('aria-sort')
    let new_direction = default_direction

    if (current_direction) {
      new_direction = current_direction === 'descending' ? 'ascending' : 'descending'
    }

    aria_label = `Click to sort table by ${header_text} in ${new_direction} order`
  }

  element.setAttribute('aria-label', aria_label)

  // REMEMBER TO COMMENT OUT WHEN NOT TESTING!!
  element.setAttribute('title', aria_label)
  console.log('🚀 comment me out')
}
