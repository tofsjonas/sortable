function sortSortable(table, alt_sort) {
  var null_last_class = "n-last", th = table.tHead.querySelector("th[aria-sort]");
  if (!th)
    return;
  table.dispatchEvent(new Event("sort-start", { bubbles: !0 }));
  var th_row = table.tHead.children[0], direction = th.getAttribute("aria-sort"), reverse = direction === "ascending", sort_null_last = table.classList.contains(null_last_class);
  function getValue(element) {
    var _a, _b;
    if (!element)
      return "";
    if (alt_sort && element.dataset.sortAlt !== void 0)
      return element.dataset.sortAlt;
    if (element.dataset.sort !== void 0)
      return element.dataset.sort;
    var first_child = element.firstChild;
    if (first_child)
      switch (first_child.nodeName) {
        case "TIME":
          return first_child.dateTime;
        case "DATA":
          return first_child.value;
        case "METER":
          return first_child.value.toString();
        case "PROGRESS":
          return ((_a = first_child.value) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        case "ABBR":
          return first_child.title;
      }
    return ((_b = element.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
  }
  for (var compare = function(a, b, index) {
    var x = getValue(b.cells[index]), y = getValue(a.cells[index]);
    if (sort_null_last) {
      if (x === "" && y !== "")
        return -1;
      if (y === "" && x !== "")
        return 1;
    }
    var temp = +x - +y, bool = isNaN(temp) ? x.localeCompare(y) : temp;
    return bool === 0 && th_row.cells[index] && th_row.cells[index].hasAttribute("data-sort-tbr") ? compare(a, b, +th_row.cells[index].dataset.sortTbr) : reverse ? -bool : bool;
  }, i = 0; i < table.tBodies.length; i++) {
    var org_tbody = table.tBodies[i], rows = [].slice.call(org_tbody.rows, 0);
    rows.sort(function(a, b) {
      var _a;
      return compare(a, b, +((_a = th.dataset.sortCol) !== null && _a !== void 0 ? _a : th.cellIndex));
    });
    var clone_tbody = org_tbody.cloneNode();
    clone_tbody.append.apply(clone_tbody, rows), table.replaceChild(clone_tbody, org_tbody);
  }
  table.dispatchEvent(new Event("sort-end", { bubbles: !0 }));
}
export {
  sortSortable
};
