# Accessing state and actions

Every route in a Helix application will receive state, previous state and actions:

```javascript
const routes = {
  '/posts' (state, prev, actions) {
    return html`<h1>Posts</h1>`
  }
}
```

As you can see, our route is a pure function of state. It's encouraged to bind user interactions such as button clicks and form fields to callbacks back up to our model's actions, which in turn, rerender the page.

```javascript
const routes = {
  '/posts' (state, prev, actions) {
    return html`
      <div>
        <h1>Posts</h1>
        ${state.posts.map(post => html`<p>${post}</p>`)}
        <button onclick=${actions.posts.fetch}>Load Posts</button>
      </div>
    `
  }
}
```

Since routes are pure functions, they can be tested independently from the rest of the application easily by injecting a mocked state, prev and actions.
