# Router

It's worth noting that this section only applies to Helix applications that use the `routes` option. If you're using Helix for a component in an existing application, use the `component` option instead.

Helix's router listens to changes in the browsers URL. Whenever the URL changes, Helix will lookup the corresponding route and, if found, will call the renderer with the return of the matching route. Routes are defined as an object, where the key is the route name and the value is the route to render:

```javascript
const routes = {
  '/' () {
    return html`<p>Home</p>`
  },
  '/login' () {
    return html`<p>Login</p>`
  },
}
```

### Accessing state and actions

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

### Route parameters

In our blog example, we might want our users to be able to click on a post to read it's contents. The URL may look something like `/blog/123`, where `123` is a route parameter that corresponds to a post's `id` in the database.

Helix will place any route parameters in state under `state.location.params`. The `params` object is keyed according to the name of the parameter, i.e:

```javascript
const routes = {
  '/posts/:postId' (state, prev, actions) {
    return html`<p>The post ID is ${state.location.params.postId}</p>`
  },
}
```

### Query Parameters

In our blog example, we may want to paginate the list of posts so that the page loads quickly when there are many posts. To improve the user experience, we'll store the state of the current page and ordering in the URL using query parameters, so that if the user refreshes the page, they see the same content on the screen. We don't need to do anything special with the route definition to take advantage of query parameters. Helix automatically places any query parameters it detects in the URL as parsed JSON.

In our blog example, `/posts?page=1&order=asc` results in the following:

```javascript
const routes = {
  '/posts' (state, prev, actions) {
    return html`<p>The page number is ${state.location.query.page} and the order is ${state.location.query.order}</p>`
  },
}
```

When the user clicks to load a new page, Helix will detect that the query parameter for `page` has changed and rerender the page. We'll want to fetch the new page from the server when this happens, and for that we'll use lifecycle hooks.

### Lifecycle hooks

Now that we've set up the routes we need we need to show blog posts when the user views the `/posts` route, and a single post when the user views the `/posts/:postId` route, assuming we have already made an action to fetch and set posts in our model, where's the best place to fetch posts? One option is that we have a button that the user must click in order to load posts: 

```javascript
const routes = {
  '/posts' (state, prev, actions) {
    return html`
      <div>
        <p>Posts</p>
        ${state.posts.posts.map(post => html`<a href="/posts/${post.id}">${post.title}</a>`)}
        <button onclick=${e => actions.posts.fetch()}>Load Posts</button>
      </div>
    `
  },
}
```

We don't really want our users to have to press a button to see the posts though. It would be better if the posts loaded as soon as the user visits the page.

So far, the routes we've been making are called "Component" style routes, which means that they are a simple pure function of state to HTML so there isn't really an opportunity to send an action when the user first visits the page, the only thing we could do is send an action every time the view is rendered, which is bad since we only want to do it the first time. There's another style of route that we can take advantage of to load posts when the user visits the page. These routes are called "Page" style routes and they come with lifecycle hooks. 

```javascript
const routes = {
  '/posts': {
    onEnter (state, prev, actions) {
      actions.posts.fetch()
    },
    onLeave (state, prev, actions) {
      actions.posts.reset()
    },
    view (state, prev, actions) {
      return html`
        <div>
          <p>Posts</p>
          ${state.posts.posts.map(post => html`<a href="/posts/${post.id}">${post.title}</a>`)}
        </div>
      `
    }
  },
}
```

The execution order of lifecycle hooks is important. When a user navigates between two different pages:

1. `onLeave` of the left page is called
2. `onEnter` of the entered page is called

If the user navigates to the same page the `onChange` lifecycle is called instead of `onEnter` and `onLeave`. For example, if the "View Post" page has a link to the next post, the page has not really changed, but the `postId` URL parameter will have. Similarly, if the user clicks to load a new page in the list of pages, the query parameter `page` will change, so the `onChange` lifecycle hook will be called instead of `onEnter` and `onLeave`.

### Standard Navigation

Helix assumes that you want to serve a single page application. What this means is that any clicks on anchor tags that have a `href` property will be captured and handled internally by Helix. For example if the user clicks `<a href='/posts/123'>View Post</a>`, Helix will prevent the standard behaviour of the browser, look up the `/posts/:postId` route and render the post page.

### Programatic Navigation

We're at the stage in our application where we can view a list of posts and view a single post. We want all users to be able to view these two pages, however, being able to create a new post should only be available for users that have logged in. If the user tries to navigate to the "Create Post" page without being logged in, we want to redirect them to the login page.

Using what we have already learned, we could place a check in the Create Post page for `state.user` and show a link to the login page if the user isn't present, but really we want to be able to redirect the user without them having to press a button.

Helix comes with a `location` model which contains a `set` effect that we'll use to achieve this.

```javascript
const routes = {
  '/posts/new': {
    onEnter (state, prev, actions) {
      if (!state.user.user) {
        actions.alert.showError('You must be logged in to create a post')
        actions.location.set('/login')
      }
    },
    view (state, prev, actions) {
      return html`<p>New Post</p>`
    },
  },
  '/login' (state, prev, actions) {
    return html`
      <div>
        <p>Login</p>
        ${alert(state.alert)}
      <div>
    `
  }
}
```

Now, if the user tries to create a post without being logged in, we show them a message and take them to the login page.

### 404 / Not Found Handling

Should the user visit a page that doesn't match a route we have defined, we'll show a "Not Found" page. 

```javascript
helix({
  routes: {
    notFound (state, previous, actions) {
      return html`<p>Nope, nothing to see here!</p>`
    }
  }
})
```

That more or less sums up all there is to know about routing and views in Helix.

### Layouts

In the example above, we want to show an alert when the user views the create post page if the user isn't logged in, however, we haven't included the alert component in both pages, so as it stands, alerts can only be shown when the user is visiting the login page.

To solve this, we can leverage the higher-order function pattern to provide these common components to both pages without repeating ourselves through a layout.

```javascript
function layout (child) {
  return {
    onEnter (state, prev, actions) {
      if (child.onEnter) {
        child.onEnter(state, prev, actions)
      }
    },
    view (state, prev, actions) {
      return html`
        <div>
          ${child.view(state, prev, actions)}
          ${alert(state.alert)}
        </div>
      `
    }
  }
}

const routes = {
  '/posts/new': layout({
    onEnter (state, prev, actions) {
      if (!state.user.user) {
        actions.alert.showError('You must be logged in to create a post')
        actions.location.set('/login')
      }
    },
    view (state, prev, actions) {
      return html`<p>New Post</p>`
    },
  }),
  '/login': layout({
    view (state, prev, actions) {
      return html`<p>Login</p>`
    }
  })
}
```

So we've wrapped both the login and new post pages with a layout that provides the alert component. Alerts can be shown in all of our pages without repitition or inconsistency.