# sortable - a tiny, vanilla JS table sorter

Makes any table with **class="sortable"**, er, sortable. That is the user can click on a table header and change the sorting of the table rows.

Just include the JavaScript and it will work. No function calls needed, all is done with an **eventListener**.
(the CSS is not strictly needed, but makes it pretty and user friendly)


#### Worth mentioning:

- **637 bytes** minified.

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
## Advanced example
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
      <td data-sort="a">Master</td>
      <td data-sort="1">Rick</td>
    </tr>
    <tr>
      <td data-sort="b">Servant</td>
      <td data-sort="2"><a href="javascript:alert('Morty');">Morty</a></td>
    </tr>
  </tbody>
</table>
<link href="sortable.css" rel="stylesheet">
<script src="sortable.advanced.js"></script>
```
## Mega Advanced example
(with weird date format)
```html
<table class="sortable">
  <thead>
    <tr>
      <th class="size">Hard disk</th>
      <th class="date">Manufacturing Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2TB</td>
      <td>06/25/18</td>
    </tr>
    <tr>
      <td>500GB</td>
      <td>11/02/15</td>
    </tr>
  </tbody>
</table>
<link href="sortable.css" rel="stylesheet">
<script src="sortable.mega-advanced.js"></script>
```
