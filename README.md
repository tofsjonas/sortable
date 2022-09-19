# sortable - a tiny, vanilla JS table sorter

Makes any table with **class="sortable"**, er, sortable. That is the user can click on a table header and change the sorting of the table rows.

Just include the JavaScript and it will work. No function calls needed, all is done with an **eventListener**.
(the CSS is not strictly needed, but makes it ~pretty and user friendly)

## Factoids

- **900 bytes** minified. (532 bytes gzipped)

- Works with **JS/ajax generated tables**.(due to the eventListener)

- **Lightning fast**. _Huge_ tables will make it slow and may freeze the browser, especially for mobiles, so you know...

- Requires **thead** and **tbody**.

- cross browser, ie9+

- ~~eventListeners attached to the rows _WILL_ be removed~~
- eventListeners are no longer removed! 😊

- NOT tested with React, Angular, Vue, etc.

- Works with [Svelte](https://svelte.dev/)!

- `table` > `class="sortable asc"` let's you sort ascending as default. Thanks [
  Nikita Dunajevs](https://github.com/dunajevs)!

- `data-sort-alt` in `tbody` > `td` allows for alternative sorting while holding **shift** or **alt**. Thanks [wodny](https://github.com/wodny)!

- `data-sort-col` in `thead` > `th` allows you to set which column should be sorted, in case you are using colspans, for instance. Thanks [Nick Kocharhook](https://github.com/nk9)!

- Elements inside `th` now works. Thanks [mxve](https://github.com/mxve)!

## Demo

You can find a simple demo on <https://tofsjonas.github.io/sortable/>

## An example

```html
<table class="sortable">
  <thead>
    <tr>
      <th><span>Role</span></th>
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
<link href="https://tofsjonas.github.io/sortable/sortable.css" rel="stylesheet" />
<script src="https://tofsjonas.github.io/sortable/sortable.js"></script>
```

(The `span` is just there to prove that elements inside `th` works)

### Non-sortable field

#### ...using `class` and `css`

If you wish to disable sorting for a specific field, the easiest way is to add a class to it, like so:

```html
<tr>
  <th class="no-sort">Role</th>
  <th>Name</th>
</tr>
```

and then use css to block clicks. like so:

```css
.sortable th.no-sort {
  pointer-events: none;
}
```

#### ...using css only

This is a bit trickier, but it doesn't require any changes to the html, so I guess it could be worth it in some cases.

```css
/* the first column in every sortable table should not be sortable*/
.sortable th:nth-child(1) {
  pointer-events: none;
}

/* the seventh column in the second .sortable table should not be sortable*/
.sortable:nth-of-type(2) th:nth-child(7) {
  pointer-events: none;
}
```

## `td` > `data-sort`

Using the `data-sort` attribute in `tbody` > `td` you can have one visible value and one sortable value.
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

## `td` > `data-sort-alt`

If you click on a table header while holding **shift** or **alt** an alternative
`data-sort-alt` attribute will override `data-sort`.

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
      <td>Something</td>
      <td data-sort-alt="c" data-sort="a">A</td>
      <td data-sort-alt="b" data-sort="c">B</td>
      <td data-sort-alt="a" data-sort="b">C</td>
    </tr>
    <tr>
      <td>Something else</td>
      <td data-sort-alt="e" data-sort="f">D</td>
      <td data-sort-alt="f" data-sort="e">E</td>
      <td data-sort-alt="d" data-sort="d">F</td>
    </tr>
  </tbody>
</table>
```

## `th` > `data-sort-col`

Using the `data-sort-col` attribute in `thead` > `th`, you can sort on a different column than the one that was clicked. For instance if you want to have colspans. Like so:

```html
<thead>
  <tr>
    <th></th>
    <th>Category</th>
    <th class="show_name">Show</th>
    <th colspan="2">Overall</th>
    <th colspan="2" data-sort-col="5">On Our Dates</th>
    <th data-sort-col="7">First Sold Out</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tags">&nbsp;</td>
    <td class="category">Comedy</td>
    <td class="show_name">Show 1</td>
    <td class="ratio all" data-sort="72">18/25</td>
    <td class="pct all">72%</td>
    <td class="ratio ours" data-sort="75">3/4</td>
    <td class="pct ours">75%</td>
    <td>2022-07-30</td>
  </tr>
  ...
</tbody>
```

## Ascending sort

By adding `asc` to `table`, the default sorting direction will be **ascending** instead of descending

```html
<table class="sortable asc">
  <thead>
    ...
  </thead>
  <tbody>
    ...
  </tbody>
</table>
```

## Sort on load

If you wish to sort a table on load, I would recommend doing something like this:

```html
<table class="sortable">
  <thead>
    <tr>
      <th>Movie Name</th>
      <th id="movie-size">Size</th>
      <th>Release date</th>
    </tr>
  </thead>
  <tbody>
    ...
  </tbody>
</table>

<script>
  window.addEventListener('load', function () {
    const el = document.getElementById('movie-size')
    // without id:
    // const el = document.querySelector('.sortable th:first-child')
    // const el = document.querySelector('.sortable th:nth-child(2)')
    // const el = document.querySelectorAll('.sortable')[3].querySelector('th:nth-child(7)')
    // etc.
    if (el) {
      el.click()
    }
  })
</script>
```

Combine this with `<table class="sortable asc">` to reverse the sort order. Or do `el.click()` twice! Thanks [Christian Petersson](https://github.com/Issen007) and [Abit Salihu](https://github.com/abitsalihu)!
