# Rendering to DOM

Here's an example of using vanilla DOM methods as a render target for a simple application:

```javascript
// renderer.js
export default function renderer(dom) {
  return function(node, state, prev, actions) {
    if (node) {
      dom.innerHTML = node(state, prev, actions)
    }
  }
}
```

```javascript
// app.js
import helix from 'helix-js'
import renderer from './renderer'

const mount = document.createElement('div')
document.body.appendChild(mount)

helix({
  model: {
    state: { title: 'Learn Helix' },
    reducers: {
      setTitle: (state, title) => ({ title })
    }
  },
  component: (state, previous, actions) => `
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