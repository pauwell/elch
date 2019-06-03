# elch

## Features

:fire: Simple

:fire: Small (~15kb)

:fire: Independent

## Setup

`git clone https://github.com/pauwell/elch.git`

- `npm install`
- `npm run build`

## Example

```js
const myTemplate = new Elch({
  name: 'counter-example',
  state: { count: 0 },
  logic: {
    incrementCount() {
      this.count += 1;
    }
  },
  view: () =>
    `<div class="counter-app">
        <h1>Counter</h1>
        <p>Current value: {{count}}</p>
        <button do-event="click:incrementCount">Click</button>
    </div>`
});

myTemplate.mountTo(document.getElementById('app'));
```

### `If`-conditions

```html
<do if="this.state.count > 10">
  <p>Visible if count is greater than ten.</p>
</do>
```

### `For`-loops

```html
<do for="let i=0; i<this.state.count; ++i">
  <p>{{ $i }}</p>
</do>
```

### `Event`-attributes

```html
<button do-event="click:incrementCount">Click</button>
```
