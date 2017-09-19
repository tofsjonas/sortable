/**
 * sortable 1.0
 *
 * Makes html tables sortable, ie9+
 *
 * Styling is done in css.
 *
 * Copyright 2017 Jonas Earendel
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

document.addEventListener('click',function (e){//window.addEventListener won't work in mobile safari
    var element        = e.target;
    if(element.nodeName == 'TH'){
        var table_class   = 'sortable';
        var down_class    = 'dir-down'; //classes placed in the beginning to simplify editing
        var up_class      = 'dir-up';
        var regex_table   = new RegExp('\\b' + table_class + '\\b');
        var table = element.parentNode.parentNode.parentNode;
        if(regex_table.test(table.className)){
            var regex_down = new RegExp('\\b' + down_class + '\\b');
            var regex_up   = new RegExp('\\b' + up_class + '\\b');
            var index;

            var nodes = element.parentNode.getElementsByTagName('TH'); //reset all others and get the index of the column in question
            for (var i = 0; i < nodes.length; i++) {
                if(nodes[i]===element){
                    index=i;
                }
                else {
                    nodes[i].className= nodes[i].className.replace(regex_down,'').replace(regex_up,'').trim();
                }
            }

            var cl  = element.className; // set the right class, so it looks right.
            var dir = down_class;
            if(regex_down.test(cl)){
                cl = cl.replace(regex_down,'').trim();
                dir = up_class;
                cl += ' ' + up_class;
            }else {
                cl = cl.replace(regex_up,'').trim();
                cl += ' ' + down_class;
            }
            element.className = cl;

            var orgtbody = table.getElementsByTagName('TBODY')[0]; // extract all table rows, so the sorting can start.
            var tbody    = orgtbody.cloneNode(true); // slightly faster if cloned, noticable for large tables (> 1000 rows). Don't ask me why.
            var trs      = tbody.getElementsByTagName('TR');
            var rows     = Array.prototype.slice.call(trs, 0);

            rows.sort(function(a,b){ // sort them using built in array sort.
                a = a.children[index].innerText;
                b = b.children[index].innerText;
                if(dir==up_class){
                    var c=a; a=b, b=c;
                }
                return isNaN(a-b) ? a.localeCompare(b) : a-b;
            });

            var clone = tbody.cloneNode(); // Build the sorted table body and replace the old one.
            for (i = 0; i < rows.length; i++) {
                clone.appendChild(rows[i].cloneNode(true));
            }
            table.replaceChild(clone,orgtbody);
        }
    }
});
