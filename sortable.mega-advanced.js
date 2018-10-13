/**
 * sortable mega-advanced 1.0
 *
 * Makes html tables sortable (has not been tested in ie9)
 *
 * If you only want simple sorting, use the standard one
 *
 * Here you can add any kind of sort you like
 *
 * It is quite flexible, but will slow it down, since there are
 * a lot of extra conditions and function calls
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

document.addEventListener( 'click', function ( e ) {

    var down_class = ' dir-d ';
    var up_class = ' dir-u ';
    var regex_dir = / dir-(u|d) /;
    var regex_table = /\bsortable\b/;
    var get_data_attribute_name = 'data-sort';
    var th_element = e.target;
    var column_index;

    /**
     * So google closure doesn't throw a fit over the sometimes empty dir argument
     * @param {EventTarget} element
     * @param  {string=} dir
     * @return void
     */
    function reclassify( element, dir ) {
        element.className = element.className.replace( regex_dir, '' ) + dir || '';
    }

    // function getData( tr, func ) { // fewer chars, but the other one is prettier
    //     var cell = tr.cells[ column_index ];
    //     var data = cell.getAttribute( get_data_attribute_name ) || '';
    //     if ( !data.length ) {
    //         data = func.getData( cell )
    //         cell.setAttribute( get_data_attribute_name, data );
    //     }
    //     return data;
    // }

    function getData( tr, func ) {
        var cell = tr.cells[ column_index ];
        if ( !cell.hasAttribute( get_data_attribute_name ) ) {
            cell.setAttribute( get_data_attribute_name, func.getData( cell ) );
        }
        return cell.getAttribute( get_data_attribute_name );
    }

    // Here are some examples of mega-advanced sorting "algorithms"
    // The "useMe" function returns true or false if its getData is to be used
    var get_data_functions = [
        // Sort data sizes, such as GB, MB, kB, etc:
        {
            // if the th element has the class "size", do this
            useMe: function () {
                return /\bsize\b/.test( th_element.className );
            },
            getData: function ( cell ) {
                var matches = cell.innerText.match( /(\d+)([kMGT])B/ )
                var vals = {
                    k: 1,
                    M: 2,
                    G: 3,
                    T: 4,
                };
                return matches[ 1 ] * Math.pow( 1000, vals[ matches[ 2 ] ] )
            },
        },
        { // if you want to sort weird date formats, this is one possible solution:
            useMe: function () {
                // if the class of the table header element has a "date" in it:
                return /\bdate\b/.test( th_element.className );
                // if the content of the table header element has a "date" in it:
                // return /\bdate\b/i.test( th_element.innerText );
            },
            getData: function () {
                return cell.innerText.replace( /(\d+)\/(\d+)\/(\d+)/, '$3$1$2' )
            },
        },
        { // default
            useMe: function () {
                return true;
            },
            getData: function ( cell ) {
                return cell.innerText;
            },
        },
    ];

    if ( th_element.nodeName == 'TH' ) {

        var table = th_element.offsetParent;

        // make sure it is a sortable table
        if ( regex_table.test( table.className ) ) {

            var tr = th_element.parentNode;
            var nodes = tr.cells;

            // reset thead cells and get column index
            for ( var i = 0; i < nodes.length; i++ ) {
                if ( nodes[ i ] === th_element ) {
                    column_index = i;
                } else {
                    reclassify( nodes[ i ] );
                }
            }

            var dir = down_class;

            // check if we're sorting up or down, and update the css accordingly
            if ( th_element.className.indexOf( down_class ) !== -1 ) {
                dir = up_class;
            }

            reclassify( th_element, dir );

            // extract all table rows, so the sorting can start.
            var org_tbody = table.tBodies[ 0 ];

            // slightly faster if cloned, noticable for huge tables.
            var rows = [].slice.call( org_tbody.cloneNode( true ).rows, 0 );
            var reverse = ( dir == up_class );
            var get_data_func;

            for ( var i = 0; i < get_data_functions.length; i++ ) {
                get_data_func = get_data_functions[ i ];
                if ( get_data_func.useMe() ) break;
            }

            // sort them using custom built in array sort.
            rows.sort( function ( a, b ) {
                a = getData( a, get_data_func )
                b = getData( b, get_data_func )
                if ( reverse ) {
                    var c = a;
                    a = b;
                    b = c;
                }
                // return func.compare( a, b );
                return isNaN( a - b ) ? a.localeCompare( b ) : a - b;
            } );

            // Make a clone without contents
            var clone_tbody = org_tbody.cloneNode();


            // Build a sorted table body and replace the old one.
            for ( i = 0; i < rows.length; i++ ) {
                clone_tbody.appendChild( rows[ i ] );
            }

            // And finally insert the end result
            table.replaceChild( clone_tbody, org_tbody );
        }

    }
} );