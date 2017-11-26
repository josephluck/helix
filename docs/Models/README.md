# Models

Models are at the heart of Helix. Models are responsible for holding and manipulating the state of a Helix application in a safe and reliable way.

For our blog project, we'll be introducing a few key model concepts; `state`, `reducers`, and `effects` as well as some more advanced concepts such as `nested` and `scoped` models.

We'll start by making a simple model to control the posts in our blog:

```javascript
// Application Model
{
  state: {
    posts: [],
  },
  reducers: {
    resetState () {
      return { posts: [] }
    },
    receivePosts(state, posts) {
      return { posts }
    },
  },
  effects: {
    async requestPosts(state, actions) {
      const posts = await api.fetchPosts()
      actions.receivePosts(posts)
    },
  },
}
```

Let's dive in to the details.

### Basic

* [Reducers](/docs/Models/Reducers.md)
* [Effects](/docs/Models/Effects.md)

### Advanced

* [Nesting](/docs/Models/Nesting.md)
* [Scoping](/docs/Models/Scoping.md)
