let componentData = {
items: [],
inputMode: true,
item: {value: null, text: "", selected: false, focus: false}
};


/// unique id generation
let idGen = gen();
let id_listbox = `listbox-${idGen.next().value}`;
message (`IDs: ${id_listbox}`);

function* gen () {
let n = 1;
while (true) yield n++;
} // gen


Vue.component ("typeahead", {
props: {
label: {type: String, default: "unlabeled combobox"},
multiselect: Boolean,
content: [Array, String]
}, // props


template: `<div class="combobox">
<label>{{label}}
<input type="text" ref="input" role="combobox"
v-focus-if="inputMode"
:aria-expanded="!inputMode? 'true' : 'false'"
:aria-controls="inputMode? '' : $refs.listbox.id"
:tabIndex="inputMode? '0' : '-1'"
aria-autocomplete="list"
@input="filter ($event.target.value)"
@keydown.enter.exact="complete"
@click.exact="complete"
@keydown.up.down.exact="setListMode ($event.key === 'ArrowDown'? 'next' : 'previous')">
</label>
<div class="suggestions">
<ul v-show="!inputMode"
style="list-style-type:none"
ref="listbox" role="listbox" id="${id_listbox}"
@keydown.up.down.exact="navigateList($event.key === 'ArrowDown'? 'next' : 'previous')"
@keydown.esc.exact="setInputMode"
@keydown.enter.exact="complete">
<li 
v-for="(item, index) in items"
role="option"
:aria-selected="item.selected? 'true' : 'false'"
:tabIndex="item.focus? 0 : -1"
v-focus-if="item.focus"
:value="item.value"
@keydown.space.exact="toggle (index)"
:key="item.value">
{{item.text}}
</li></ul>
</div><!-- .suggestions -->

<div class="status off-screen" aria-live="polite" aria-atomic="true">
{{items.length}} matches.
</div><!-- .status -->

</div><!-- .combobox -->
`,

created: function () {
this.allItems = [];
message ("multiselect created");
}, // created

mounted: function () {
this.allItems = this.items.slice();
message (`typeahead mounted: ${this.items.map(x => x.text)}`);
}, // mounted

updated: function () {
message (`typeahead updated: ${this.value()}`);
}, // update

methods: {
filter: function (text) {
this.items = this.allItems.filter (item => item.text.trim().toLowerCase().startsWith(text.trim().toLowerCase()));
message (`filter (${text}) = ${this.items.map(item => item.text).join(",")}`);
this.setInputMode ();
}, // filter

complete: function () {
this.$refs.input.value = this.value();
this.setInputMode ();
this.$refs.input.dispatchEvent (new Event("complete", {bubbles: true}));
}, // complete

value: function () {
return this.items.filter (item => item.selected)
.map (item => item.text);
}, // value


setInputMode: function () {
//message ("input mode enabled");
this.unfocusAll ();
this.inputMode = true;
}, // setInputMode

setListMode: function (direction) {
if (this.items.length === 0) return;
let index = (direction === "next")? 0 : this.items.length-1;
this.unfocusAll ();
this.setFocus (index);
this.inputMode = false;
message ("list navigation enabled");
}, // setListMode

navigateList: function (direction) {
message (`navigateList: ${direction}`);
if (this.inputMode) return;
let index = this.items.findIndex (item => item.focus);
if (index === -1) return;
message (`current focus: ${index}`);
this.unfocusAll ();
index = (direction === "next")? index+1 : index-1;
if (index < 0) index = this.items.length-1;
else if (index > this.items.length-1) index = 0;
this.setFocus (index);
}, // navigateList

setFocus (index) {
message (`setFocus: ${index}`);
let _selected = this.multiselect? this.items[index].selected : true;
this.items.splice(index, 1, Object.assign({}, this.items[index], {focus: true, selected: _selected}));
}, // setFocus

toggle: function (index) {
if (this.multiselect) {
let _selected = this.items[index].selected;
this.items.splice(index, 1, Object.assign({}, this.items[index], {selected: !_selected}));
} // if
}, // toggle

unfocusAll: function () {
this.items = this.items.map (item => Object.assign({}, item, {focus: false}));
if (! this.multiselect) this.items = this.items.map (item => Object.assign({}, item, {selected: false}));
}, // unfocusAll

}, // methods

data: function () {
let content = this.content;
if (content instanceof String || typeof(content) === "string") content = JSON.parse (content);

if (content instanceof Array) content = content.map ((item, index) => {
return (
typeof(item) === "object"?
{value: typeof(item.value) === "undefined"? index : value, text: item.text}
: {value: index, text: item}
); // return
}); // map

let _data = Object.assign(
{},
componentData,
{items: content.map (item => Object.assign({}, componentData.item, item))}
); // Object.assign
message (_data.toSource());
return _data;
} // data
}); // multiselect component


Vue.directive ("focus-if", function (element, bindings) {
if (! bindings.expression) return;
if (! bindings.value) return;
if (bindings.value === bindings.oldValue) return;
element.focus ();
}); // directive focus-if



let vm = new Vue({
el: ".typeahead"
}); // root component


/// debugging
function message (text, remove) {
return;
if (! text) return;
let el = document.querySelector("#message");
if (! el) {
console.log (text);
return;
} // if

let p = document.createElement("p");
p.appendChild (document.createTextNode(text));

if (remove) el.innerHTML = `<p>${text}</p>\n`;
el.appendChild (p);
return text;
} // message

message ("Ready.");
