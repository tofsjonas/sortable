# sortable

Makes any table with class="sortable", er, sortable.

Requires thead and tbody. Like so:

table
  thead
    tr
      th
  tbody
    tr
      td
   

ie9 and less won't work, since classList is used. But that's easy to fix if you feel like it.

For Huge tables it will be slow of course. (But so are the jquery solutions I've found.)
