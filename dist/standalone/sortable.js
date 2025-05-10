function sortSortable(table, alt_sort) {
  table.dispatchEvent(new Event("sort-start", { bubbles: true }));
  var null_last_class = "n-last";
  var th = table.tHead.querySelector("th[aria-sort]");
  var th_row = table.tHead.children[0];
  var direction = th.getAttribute("aria-sort");
  var reverse = direction === "ascending";
  var sort_null_last = table.classList.contains(null_last_class);
  function getValue(element) {
    if (element) {
      if (alt_sort && element.dataset.sortAlt)
        return element.dataset.sortAlt;
      if (element.dataset.sort)
        return element.dataset.sort;
      if (element.textContent)
        return element.textContent;
    }
    return "";
  }
  var compare = function(a, b, index) {
    var x = getValue(b.cells[index]);
    var y = getValue(a.cells[index]);
    if (sort_null_last) {
      if (x === "" && y !== "") {
        return -1;
      }
      if (y === "" && x !== "") {
        return 1;
      }
    }
    var temp = +x - +y;
    var bool = isNaN(temp) ? x.localeCompare(y) : temp;
    if (bool === 0 && th_row.cells[index] && th_row.cells[index].hasAttribute("data-sort-tbr")) {
      return compare(a, b, +th_row.cells[index].dataset.sortTbr);
    }
    return reverse ? -bool : bool;
  };
  for (var i = 0; i < table.tBodies.length; i++) {
    var org_tbody = table.tBodies[i];
    var rows = [].slice.call(org_tbody.rows, 0);
    rows.sort(function(a, b) {
      var _a;
      return compare(a, b, +((_a = th.dataset.sortCol) !== null && _a !== void 0 ? _a : th.cellIndex));
    });
    var clone_tbody = org_tbody.cloneNode();
    clone_tbody.append.apply(clone_tbody, rows);
    table.replaceChild(clone_tbody, org_tbody);
  }
  table.dispatchEvent(new Event("sort-end", { bubbles: true }));
}
function sortableEventListener(e) {
  function findElementRecursive(element2, tag) {
    return element2.nodeName === tag ? element2 : findElementRecursive(element2.parentNode, tag);
  }
  try {
    var ascending_table_sort_class = "asc";
    var no_sort_class = "no-sort";
    var table_class_name = "sortable";
    var alt_sort_1 = e.shiftKey || e.altKey;
    var element = findElementRecursive(e.target, "TH");
    var tr = element.parentNode;
    var thead = tr.parentNode;
    var table_1 = thead.parentNode;
    if (thead.nodeName === "THEAD" && // sortable only triggered in `thead`
    table_1.classList.contains(table_class_name) && !element.classList.contains(no_sort_class)) {
      var nodes = tr.cells;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] !== element) {
          nodes[i].removeAttribute("aria-sort");
        }
      }
      var direction = "descending";
      if (element.getAttribute("aria-sort") === "descending" || table_1.classList.contains(ascending_table_sort_class) && element.getAttribute("aria-sort") !== "ascending") {
        direction = "ascending";
      }
      element.setAttribute("aria-sort", direction);
      table_1.dataset.timer && clearTimeout(+table_1.dataset.timer);
      table_1.dataset.timer = setTimeout(function() {
        sortSortable(table_1, alt_sort_1);
      }, 1).toString();
    }
  } catch (error) {
  }
}
document.addEventListener("click", sortableEventListener);
