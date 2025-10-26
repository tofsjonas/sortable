function sortSortable(table, alt_sort) {
  var null_last_class = "n-last", th = table.tHead.querySelector("th[aria-sort]");
  if (!th)
    return;
  table.dispatchEvent(new Event("sort-start", { bubbles: !0 }));
  var th_row = table.tHead.children[0], direction = th.getAttribute("aria-sort"), reverse = direction === "ascending", sort_null_last = table.classList.contains(null_last_class);
  function getValue(element) {
    var _a;
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
          return first_child.value;
        case "PROGRESS":
          return first_child.value;
        case "ABBR":
          return first_child.title;
      }
    return ((_a = element.textContent) !== null && _a !== void 0 ? _a : "").trim();
  }
  for (var compareFn = function(a, b, index) {
    var x = getValue(b.cells[index]), y = getValue(a.cells[index]);
    if (sort_null_last) {
      if (x === "" && y !== "")
        return -1;
      if (y === "" && x !== "")
        return 1;
    }
    var temp = +x - +y, bool = isNaN(temp) ? x.localeCompare(y) : temp;
    return bool === 0 && th_row.cells[index] && th_row.cells[index].hasAttribute("data-sort-tbr") ? compareFn(a, b, +th_row.cells[index].dataset.sortTbr) : reverse ? -bool : bool;
  }, i = 0; i < table.tBodies.length; i++) {
    var org_tbody = table.tBodies[i], rows = [].slice.call(org_tbody.rows, 0);
    rows.sort(function(a, b) {
      var _a;
      return compareFn(a, b, +((_a = th.dataset.sortCol) !== null && _a !== void 0 ? _a : th.cellIndex));
    });
    var clone_tbody = org_tbody.cloneNode();
    clone_tbody.append.apply(clone_tbody, rows), table.replaceChild(clone_tbody, org_tbody);
  }
  table.dispatchEvent(new Event("sort-end", { bubbles: !0 }));
}
function sortableEventListener(e) {
  try {
    var ascending_table_sort_class = "asc", no_sort_class = "no-sort", table_class_name = "sortable", alt_sort_1 = e.shiftKey || e.altKey, element = e.target.closest("th"), tr = element.parentNode, thead = tr.parentNode, table_1 = thead.parentNode;
    if (thead.nodeName === "THEAD" && // sortable only triggered in `thead`
    table_1.classList.contains(table_class_name) && !element.classList.contains(no_sort_class)) {
      for (var nodes = tr.cells, i = 0; i < nodes.length; i++)
        nodes[i] !== element && nodes[i].removeAttribute("aria-sort");
      var direction = "descending";
      (element.getAttribute("aria-sort") === "descending" || table_1.classList.contains(ascending_table_sort_class) && element.getAttribute("aria-sort") !== "ascending") && (direction = "ascending"), element.setAttribute("aria-sort", direction), table_1.dataset.timer && clearTimeout(+table_1.dataset.timer), table_1.dataset.timer = setTimeout(function() {
        sortSortable(table_1, alt_sort_1);
      }, 1).toString();
    }
  } catch {
  }
}
function updateSortableAriaLabel(element, default_direction) {
  var header_text = element.textContent || "element", aria_label = "Column ".concat(header_text, " is not sortable");
  if (default_direction !== "no-sort") {
    var current_direction = element.getAttribute("aria-sort"), new_direction = default_direction;
    current_direction && (new_direction = current_direction === "descending" ? "ascending" : "descending"), aria_label = "Click to sort table by ".concat(header_text, " in ").concat(new_direction, " order");
  }
  element.setAttribute("aria-label", aria_label);
}
function enhanceSortableAccessibility(tables) {
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      var element = event.target;
      element.click();
    }
  }
  tables.forEach(function(table) {
    var default_direction = table.classList.contains("asc") ? "ascending" : "descending", headers = table.querySelectorAll("th");
    headers.forEach(function(header) {
      var element = header;
      if (!element.hasAttribute("tabindex")) {
        if (element.classList.contains("no-sort")) {
          updateSortableAriaLabel(element, "no-sort");
          return;
        }
        element.setAttribute("tabindex", "0");
        var update = function() {
          updateSortableAriaLabel(element, default_direction);
        };
        update(), element.addEventListener("click", function() {
          setTimeout(update, 50);
        }), element.addEventListener("focus", update), element.addEventListener("keydown", handleKeyDown);
      }
    });
  });
}
function observeSortable() {
  var observer = new MutationObserver(function(mutations_list) {
    for (var _i = 0, mutations_list_1 = mutations_list; _i < mutations_list_1.length; _i++) {
      var mutation = mutations_list_1[_i];
      mutation.type === "childList" && mutation.addedNodes.forEach(function(node) {
        node instanceof HTMLElement && node.tagName === "TABLE" && node.classList.contains("sortable") && (enhanceSortableAccessibility([node]), sortSortable(node, node.classList.contains("asc")));
      });
    }
  });
  observer.observe(document.body, {
    childList: !0,
    // Observe direct children being added or removed
    subtree: !0
    // Observe all descendants
  });
  var tables = document.querySelectorAll(".sortable");
  tables.forEach(function(table) {
    enhanceSortableAccessibility([table]), sortSortable(table, table.classList.contains("asc"));
  });
}
document.addEventListener("click", sortableEventListener);
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", observeSortable) : observeSortable();
