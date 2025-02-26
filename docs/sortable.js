document.addEventListener("click", function(e) {
  try {
    var alt_sort_1 = e.shiftKey || e.altKey, element = function findElementRecursive(element2, tag) {
      return element2.nodeName === tag ? element2 : findElementRecursive(element2.parentNode, tag);
    }(e.target, "TH"), tr = element.parentNode, thead = tr.parentNode, table_1 = thead.parentNode;
    if (thead.nodeName === "THEAD" && // sortable only triggered in `thead`
    table_1.classList.contains("sortable") && !element.classList.contains("no-sort")) {
      for (var nodes = tr.cells, i = 0; i < nodes.length; i++) nodes[i] !== element && nodes[i].removeAttribute("aria-sort");
      var direction = "descending";
      (element.getAttribute("aria-sort") === "descending" || table_1.classList.contains("asc") && element.getAttribute("aria-sort") !== "ascending") && (direction = "ascending"), element.setAttribute("aria-sort", direction), table_1.dataset.timer && clearTimeout(+table_1.dataset.timer), table_1.dataset.timer = setTimeout(function() {
        (function(table, alt_sort) {
          table.dispatchEvent(new Event("sort-start", { bubbles: !0 }));
          var th = table.tHead.querySelector("th[aria-sort]"), th_row = table.tHead.children[0], reverse = th.getAttribute("aria-sort") === "ascending", sort_null_last = table.classList.contains("n-last");
          function getValue(element2) {
            var _a;
            return alt_sort && element2.dataset.sortAlt ? element2.dataset.sortAlt : (_a = element2.dataset.sort) !== null && _a !== void 0 ? _a : element2.textContent;
          }
          for (var compare = function(a, b, index) {
            var x = getValue(b.cells[index]), y = getValue(a.cells[index]);
            if (sort_null_last) {
              if (x === "" && y !== "") return -1;
              if (y === "" && x !== "") return 1;
            }
            var temp = +x - +y, bool = isNaN(temp) ? x.localeCompare(y) : temp;
            return bool === 0 && th_row.cells[index] && th_row.cells[index].hasAttribute("data-sort-tbr") ? compare(a, b, +th_row.cells[index].dataset.sortTbr) : reverse ? -bool : bool;
          }, i2 = 0; i2 < table.tBodies.length; i2++) {
            var org_tbody = table.tBodies[i2], rows = [].slice.call(org_tbody.rows, 0);
            rows.sort(function(a, b) {
              var _a;
              return compare(a, b, +((_a = th.dataset.sortCol) !== null && _a !== void 0 ? _a : th.cellIndex));
            });
            var clone_tbody = org_tbody.cloneNode();
            clone_tbody.append.apply(clone_tbody, rows), table.replaceChild(clone_tbody, org_tbody);
          }
          table.dispatchEvent(new Event("sort-end", { bubbles: !0 }));
        })(table_1, alt_sort_1);
      }, 1).toString();
    }
  } catch {
  }
});
