# sortable - a tiny, vanilla JS table sorter

Makes any table with **class="sortable"**, er, sortable. That is the user can click on a table header and change the sorting of the table rows.

Just include the JavaScript and it will work. No function calls needed, all is done with an **eventListener**.
(the CSS is not strictly needed, but makes it ~pretty and user friendly)

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Factoids](#factoids)
- [An example](#an-example)
- [Advanced example](#advanced-example)
- [Mega-advanced example](#mega-advanced-example)
- [ES6](#es6)

<!-- /TOC -->


## Factoids


-   **649 bytes** minified.

-   Works with **JS/ajax generated tables**.(due to the eventListener)

-   **Lightning fast**. For Huge tables it will slow down of course. That's just life I guess.

-   Requires **thead** and **tbody**.

-   cross browser, ie9+

-   eventListeners attached to the rows *WILL* be removed

- NOT tested with react, Angular, Vue, etc. I would be *very* surprised if it didn't implode.

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
import getSortFunc from 'sortfunc.default';
//import getSortFunc from 'sortfunc.advanced';
//import getSortFunc from 'sortfunc.mega-advanced';
import sortable from "sortable.es6";
sortable(document, getSortFunc);
```
OR
```js
import getSortFunc from 'sortfunc.default';
//import getSortFunc from 'sortfunc.advanced';
//import getSortFunc from 'sortfunc.mega-advanced';
import sortable from "sortable.es6";

sortable(document.getElementById("[some-table-id]"), getSortFunc);
sortable(document.getElementById("[another-table-id]"), getSortFunc);

```

