# Accessing state and actions

Every route in a Helix application will receive state, previous state and actions:

```javascript
const routes = {
  '/posts' (state, previous, actions) {
    return html`<h1>Posts</h1>`
  }
}
```

Our route is a pure function of state. It's encouraged to bind user interactions such as button clicks and form fields to callbacks back up to our model's actions, which in turn, rerender the page. State down, actions up.

```javascript
const routes = {
  '/posts' (state, previous, actions) {
    return html`
      <div>
        <h1>Posts</h1>
        ${state.posts.posts.map(post => html`<p>${post}</p>`)}
        <button onclick=${actions.posts.fetch}>Load Posts</button>
      </div>
    `
  }
}
```

Since routes are pure functions, they can be tested independently from the rest of the application easily by injecting a mocked `state`, `previous` and `actions`.

### Typescript

We can get full type safety for `state`, `previous` and `actions` by adding a simple type definition to our routes:

```typescript
import { GlobalState, GlobalActions } from './models'

const routes: Helix.Routes<GlobalState, GlobalActions> = {
  '/posts' (state, previous, actions) {
    return html`
      <div>
        <h1>Posts</h1>
        ${state.posts.posts.map(post => html`<p>${post}</p>`)}
        <button onclick=${actions.posts.fetch}>Load Posts</button>
      </div>
    `
  }
}
```

`Helix.Routes<GlobalState, GlobalActions>` is a shortcut for adding types to each of the routes individually. It's common to split pages out in to separate files, so you can use the `Helix.Component<GlobalState, GlobalActions>` type instead:

```typescript
import { GlobalState, GlobalActions } from './models'

const posts: Helix.Component<GlobalState, GlobalActions> = (state, previous, actions) => {
  return html`
    <div>
      <h1>Posts</h1>
      ${state.posts.posts.map(post => html`<p>${post}</p>`)}
      <button onclick=${actions.posts.fetch}>Load Posts</button>
    </div>
  `
}

const routes: Helix.Routes<GlobalState, GlobalActions> = {
  '/posts': posts
}
```