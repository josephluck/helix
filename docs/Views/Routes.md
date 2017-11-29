# Routes

Helix's router listens to changes in the browsers URL. Whenever the URL changes, Helix will lookup the corresponding route and, if found, will call the renderer with the return of the matching route. Routes are defined as an object, where the key is the route name and the value is the route to render:

```javascript
const routes = {
  '/' () {
    return html`<h1>Home</h1>`
  },
  '/login' () {
    return html`<h1>Login</h1>`
  },
}
```

### Route parameters

In our blog application, we want our users to be able to click on a post to read it's contents. The URL may look something like `/posts/123`, where `123` is a route parameter that corresponds to a post's `id` in the database.

Helix will place any route parameters in state under `state.location.params`. The `params` object is keyed according to the name of the parameter, i.e:

```javascript
const routes = {
  '/posts/:postId' (state) {
    return html`<p>The post ID is ${state.location.params.postId}</p>`
  },
}
```

### Query Parameters

It's common for a list of posts to be paginated so that the page loads quickly. To improve the user experience, we'll store the state of the current page and ordering in the URL using query parameters, so that if the user refreshes the page, they see the same content on the screen. We don't need to do anything special with the route definition to take advantage of query parameters. Helix automatically places any query parameters it detects in the URL as parsed JSON in state.

In our blog example, `/posts?page=1&order=asc` results in the following:

```javascript
const routes = {
  '/posts' (state) {
    return html`<p>The page number is ${state.location.query.page} and the order is ${state.location.query.order}</p>`
  },
}
```

When the user clicks to load the next page, Helix will detect that the query parameter for `page` has changed and rerender the page. We'll want to fetch the new page from the server when this happens, and for that we'll use lifecycle hooks.

### 404 / Not Found Handling

Should the user visit a page that doesn't match a route we have defined, we'll show a "Not Found" page. 

```javascript
const routes = {
  notFound () {
    return html`<p>Nope, nothing to see here!</p>`
  }
}
```

### Typescript

Head over to the [models](../Models) section for an in-depth tutorial on type safety in models.

It's simple to add type safety to Helix route definitions:

```typescript
import { GlobalState, GlobalActions } from './models'

const routes: Helix.Routes<GlobalState, GlobalActions> = {
  '/' () {
    return html`<h1>Home</h1>`
  },
  '/login' () {
    return html`<h1>Login</h1>`
  },
}
```

We'll get to the significance of `GlobalState` and `GlobalActions` in the [next section](./State-And-Actions).
