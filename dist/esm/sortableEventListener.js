import { sortSortable } from "./sortSortable.js";
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
export {
  sortableEventListener
};
