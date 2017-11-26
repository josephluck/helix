# Rendering to Yo Yo

Here's an example of using Yo Yo as a render target for a simple application:

```javascript
// renderer.js
import * as html from 'yo-yo'

export default function renderer(dom) {
  let _dom = dom
  return function(node, state, prev, actions) {
    if (node) {
      _dom = html.update(_dom, node(state, prev, actions))
    }
  }
}
```

```javascript
// app.js
import helix from 'helix-js'
import renderer from './renderer'
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
        onInput=${e => actions.setTitle(e.target.value)}
      />
    </div>
  `,
  render: renderer(mount),
})
```