/**
 * sortable 1.0
 *
 * Makes html tables sortable, ie9+
 *
 * Styling is done in css.
 *
 * Copyright 2015–2017 Jonas Earendel
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

document.addEventListener('click',function (e){
	var element		= e.target;
	if(element.nodeName == 'TH'){
		var sortable	= 'sortable';
		var regex_table	= new RegExp('\\b' + sortable + '\\b');
		var table = element.parentNode.parentNode.parentNode;
		if(regex_table.test(table.className)){
			var dir_down	= 'dir-down';
			var dir_up		= 'dir-up';
			var regex_down	= new RegExp('\\b' + dir_down + '\\b');
			var regex_up	= new RegExp('\\b' + dir_up + '\\b');
			var index;

			//reset all others and get the index of the column in question
			var nodes = element.parentNode.getElementsByTagName('TH');
			for (var i = 0; i < nodes.length; i++) {
				if(nodes[i]==element){
					index=i;
				}
				else {
					nodes[i].className= nodes[i].className.replace(regex_down,'').replace(regex_up,'').trim();
				}
			}

			// set the right class, so it looks right.
			var cl = element.className;
			var dir = dir_down;
			if(regex_down.test(cl)){
				dir = dir_up;
				cl += ' ' + dir_up;
				cl=cl.replace(regex_down,'').trim();
			}
			else {
				cl += 'jonas ' + dir_down;
				cl = cl.replace(regex_up,'').trim();
			}
			element.className = cl;

			// extract all table rows, so the sorting can start.
			var orgtbody	= table.getElementsByTagName('TBODY')[0];
			var tbody		= orgtbody.cloneNode(true); // slightly faster if cloned, noticable for large tables (> 1000 rows). Don't ask me why.
			var trs			= tbody.getElementsByTagName('TR');
			var rows	= Array.prototype.slice.call(trs, 0);

			// sort them using built in array sort.
			rows.sort(function(a,b){
				a = a.children[index].innerText;
				b = b.children[index].innerText;
				if(dir==dir_up){
					var c=a; a=b, b=c;
				}
				return isNaN(a-b) ? a.localeCompare(b) : a-b;
			});

			// Build the sorted table body and replace the old one.
			var clone = tbody.cloneNode();
			for (i = 0; i < rows.length; i++) {
				clone.appendChild(rows[i].cloneNode(true));
			}
			table.replaceChild(clone,orgtbody);
		}
	}
});
