# Rendering

Helix support multiple render targets through the `renderer` property. Typically, Helix is rendered with React and it's super simple:

```javascript
import helix from 'helix-js'
import * as dom from 'react-dom'

const state = {
  title: 'Learn Helix'
}

const reducers = {
  setTitle (state, title) {
    return {
      title
    }
  }
}

const component = (state, previous, actions) => (
  <div>
    <p>${state.title}</p>
    <input
      value={state.title}
      onInput={e => actions.setTitle(e.target.value)}
    />
  </div>
)


const mount = document.createElement('div')
document.body.appendChild(mount)

function renderer (elm) {
  return function (node, state, previous, actions) {
    if (node) {
      dom.render(node(state, previous, actions), elm)
    }
  }
}

helix({
  model: {
    state,
    reducers
  },
  component,
  render: renderer(mount),
})
```

Once Helix is mounted in the DOM, it'll take care of rerendering on state and URL changes.

It's entirely possible to have more than one Helix app on the page at one time, by passing different `mount` nodes to the renderer for each app.

### Other Render Targets

Helix can be paired with any UI framework that manipulates the DOM. It's even possible to use Helix with vanilla DOM:

```javascript
import helix from 'helix-js'

helix({
  model: {
    state: {
      title: 'render using React or something, you crazy fool...'
    }
  },
  component(state, previous, actions) {
    const myElm = document.createElement('div')
    myElm.innerHTML = `Hey, you should ${state.title}`
    return myElm
  },
  render (node, state, previous, actions) {
    if (node) {
      document.body.appendChild(node(state, previous, actions))
    }
  },
})
```
