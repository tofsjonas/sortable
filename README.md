# sortable - a tiny, vanilla JS table sorter

Makes any table with **class="sortable"**, er, sortable. That is the user can click on a table header and change the sorting of the table rows.

Just include the JavaScript and it will work. No function calls needed, all is done with an **eventListener**.
(the CSS is not strictly needed, but makes it ~pretty and user friendly)

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [sortable - a tiny, vanilla JS table sorter](#sortable---a-tiny-vanilla-js-table-sorter)
  - [Factoids](#factoids)
  - [Demo](#demo)
  - [An example](#an-example)
    - [Non sortable field](#non-sortable-field)
  - [Advanced example](#advanced-example)
  - [Mega-advanced example](#mega-advanced-example)
  - [ES6](#es6)

<!-- /TOC -->

## Factoids

- **649 bytes** minified.

- Works with **JS/ajax generated tables**.(due to the eventListener)

- **Lightning fast**. _Huge_ tables will make it slow and may freeze the browser, especially for mobiles, so you know...

- Requires **thead** and **tbody**.

- cross browser, ie9+

- eventListeners attached to the rows _WILL_ be removed

- NOT tested with react, Angular, Vue, etc. I would be _very_ surprised if it didn't implode.

## Demo

You can find a simple demo on <https://tofsjonas.github.io/sortable/>

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
<link href="sortable.css" rel="stylesheet" />
<script src="sortable.js"></script>
```

### Non sortable field

If you wish to disable sorting for a specific field, the easiest way is to add a class to it, like so:

```html
<tr>
  <th class="no-sort">Role</th>
  <th>Name</th>
</tr>
```

and then use css to block clicks. like so:

```css
th.no-sort {
  pointer-events: none;
}
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
      <td data-sort="2">
        <a href="javascript:alert('Morty');">Morty</a>
      </td>
    </tr>
  </tbody>
</table>
<link href="sortable.css" rel="stylesheet" />
<script src="sortable.advanced.js"></script>
```

## Mega-advanced example

With size(GB, MB, kB) and weird date format

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
<link href="sortable.css" rel="stylesheet" />
<script src="sortable.mega-advanced.js"></script>
```

## ES6

Slightly more code unfortunately, mainly due to reusability. Couldn't think of a way to prevent that without making separate sortable-functions, like in the old versions :(

```js
import getSortFunc from "sortfunc.default";
//import getSortFunc from 'sortfunc.advanced';
//import getSortFunc from 'sortfunc.mega-advanced';
import sortable from "sortable.es6";
sortable(document, getSortFunc);
```

OR

```js
import getSortFunc from "sortfunc.default";
//import getSortFunc from 'sortfunc.advanced';
//import getSortFunc from 'sortfunc.mega-advanced';
import sortable from "sortable.es6";

sortable(document.getElementById("[some-table-id]"), getSortFunc);
sortable(document.getElementById("[another-table-id]"), getSortFunc);
```
