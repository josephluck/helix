# Nesting

So far, we've made a simple model that can fetch posts from an API and set the posts in state. However, as we build out our application, we'll be creating many models that serve different purposes, for example, there'll be a model to control the authentication and user logic and another model to allow the user to create a new post. If we limited ourselves to one model to do all of these things, we'd struggle to keep track of everything.

To solve this scaling problem, Helix models support "Nesting" models [inside one another](https://media.giphy.com/media/X8HbeXDF7nzaM/giphy.gif).

```javascript
// Top Level Application Model
{
  state: {},
  models: {
    posts: postsModel,
    newPost: newPostModel,
    user: userModel,
    alert: alertModel
  }
}
```

We've changed our application model to include a `models` key where we have "nested" our posts model alongside some others. We need to change our posts model to use the new nesting:

```javascript
function posts(api) {
  return {
    state: {
      posts: []
    },
    reducers: {
      resetState () {
        return { posts: [] }
      },
      receivePosts(state, posts) {
        return { posts }
      }
    },
    effects: {
      async requestPosts(state, actions) {
        const posts = await api.fetchPosts()
        actions.posts.receivePosts(posts)
      }
    }
  }
}
```

If you have a keen eye, you'll notice the only difference is where we call `receivePosts` in the effect. We need to reach further into actions as we've namespaced the "Posts" model under a `posts` key. Similarly, our state will be namespaced, so if we want to use posts from state, we need to access them under `state.posts.posts`. Essentially, state and actions for nested models get merged together under the key provided in `models`.

There's no limit to how much nesting you can do with Helix, and when pairing with Typescript, you can get full type safety.

### Effects

When we scale our application to include other models, we can use effects to our advantage. Unlike reducers, effects are considered global, and they are able to use the state and actions from all over our application, much like pages can.

```javascript
function posts(api) {
  return {
    state: {
      posts: []
    },
    reducers: {
      resetState () {
        return { posts: [] }
      },
      receivePosts(state, posts) {
        return { posts }
      }
    },
    effects: {
      async requestPosts(state, actions) {
        const posts = await api.fetchPosts()
        actions.posts.receivePosts(posts)
        actions.alert.showSuccess('Posts Loaded')
        return 'All done'
      }
    }
  }
}
```

You'll notice that when we `requestPosts`, we can show an alert to the user to let them know that the posts have loaded, we're reaching in to other models.
