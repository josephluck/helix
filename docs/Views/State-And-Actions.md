# Accessing state and actions

Every route in a Helix application will receive state, previous state and actions:

```javascript
const routes = {
  '/posts' (state, prev, actions) {
    return html`<p>Posts</p>`
  }
}
```

As you can see, our route is a pure function of state. Later we'll be binding user interactions such as button clicks and form fields to callbacks back up to our model's actions, which in turn, rerender the page.

Since routes are pure functions, they can be tested independently from the rest of the application easily.
