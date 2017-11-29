# Component

It's possible to use Helix in "Component" mode, which allows Helix to be used in existing applications or websites. For example, if you want to add a little bit of interactivity to an otherwise static website, or you have a web application that you want to migrate to use Helix, the "Component" usage is for you.

Simply replace `routes` with `component` and you're good to go.

```javascript
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
