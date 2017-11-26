# Layouts

In our blog, we want to show an alert when the user views the create post page if the user isn't logged in, however, we haven't included the alert component in both pages, so as it stands, alerts can only be shown when the user is visiting the login page.

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