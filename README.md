# sortable - a tiny, vanilla JS table sorter

Makes any table with **class="sortable"**, er, sortable. That is the user can click on a table header and change the sorting of the table rows.

Just include the JavaScript and it will work. No function calls needed, all is done with an **eventListener**.
(the CSS is not strictly needed, but makes it pretty and user friendly)


#### Worth mentioning:

- **630 bytes** minified.

- Works with **JS/ajax generated tables**.(due to the eventListener)

- **Lightning fast**. For Huge tables it will slow down of course. That's just life I guess.

- Requires thead and tbody.

- cross browser, ie9+

- eventListeners attached to the rows __**WILL**__ be removed


## An example
```html
<table class="sortable">
  <thead>
    <tr>
      <th>Role</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Master</td>
      <td>Rick</td>
    </tr>
    <tr>
      <td>Servant</td>
      <td><a href="javascript:alert('Morty');">Morty</a></td>
    </tr>
  </tbody>
</table>
<link href="sortable.css" rel="stylesheet">
<script src="sortable.js"></script>
```
