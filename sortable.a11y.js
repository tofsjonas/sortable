var enhanceSortableAccessibility = function (tables) {
    function updateAriaLabel(header_element) {
        // Generate aria-label based on header content
        var header_text = header_element.textContent || '';
        var direction = header_element.classList.contains('dir-d') ? 'ascending' : 'descending';
        var aria_label = "Click to sort table by ".concat(header_text, " in ").concat(direction, " order");
        header_element.setAttribute('aria-label', aria_label);
        // header_element.setAttribute('title', aria_label)
    }
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            var element = event.target;
            element.click();
        }
    }
    tables.forEach(function (table) {
        var headers = table.querySelectorAll('th');
        headers.forEach(function (header) {
            var header_element = header;
            header_element.setAttribute('tabindex', '0');
            updateAriaLabel(header_element);
            header_element.addEventListener('click', function () {
                // Add a delay to allow the new sort order to be applied
                setTimeout(function () {
                    updateAriaLabel(header_element);
                }, 50);
            });
            // Attach event handlers
            header_element.addEventListener('keydown', handleKeyDown);
        });
    });
};
document.addEventListener('DOMContentLoaded', function () {
    var tables = document.querySelectorAll('.sortable');
    enhanceSortableAccessibility(tables);
});
