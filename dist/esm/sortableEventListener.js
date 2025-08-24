import { sortSortable } from "./sortSortable.js";
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
export {
  sortableEventListener
};
