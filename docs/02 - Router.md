# Router

Helix uses a router that listens to changes in the browsers URL. Whenever the URL changes, Helix will lookup the corresponding route and, if found, will call the renderer with the return of the matching route. You can register routes in a Helix app using the following syntax:

It's worth noting that this section only applies to Helix apps that use the `routes` option. If you're using Helix for a component, use the `component` option in the Helix configuration, so that anchor tags do not get intercepted by Helix.

```javascript
helix({
  routes: {
    '/blog' (state, previousState, actions) {
      return html`<p>Blog</p>`
    },
    '/blog/all-about-helix' (state, previousState, actions) {
      return html`<p>Learn all about Helix</p>`
    },
    '/blog/:postId' (state, previousState, actions) {
      const { postId } = state.location.params
      return html`<p>The current postId is ${postId}</p>`
    }
  }
})
```

### Route parameters

A parameterised route is typical of a single page app that allows a developer to create a pattern for a route. In our blog example, we might want our users to be able to click on a blog post to open it in a new page. The URL may be `/blog/123`, where `123` corresponds to the `/:postId/` parameter portion in the router above.

Helix will place any route parameters in state under `state.location.params` for use in views and effects. The `params` object is keyed according to the name of the parameter, i.e:

```javascript
// From anywhere with access to global state
console.log(state.location.params)
// {
//   postId: '123'
// }
```

### Query Parameters

There's no need to define query parameters in the route definition. Instead, when a query parameter is detected in the URL, Helix will parse the query string and provide it in state. For example, `/blog?order=asc&page=1` results in the following:

```javascript
// From anywhere with access to global state
console.log(state.location.query)
// {
//   order: 'asc',
//   page: '1'
// }
```

### Standard Navigation

Any clicks on anchor tags that have a `href` property will be captured. For example `<a href='/blog/123'>View Post</a>`.

### Programatic Navigation

Sometimes, there's a need to programatically navigate as a result of some user interaction, for example after a user successfully logs in to an authenticated application.

To do this, Helix comes with a `location` model (more on models later) which contains a `set` effect that triggers a route transition. The `set` effect is available in `actions` which is passed to all views and all effects.

```javascript
helix({
  routes: {
    'blog' (state, previous, actions) {
      console.log(state, previous, actions)
    },
    'blog/all-about-helix' (state, previous, actions) {
      console.log(state, previous, actions)
    },
    'blog/:postId' (state, previous, actions) {
      console.log(state.location.params.postId)
      console.log(state, previous, actions)
    },
    '/' (state, previous, actions) {
      actions.location.set('/blog')
    }
  }
})
```

In the above example, any time the user goes to the home page, they will be instantly redirected to the `/blog` page. We'll come back to `effects` when we discuss state.

### 404 / Not Found Handling

You'll want to show a funny cat picture when the user clicks on a page that doesn't exist. Any time a user navigates to a page that does not match any routes defined in the router, Helix will use the not found route.

```javascript
helix({
  routes: {
    'blog' (state, previous, actions) {
      console.log(state, previous, actions)
    },
    notFound (state, previous, actions) {
      return 'cat-stuck-in-a-sock.gif'
    }
  }
})
```

### Lifecycle Events

Often, a single page app will need to load some data when a user hits a page. A blog site wouldn't be very useful if it didn't list any blog posts...

Helix's router comes with lifecycle events that makes it easy to trigger actions when a user either enters a page or leaves a page:

```javascript
helix({
  routes: {
    'blog': {
      onEnter (state, previous, actions) {
        // Called when the user enters the blog page from the post page
        actions.blog.fetchAll()
      },
      onLeave (state, previous, actions) {
        // Called when the user leaves the blog to the post page
        actions.blog.clear()
      },
      view (state, previous, actions) {
        return html`<p>Blog</p>`
      },
    },
    'blog/:postId': {
      onEnter (state, previous, actions) {
        // Called when the user enters the post page from the blog page
        actions.blog.fetchPost(state.location.params.postId)
      },
      onChange (state, previous, actions) {
        // Called when the user navigates between posts,
        // for example `/blog/1` => `/blog/2`
        actions.blog.fetchPost(state.location.params.postId)
      },
      onLeave (state, previous, actions) {
        // Called when the user leaves the post to the blog page
        actions.blog.clear()
      },
      view (state, previous, actions) {
        return html`<p>Post ${state.location.params.postId}</p>`
      },
    },
  }
})
```

The order of execution of lifecycle methods is important. When a user navigates between two different pages:

1. `onLeave` of the current page is called
2. `onEnter` of the new page is called

If the user navigates to the same page, for example, if the post page has a link to related posts at the bottom, the page has not changed, but the `postId` URL parameter will have, so the `onChange` lifecycle is called instead of `onEnter` and `onLeave`.
