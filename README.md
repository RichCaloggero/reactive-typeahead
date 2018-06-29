# reactive-typeahead

Simple, light weight typeahead widgit using Vue

## Demo

https://RichCaloggero.github.io/reactive-typeahead/typeahead.html

## Example

```
<div id="app">
<typeahead label="Choose a flavor: " multiselect
content='["chocolate", "vanilla", "strawberry", "coconut"]'>
</typeahead>

<typeahead label="Choose something: " multiselect display="`${item.value}: ${item.text}`" result="value"
content='[
{"text": "Maine", "value": "me"},
{"text": "Massachusetts", "value": "ma"},
{"text": "Minnisoda", "value": "mn"}
]'>
</typeahead>
</div>

<script src="vue.js"></script>
<script src="typeahead.js"></script>
<script>
let $ = document.querySelector.bind(document);

app = new Vue ({
el: $("#app")
});


document.addEventListener ("complete", (e) => alert (`result: ${JSON.stringify(e.detail.selectedItems())}`));
</script>
```

## HTML Attributes

- label: labels the input element
- multiselect: allows selecting more than one value
- display: (property name or expression)
	+ if property, must be a property of a suggestion list object, if expression then must resolve to a property of a list item object
	+ text of each list item is the result of evaluating `item.propertyName` or `expression` in the context of the instance (expression must use `item` to refer to each list item object)
- result: property name to use when retrieving results on complete
	+ returns a string with each value separated from the next with `", "`
- listClass: adds this class (or classes) to the suggestions list `ul` element

## JS API

```
// instantiate the components
app = new Vue ({
el: $("#app")
});

// set new content in the first `typeahead` (completely replaces any previous content)
app.$children[0].setContent ([
{value: 1, text: "one"},
{value: 2, text: "two"},
{value: 3, text: "three"}
]).setLabel ("Select a number");

// listen for completion and display a stringified representation of all selected items
// note: the detail property of the event object contains the instance that created the event which we can use to retrieve the selections for that instance
// note: event bubbles, so most likely you will want to listen for completion events on specific instances
document.addEventListener ("complete", (e) => alert (`result: ${JSON.stringify(e.detail.selectedItems())}`));

## CSS

No special CSS is included. You can style via classes and attributes as you wish:

- style all suggestions: `#app [role="option"] {...}
- style selected items: #app [aria-selected="true"] {...}
- style the suggestions list: #app [role="listbox"] {...} or use the classes you defined via `listClass` attribute
- style the text input: #app input {...}


