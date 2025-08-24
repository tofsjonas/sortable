import { enhanceSortableAccessibility } from "./enhanceSortableAccessibility.js";
import { sortSortable } from "./sortSortable.js";
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
export {
  observeSortable
};
