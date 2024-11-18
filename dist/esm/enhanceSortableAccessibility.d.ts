/**
 * This is a "plugin" for the sortable package:
 * https://www.npmjs.com/package/sortable-tablesort
 * https://github.com/tofsjonas/sortable
 *
 * Enhances the accessibility of class="sortable" tables by adding ARIA attributes and keyboard event listeners.
 * @param tables - A list of HTML table elements to enhance.
 */
export declare const enhanceSortableAccessibility: (tables: NodeListOf<HTMLTableElement> | HTMLTableElement[]) => void;
