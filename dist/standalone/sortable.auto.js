function sortSortable(table, alt_sort) {
  var null_last_class = "n-last", th = table.tHead.querySelector("th[aria-sort]");
  if (!th)
    return;
  table.dispatchEvent(new Event("sort-start", { bubbles: !0 }));
  var th_row = table.tHead.children[0], direction = th.getAttribute("aria-sort"), reverse = direction === "ascending", sort_null_last = table.classList.contains(null_last_class);
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
function sortableEventListener(e) {
  function findElementRecursive(element2, tag) {
    return element2.nodeName === tag ? element2 : findElementRecursive(element2.parentNode, tag);
  }
  try {
    var ascending_table_sort_class = "asc", no_sort_class = "no-sort", table_class_name = "sortable", alt_sort_1 = e.shiftKey || e.altKey, element = findElementRecursive(e.target, "TH"), tr = element.parentNode, thead = tr.parentNode, table_1 = thead.parentNode;
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
function enhanceSortableAccessibility(tables) {
  function updateAriaLabel(element, default_direction) {
    var _a;
    default_direction === void 0 && (default_direction = "");
    var header_text = element.textContent || "element", current_direction = (_a = element.getAttribute("aria-sort")) !== null && _a !== void 0 ? _a : "", new_direction = "descending";
    (current_direction === "descending" || default_direction && current_direction !== "ascending") && (new_direction = "ascending");
    var aria_label = "Click to sort table by ".concat(header_text, " in ").concat(new_direction, " order");
    element.setAttribute("aria-label", aria_label);
  }
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      var element = event.target;
      element.click();
    }
  }
  tables.forEach(function(table) {
    var default_direction = table.classList.contains("asc") ? "ascending" : "", headers = table.querySelectorAll("th");
    headers.forEach(function(header) {
      var element = header;
      if (!element.hasAttribute("tabindex")) {
        var update = function() {
          updateAriaLabel(element, default_direction);
        };
        element.setAttribute("tabindex", "0"), update(), element.addEventListener("click", function() {
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
