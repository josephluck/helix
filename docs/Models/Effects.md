# Effects

Effects allow us to orchestrate complex control flows in our application. Normally, effects are used for things like fetching data from an external service, submitting forms, error checking or anything that involves side-effects. Let's create an asynchronous effect that fetches posts from the API and calls the [reducer we made earlier](./Reducers.md).

```typescript
interface State {
  posts: string[]
}

interface Reducers {
  resetState: Helix.Reducer0<State>
  receivePosts: Helix.Reducer<State, string[]>
}

interface Effects {
  fetch: Helix.ReturnEffect0<State, Actions, Promise<string>>
}

type Actions = Helix.Actions<Reducers, Effects>

const model: Helix.Model<State, Reducers, Effects> = {
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

The `fetch` effect doesn't take any arguments, however, similar to reducers, effects are able to take a single argument if necessary.

You may have noticed that this effect is not referentially transparent, as in, you cannot be certain that every time you call it, you'll receive the same result, which makes testing particularly difficult. It would be useful if we could make this effect more reliable by injecting the API function.

Since models in Helix are simple Javascript objects, we are able to take advantage of functions to make our effect more reliable during testing. Let's turn our model object in to a function: 

```typescript
interface State {
  posts: string[]
}

interface Reducers {
  resetState: Helix.Reducer0<State>
  receivePosts: Helix.Reducer<State, string[]>
}

interface Effects {
  fetch: Helix.ReturnEffect0<State, Actions, Promise<string>>
}

type Actions = Helix.Actions<Reducers, Effects>

function model(api): Helix.Model<State, Reducers, Effects> {
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

We've achived a kind of dependency injection through function arguments; we're able to mock out the API during testing so that we can perform assertions that the API calls are being made.

### Calling Effects & Returns

Helix injects the latest applications's state and actions in to the effect body for us. This is convenient since it prevents the callee of the effect from having to pass these through.

Effects aren't required to return anything (the return of an effect is never used internally by Helix), however, should you return anything from an effect, the callee will receive it. For example:

```typescript
const message = await actions.fetch()
console.log(message) // 'All done'
```

Returning something from an effect is useful in situations where decision making is important. For example, you could use an effect to perform form validation, whose return is a boolean of whether the form is valid or not; you could use this effect to determine whether to send a request to the server. 

### Types

Let's take a brief look at what we've done with Typescript.

The `Actions` type is a combination of `Reducers` and `Effects` that passed to our `fetch` effect type, so that effect knows what actions are available.

The third generic to the `fetch` effect (`Promise<string>`) informs Typescript of what the effect returns. Normally effects do not return anything so the default value for the return generic is `void`.
