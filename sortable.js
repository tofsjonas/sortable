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
(function() {
    var down_class    = ' dir-down';
    var up_class      = ' dir-up';
    var regex_table   = /\bsortable\b/;

    document.addEventListener('click',function (e){
        var element        = e.target;
        if(element.nodeName == 'TH'){
            var tr = element.parentNode;
            var table = tr.parentNode.parentNode;
            if(regex_table.test(table.className)){
                var index;
                var nodes = tr.cells;
                for (var i = 0; i < nodes.length; i++) {//reset cells and get index
                    if(nodes[i]===element){
                        index=i;
                    } else {
                        nodes[i].className= nodes[i].className.replace(down_class,'').replace(up_class,'');
                    }
                }
                var cl  = element.className;
                var dir = down_class;
                if(cl.indexOf(down_class)==-1){
                    cl = cl.replace(up_class,'')+down_class;
                }else {
                    dir = up_class;
                    cl = cl.replace(down_class,'')+up_class;
                }
                element.className = cl;
                var orgtbody = table.tBodies[0]; // extract all table rows, so the sorting can start.
                var rows     = [].slice.call(orgtbody.cloneNode(true).rows, 0); // slightly faster if cloned, noticable for huge tables.
                var reverse  = dir==up_class;

                rows.sort(function(a,b){ // sort them using built in array sort.
                    a = a.cells[index].innerText;
                    b = b.cells[index].innerText;
                    if(reverse){
                        var c=a; a=b; b=c;
                    }
                    return isNaN(a-b) ? a.localeCompare(b) : a-b;
                });

                var clone = orgtbody.cloneNode(); // Build the sorted table body and replace the old one.
                for (i = 0; i < rows.length; i++) {
                    clone.appendChild(rows[i]);
                }
                table.replaceChild(clone,orgtbody);
            }
        }
    });
})();
