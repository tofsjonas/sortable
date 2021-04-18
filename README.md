# sortable - a tiny, vanilla JS table sorter

Makes any table with **class="sortable"**, er, sortable. That is the user can click on a table header and change the sorting of the table rows.

Just include the JavaScript and it will work. No function calls needed, all is done with an **eventListener**.
(the CSS is not strictly needed, but makes it ~pretty and user friendly)

> Please note that the **advanced** and **mega-advanced** version have been deprecated.
> I just couldn't justify their existense 🤷‍♂️
> If you need advanced sorting, prepare the tables with the **data-sort** attribute instead.
> The same goes for the ES6 version, it seemed a bit pointless.

## Factoids

- **713 bytes** minified.

- Works with **JS/ajax generated tables**.(due to the eventListener)

- **Lightning fast**. _Huge_ tables will make it slow and may freeze the browser, especially for mobiles, so you know...

- Requires **thead** and **tbody**.

- cross browser, ie9+

- ~~eventListeners attached to the rows _WILL_ be removed~~
- eventListeners are no longer removed! 😊

- NOT tested with react, Angular, Vue, etc. There's just no way it will work without messing them up. Literally **no** way.

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
      <td>Genius</td>
      <td>Rick</td>
    </tr>
    <tr>
      <td><a href="javascript:alert('Inline javascript works!');">Sidekick</a></td>
      <td>Morty</td>
    </tr>
  </tbody>
</table>
<link href="sortable.css" rel="stylesheet" />
<script src="sortable.js"></script>
```

### Non-sortable field

#### using `class=".no-sort"`

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

#### using css only

This is a bit trickier, but it doesn't require any changes to the html, so I guess it could be worth it in some cases.

```css
/* the first column in every sortable table
 should not be sortable*/
.sortable th:nth-child(1) {
  background: pink;
  color: red;
  pointer-events: none;
}

/* the seventh column in the second .sortable
 table should not be sortable*/
.sortable:nth-of-type(2) th:nth-child(7) {
  background: pink;
  color: red;
  pointer-events: none;
}
```

## The `data-sort` attribute

Using the `data-sort` attribute you can have one visible value and one sortable value.
This is useful in case you have for instance sizes like kb, Mb, GB, etc.

```html
<table class="sortable">
  <thead>
    <tr>
      <th>Movie Name</th>
      <th>Size</th>
      <th>Release date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Zack Snyder's Justice League</td>
      <td data-sort="943718400">900MB</td>
      <td data-sort="20210318">03/18/2021</td>
    </tr>
    <tr>
      <td>The Sound of Music</td>
      <td data-sort="1610612736">1.5GB</td>
      <td data-sort="19651209">12/09/1965</td>
    </tr>
  </tbody>
</table>
```
