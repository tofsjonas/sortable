/**
 * sortable 1.0
 *
 * Makes html tables sortable, ie9+
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


// why encapsulate what is already encapsulated?

document.addEventListener('click', function(e) {

    var down_class = ' dir-d ';
    var up_class = ' dir-u ';
    var regex_dir = / dir-(u|d) /;
    var regex_table = /\bsortable\b/;
    var element = e.target;

    function reclassify(element, dir) {
        element.className = element.className.replace(regex_dir, '') + dir;
    }

    if (element.nodeName == 'TH') {

        var table = element.offsetParent;

        // make sure it is a sortable table
        if (regex_table.test(table.className)) {

            var column_index;
            var tr = element.parentNode;
            var nodes = tr.cells;

            // reset thead cells and get column index
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i] === element) {
                    column_index = i;
                } else {
                    reclassify(nodes[i], '');
                }
            }

            var dir = down_class;

            // check if we're sorting up or down, and update the css accordingly
            if (element.className.indexOf(down_class) !== -1) {
                dir = up_class;
            }

            reclassify(element, dir);

            // extract all table rows, so the sorting can start.
            var org_tbody = table.tBodies[0];

            // slightly faster if cloned, noticable for huge tables.
            var rows = [].slice.call(org_tbody.cloneNode(true).rows, 0);

            var reverse = (dir == up_class);

            // sort them using custom built in array sort.
            rows.sort(function(a, b) {
                a = a.cells[column_index].innerText;
                b = b.cells[column_index].innerText;
                if (reverse) {
                    var c = a;
                    a = b;
                    b = c;
                }
                return isNaN(a - b) ? a.localeCompare(b) : a - b;
            });

            // Make a clone without contents
            var clone_tbody = org_tbody.cloneNode();

            // Build a sorted table body and replace the old one.
            for (i = 0; i < rows.length; i++) {
                clone_tbody.appendChild(rows[i]);
            }

            // for ( i in rows ) { apparently bad practice
            //     clone_tbody.appendChild( rows[ i ] );
            // }

            // And finally insert the end result
            table.replaceChild(clone_tbody, org_tbody);
        }

    }

});