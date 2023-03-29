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
document.addEventListener('click', function (e) {
    try {
        // allows for elements inside TH
        function findElementRecursive(element, tag) {
            return element.nodeName === tag ? element : findElementRecursive(element.parentNode, tag);
        }
        var descending_th_class_1 = 'dir-d';
        var ascending_th_class_1 = 'dir-u';
        var ascending_table_sort_class = 'asc';
        var table_class_name = 'sortable';
        var alt_sort_1 = e.shiftKey || e.altKey;
        var element = findElementRecursive(e.target, 'TH');
        var tr = findElementRecursive(element, 'TR');
        var table = findElementRecursive(tr, 'TABLE');
        function reClassify(element, dir) {
            element.classList.remove(descending_th_class_1);
            element.classList.remove(ascending_th_class_1);
            if (dir)
                element.classList.add(dir);
        }
        function getValue(element) {
            var value = (alt_sort_1 && element.dataset.sortAlt) || element.dataset.sort || element.textContent;
            return value;
        }
        if (table.classList.contains(table_class_name)) {
            var column_index_1;
            var nodes = tr.cells;
            var tiebreaker_1 = parseInt(element.dataset.sortTbr);
            // Reset thead cells and get column index
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i] === element) {
                    column_index_1 = parseInt(element.dataset.sortCol) || i;
                }
                else {
                    reClassify(nodes[i], '');
                }
            }
            var dir = descending_th_class_1;
            // Check if we're sorting ascending or descending
            if (element.classList.contains(descending_th_class_1) ||
                (table.classList.contains(ascending_table_sort_class) && !element.classList.contains(ascending_th_class_1))) {
                dir = ascending_th_class_1;
            }
            // Update the `th` class accordingly
            reClassify(element, dir);
            var reverse_1 = dir === ascending_th_class_1;
            var compare_1 = function (a, b, index) {
                var x = getValue((reverse_1 ? a : b).cells[index]);
                var y = getValue((reverse_1 ? b : a).cells[index]);
                var temp = parseFloat(x) - parseFloat(y);
                var bool = isNaN(temp) ? x.localeCompare(y) : temp;
                return bool;
            };
            // loop through all tbodies and sort them
            for (var i = 0; i < table.tBodies.length; i++) {
                var org_tbody = table.tBodies[i];
                // Put the array rows in an array, so we can sort them...
                var rows = [].slice.call(org_tbody.rows, 0);
                // Sort them using Array.prototype.sort()
                rows.sort(function (a, b) {
                    var bool = compare_1(a, b, column_index_1);
                    return bool === 0 && !isNaN(tiebreaker_1) ? compare_1(a, b, tiebreaker_1) : bool;
                });
                // Make an empty clone
                var clone_tbody = org_tbody.cloneNode();
                // Put the sorted rows inside the clone
                clone_tbody.append.apply(clone_tbody, rows);
                // And finally replace the unsorted tbody with the sorted one
                table.replaceChild(clone_tbody, org_tbody);
            }
        }
    }
    catch (error) {
        // console.log(error)
    }
});
