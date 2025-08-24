import { sortableEventListener } from "./sortableEventListener.js";
import { observeSortable } from "./observeSortable.js";
document.addEventListener("click", sortableEventListener);
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", observeSortable) : observeSortable();
