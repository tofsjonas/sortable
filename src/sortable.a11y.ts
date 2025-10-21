// src/sortable.a11y.ts
import { enhanceSortableAccessibility } from './a11y/enhanceSortableAccessibility'

// Attach function to DOMContentLoaded event to execute when page is loaded
document.addEventListener('DOMContentLoaded', () => {
  enhanceSortableAccessibility(document.querySelectorAll<HTMLTableElement>('.sortable'))
})
