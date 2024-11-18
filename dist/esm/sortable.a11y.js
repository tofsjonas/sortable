import { enhanceSortableAccessibility } from "./enhanceSortableAccessibility.js";
document.addEventListener("DOMContentLoaded", function() {
  enhanceSortableAccessibility(document.querySelectorAll(".sortable"));
});
