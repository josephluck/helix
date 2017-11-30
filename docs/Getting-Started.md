# Getting Started

You can grab Helix and all the official renderers from NPM:

```bash
npm install helix-js
```

### Configuration

Helix provides a function to create a new application that come in two flavours:

#### With Routing

Typical for large single-page-applications, the `routes` option instructs Helix to take care of routing for you.

```javascript
helix({
  model: model,
  routes: routes,
  renderer: renderer(document.getElementById('root'))
})
```

* [Models](./Models/README.md)
* [Routes](./Views/Routes.md)
* [Renderer](./Rendering/README.md)

#### Without Routing

Typical for adding interactivity to static websites, or using Helix in existing applications, the `component` option instructs Helix to ignore the URL and re-render the component on state changes.

```javascript
helix({
  model: model,
  component: component,
  renderer: renderer(document.getElementById('root'))
})
```

* [Models](./Models/README.md)
* [Component](./Views/Component.md)
* [Renderer](./Rendering/README.md)

### Example

Here's a simple example of an app with Helix + Yo-yo

```javascript
// app.js
import helix from 'helix-js'
import renderer from 'helix-js/renderers/yo-yo'
import html from 'yo-yo'

const mount = document.createElement('div')
document.body.appendChild(mount)

helix({
  model: {
    state: { title: 'Learn Helix' },
    reducers: {
      setTitle: (state, title) => ({ title })
    }
  },
  component: (state, previous, actions) => html`
    <div>
      <p>${state.title}</p>
      <input
        value=${state.title}
        oninput=${e => actions.setTitle(e.target.value)}
      />
    </div>
  `,
  render: renderer(mount),
})
```

And another with Typescript + React

```typescript
import * as React from 'react'
import helix, { Helix } from '../../../src' // 'helix-js'
import renderer from '../../../src/renderers/react' // 'helix-js/renderers/react'

interface State {
  count: number
}

interface Reducers {
  increment: Helix.Reducer0<State>
  decrement: Helix.Reducer0<State>
}

interface Effects {}

type Actions = Helix.Actions<Reducers, Effects>

const model: Helix.Model<State, Reducers, Effects> = {
  state: {
    count: 0,
  },
  reducers: {
    increment(state) {
      return { count: state.count + 1 }
    },
    decrement(state) {
      return { count: state.count - 1 }
    },
  },
  effects: {},
}

const component: Helix.Component<State, Actions> = (state, previous, actions) => {
  return (
    <div>
      <h1>Counter</h1>
      <button onClick={actions.decrement}>Decrement</button>
      <span>{state.count}</span>
      <button onClick={actions.increment}>Increment</button>
    </div>
  )
}

const mount = document.createElement('div')
document.body.appendChild(mount)

helix<State, Actions>({
  model,
  component,
  render: renderer(mount),
})
```