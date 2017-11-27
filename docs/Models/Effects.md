# Effects

Effects allow us to orchestrate complex control flows in our application. Normally, effects are used for things like fetching data from an external service, submitting forms, error checking or anything that involves side-effects. Let's create an asynchronous effect that fetches posts from the API and calls the reducer we made [earlier](./Reducers.md).

```javascript
const effects = {
  async fetch(state, actions) {
    const posts = await api.fetchPosts()
    actions.receivePosts(posts)
  }
}
```

You may have noticed that this effect is not referentially transparent, as in, you cannot be certain that every time you call it, you'll receive the same result, which makes testing particularly difficult. It would be useful if we could make this effect more reliable by injecting the API function.

Since models in Helix are simple Javascript objects, we are able to take advantage of functions to make our effect more reliable during testing. Let's turn our object in to a function: 

```javascript
function model(api) {
  return {
    effects: {
      async fetch(state, actions) {
        const posts = await api.fetchPosts()
        actions.receivePosts(posts)
      }
    }
  }
}
```

We've achived a kind of dependency injection through function arguments. We're able to mock out the API during testing so that we can perform assertions without having to worry about the impurity of the production API.

### Returns

Effects don't need to return anything by design (as in, the return of an effect is never used internally by Helix), however, should you return anything from an effect, the callee will receive it. For example:

```javascript
const message = await actions.fetch()
console.log(message) // 'All done'
```

### Typescript

To be sure that when we call `actions.fetch` that we are passing the correct arguments, let's add some types to our effects:

```typescript
interface Effects {
  fetch: Helix.Effect0<State, Actions>
}

type Actions = Helix.Actions<Reducers, Effects>
```

You'll notice that we've made a type for `Actions` that is a combination of `Reducers` and `Effects`. The `Actions` type gets passed to our `fetch` effect type, so that Typescript knows what actions are available.

That's all there is to making models typesafe in Helix. We'll reuse `State` and `Actions` in our pages to add type safety to all of our views.

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

interface Effects {
  fetch: Helix.Effect0<State, Actions>
}

type Actions = Helix.Actions<Reducers, Effects>

function model (api): Helix.Model<State, Reducers, Effects> {
  return {
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
    },
    effects: {
      async fetch(state, actions) {
        const posts = await api.fetchPosts()
        actions.receivePosts(posts)
      }
    }
  }
}
```
