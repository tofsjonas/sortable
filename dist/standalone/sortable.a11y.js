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
document.addEventListener("DOMContentLoaded", function() {
  enhanceSortableAccessibility(document.querySelectorAll(".sortable"));
});
