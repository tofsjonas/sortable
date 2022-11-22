# sortable - a tiny, vanilla JS table sorter

Makes any table with **class="sortable"**, er, sortable. That is the user can click on a table header and change the sorting of the table rows.

Just include the JavaScript and it will work. No function calls needed, all is done with an **eventListener**.
(the CSS is not strictly needed, but makes it ~pretty and user friendly)

- [sortable - a tiny, vanilla JS table sorter](#sortable---a-tiny-vanilla-js-table-sorter)
  - [Factoids](#factoids)
    - [...with a little help from my friends](#with-a-little-help-from-my-friends)
  - [Demo](#demo)
  - [A basic example](#a-basic-example)
  - [Non-sortable field](#non-sortable-field)
    - [...using `class` and `css`](#using-class-and-css)
    - [...using `css` only](#using-css-only)
  - [Indicators/arrows on the left side](#indicatorsarrows-on-the-left-side)
  - [Note about css/scss](#note-about-cssscss)
  - [Sort on value other than the one shown](#sort-on-value-other-than-the-one-shown)
  - [Alternative sorting](#alternative-sorting)
  - [Specify which column should be sorted](#specify-which-column-should-be-sorted)
  - [Ascending sort](#ascending-sort)
  - [Sort on load](#sort-on-load)

## Factoids

- **921 bytes** minified. (541 bytes gzipped)

- Works with **JavaScript generated tables**. (since we are using an eventListener)

- **Lightning fast**. _Huge_ tables will make it slow and may freeze the browser, especially for mobiles, so you know...

- Requires **thead** and **tbody**.

- **cross browser**, ie9+ (I think, there have been a _whole_ bunch of changes since I last tested it on ie9 🤷)

- ~~eventListeners attached to the rows _WILL_ be removed~~

- eventListeners are no longer removed! 😊

- NOT tested with React, Angular, Vue, etc.

- Works with [Svelte](https://svelte.dev/)!

### ...with a little help from my friends

- `table` > `class="sortable asc"` let's you [sort ascending](#ascending-sort) as default. Thanks [
  Nikita Dunajevs](https://github.com/dunajevs)!

- `data-sort-alt` in `tbody` > `td` allows for [alternative sorting](#alternative-sorting) while holding `shift` or `alt`. Thanks [wodny](https://github.com/wodny)!

- `data-sort-col` in `thead` > `th` allows you to [specify which column should be sorted](#specify-which-column-should-be-sorted), in case you are using `colspan`, for instance. Thanks [Nick Kocharhook](https://github.com/nk9)!

- **Nested elements** inside `th` now works. Thanks [mxve](https://github.com/mxve)!

- [Sort on load](#sort-on-load) example. Thanks [Christian Petersson](https://github.com/Issen007) and [Abit Salihu](https://github.com/abitsalihu)!

- Thanks to [chatcoda](https://github.com/chatcoda) for the `<td></td>` / `<td>0</td>` sorting bug fix!

## Demo

You can find a simple demo on <https://tofsjonas.github.io/sortable/>

## A basic example

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
<link href="https://cdn.jsdelivr.net/gh/tofsjonas/sortable/sortable.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/gh/tofsjonas/sortable/sortable.min.js"></script>
```

_(The `span` is just there to prove that elements inside `th` works)_

## Non-sortable field

### ...using `class` and `css`

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

### ...using `css` only

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

## Indicators/arrows on the left side

If you have text that is aligned on the right side, you may want to have the arrows on the left side.

This is solved by adding a class to the css and using `::before` instead of `::after`.

(You can of course use a pure css solution, without class names - just like with the [non-sortable field](#non-sortable-field) - but _that_ I will leave for you to figure out.)

```css
.sortable th.indicator-left::after {
  content: '';
}
.sortable th.indicator-left::before {
  margin-right: 3px;
  content: '▸';
}
/* etc. */
```

> _Full example: [CSS](https://github.com/tofsjonas/sortable/blob/main/sortable-base.css), [SCSS](https://github.com/tofsjonas/sortable/blob/main/sortable-base.scss)_

## Note about css/scss

The `css/scss` in this repo was only ever meant as an example. It was never intended to be actually _used_.

That said, if you're feeling lazy, here are two stylesheets you can use:

```html
<!-- This will add arrows only -->
<link href="https://cdn.jsdelivr.net/gh/tofsjonas/sortable/sortable-base.min.css" rel="stylesheet" />

<!-- This will make it look like the tables in the example, with arrows, striped rows etc. -->
<link href="https://cdn.jsdelivr.net/gh/tofsjonas/sortable/sortable.min.css" rel="stylesheet" />
```

## Sort on value other than the one shown

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

## Alternative sorting

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

## Specify which column should be sorted

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

Combine this with `<table class="sortable asc">` to reverse the sort order. Or do `el.click()` twice!

[![jsdelivr](https://data.jsdelivr.com/v1/package/gh/tofsjonas/sortable/badge)](https://www.jsdelivr.com/package/gh/tofsjonas/sortable)
