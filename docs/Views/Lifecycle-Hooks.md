# Lifecycle hooks

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
