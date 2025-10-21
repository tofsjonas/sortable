function updateSortableAriaLabel(element, default_direction) {
  var header_text = element.textContent || "element", aria_label = "Column ".concat(header_text, " is not sortable");
  if (default_direction !== "no-sort") {
    var current_direction = element.getAttribute("aria-sort"), new_direction = default_direction;
    current_direction && (new_direction = current_direction === "descending" ? "ascending" : "descending"), aria_label = "Click to sort table by ".concat(header_text, " in ").concat(new_direction, " order");
  }
  element.setAttribute("aria-label", aria_label), element.setAttribute("title", aria_label), console.log("🚀 comment me out");
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
export {
  enhanceSortableAccessibility
};
