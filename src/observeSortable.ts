// src/observeSortable.ts
import { enhanceSortableAccessibility } from './a11y/enhanceSortableAccessibility'
import { sortSortable } from './sortSortable'

export function observeSortable() {
  const observer = new MutationObserver((mutations_list) => {
    for (const mutation of mutations_list) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.tagName === 'TABLE' && node.classList.contains('sortable')) {
            enhanceSortableAccessibility([node as HTMLTableElement]) // Enhance accessibility for the new table
            sortSortable(node as HTMLTableElement, node.classList.contains('asc')) // Call sortSortable with the new table
          }
        })
      }
    }
  })

  // Start observing the document body for changes
  observer.observe(document.body, {
    childList: true, // Observe direct children being added or removed
    subtree: true, // Observe all descendants
  })

  // Enhance accessibility and sort existing sortable tables
  const tables = document.querySelectorAll<HTMLTableElement>('.sortable')
  tables.forEach((table) => {
    enhanceSortableAccessibility([table]) // Enhance accessibility for the new table
    sortSortable(table, table.classList.contains('asc')) // Call sortSortable with the new table
  })
}
