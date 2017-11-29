# Layouts

In our blog, we want to show an alert when the user views the create post page if the user isn't logged in, however, we might forget to include the alert component in both pages, particularly if we make a new page many months down-the-line.

To solve this, we can leverage the higher-order function pattern to provide these common components to both pages without repeating ourselves.

```javascript
function layout(child) {
  return {
    onEnter(state, prev, actions) {
      if (child.onEnter) {
        child.onEnter(state, prev, actions)
      }
    },
    view(state, prev, actions) {
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
    onEnter(state, prev, actions) {
      if (!state.user.user) {
        actions.alert.showError('You must be logged in to create a post')
        actions.location.set('/login')
      }
    },
    view(state, prev, actions) {
      return html`<h1>New Post</h1>`
    },
  }),
  '/login': layout({
    view(state, prev, actions) {
      return html`<h1>Login</h1>`
    }
  })
}
```

So we've wrapped both the login and new post pages with a layout that provides the alert component so that alerts can be shown in all of our pages without repetition or inconsistency.