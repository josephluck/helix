# Rendering to React

Here's an example of using React as a render target for a simple application:

```javascript
// renderer.js
import * as dom from 'react-dom'

export default function renderer (elm) {
  return function (node, state, previous, actions) {
    if (node) {
      dom.render(node(state, previous, actions), elm)
    }
  }
}
```

```javascript
// app.jsx
import helix from 'helix-js'
import renderer from './renderer'
import React from 'react'

const mount = document.createElement('div')
document.body.appendChild(mount)

helix({
  model: {
    state: { title: 'Learn Helix' },
    reducers: {
      setTitle: (state, title) => ({ title })
    }
  },
  component: (state, previous, actions) => (
    <div>
      <p>{state.title}</p>
      <input
        value={state.title}
        onInput={e => actions.setTitle(e.target.value)}
      />
    </div>
  ),
  render: renderer(mount),
})
```