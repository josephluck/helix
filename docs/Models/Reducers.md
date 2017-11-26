# Reducers

The only way to update a model's state in Helix is through a reducer. A reducer is a pure function that receives the current state of the model, any arguments passed in from the caller of the reducer and is expected to return a copy of the models state with the change applied. In our blog application, we'll need a way to receive posts from the server and set them in state, so that when we can display them in the page. We'll create a `resetState` reducer as well, so that when the user leaves the "Posts" page we can clear out the state and keep it fresh for next time.

```javascript
const model = {
  reducers: {
    resetState() {
      return { posts: [] }
    },
    receivePosts(state, posts) {
      return { posts }
    },
  }
}
```

Sometimes it's useful to know what the updated state is from the call-site. Since a reducer returns the state of the model, whoever calls a reducer will receive updated copy, for example:

```javascript
const state = actions.receivePosts(['Helix is awesome'])
console.log(state) // { posts: ['Helix is awesome'] }
```