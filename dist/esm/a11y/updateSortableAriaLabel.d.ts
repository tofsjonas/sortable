/**
 * Generates an aria-label attribute for a table header cell based on its content and current sort direction.
 * @param element - The table header cell to update.
 * @param default_direction - The default sort direction for the table.
 */
type Direction = 'ascending' | 'descending' | 'no-sort';
export declare function updateSortableAriaLabel(element: HTMLTableCellElement, default_direction: Direction): void;
export {};
