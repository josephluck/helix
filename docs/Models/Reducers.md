# Reducers

The only way to update a model's state in Helix is through a reducer. A reducer is a pure function that receives the current state of the model, any arguments passed in from the caller of the reducer and is expected to return a copy of the models state with the change applied. In our blog application, we'll need a way to receive posts from the server and set them in state, so that when we can display them in the page. We'll create a `resetState` reducer as well, so that when the user leaves the "Posts" page we can clear out the state and keep it fresh for next time.

```javascript
const reducers = {
  resetState() {
    return { posts: [] }
  },
  receivePosts(state, posts) {
    return { posts }
  }
}
```

Sometimes it's useful to know what the updated state is from the call-site. Since a reducer returns the state of the model, whoever calls a reducer will receive an updated copy of the model's state, for example:

```javascript
const state = actions.receivePosts(['Learn Helix', 'Profit'])
console.log(state) // { posts: ['Learn Helix', 'Profit'] }
```

### Typescript

To be sure that when we call `actions.receivePosts`, we are passing the correct arguments, let's add some types to our reducers:

```typescript
interface Reducers {
  resetState: Helix.Reducer0<State>
  receivePosts: Helix.Reducer<State, string[]>
}
```

The type definition for `resetState` is a `Helix.Reducer0`, this is simply a reducer that takea 0 arguments. Similarly, the standard `Helix.Reducer` is a reducer that takes one argument.

### The model so far

Let's recap what we've got:

```typescript
interface State {
  posts: string[]
}

interface Reducers {
  resetState: Helix.Reducer0<State>
  receivePosts: Helix.Reducer<State, string[]>
}

const model: Helix.Model<State, Reducers, Effects> = {
  state: {
    posts: ['Learn Helix']
  },
  reducers: {
    resetState () {
      return { posts: [] }
    },
    receivePosts(state, posts) {
      return { posts }
    }
  }
}
```
