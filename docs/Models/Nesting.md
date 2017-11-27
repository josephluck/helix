# Nesting

So far, we've made a simple model that can fetch posts from an API and set the posts in state. However, as we build out our application, we'll be creating many models that serve different purposes, for example, there'll be a model to control the authentication and user logic and another model to allow the user to create a new post. If we limited ourselves to one model to do all of these things, we'd struggle to keep track of everything.

To solve this scaling problem, Helix models support "Nesting" models like [russian dolls](https://media.giphy.com/media/X8HbeXDF7nzaM/giphy.gif).

```javascript
// Top Level Application Model
{
  state: {},
  models: {
    posts: posts(api),
    newPost: newPost(api),
    user: user(api),
    alert: alert()
  }
}
```

We've changed our application model be state-less with a `models` key where we have "nested" our posts model alongside some other models in our application. We need to change our posts model to use the new nesting:

```javascript
function posts(api) {
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
        actions.posts.receivePosts(posts)
        return 'All done'
      }
    }
  }
}
```

If you have a keen eye, you'll notice the only difference is where we call `receivePosts` in the effect. We need to reach further into actions as we've namespaced the "Posts" model under a `posts` key. Similarly, our state will be namespaced, so if we want to use posts from state, we need to access them under `state.posts.posts`. Essentially, state and actions for nested models get merged together under the key provided in `models`.

There's no limit to how much nesting you can do with Helix, and you still get 100% type safety.

### Effects

When we break our application up in to many smaller models, we can use effects to our advantage. Unless a model is [scoped](./Scoping.md), effects are able to use the state and actions from all over our application:

```javascript
function posts(api) {
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
        actions.posts.receivePosts(posts)
        actions.alert.showSuccess('Posts Loaded')
        return 'All done'
      }
    }
  }
}
```

You'll notice that when we `fetch`, we're reaching in to other models to show an alert to the user to let them know that the posts have finished loading. Let's update our Typescript typings to deal with the new nesting.

### Typescript

Let's make a type definition for our application-level `GlobalState` and `GlobalActions`. These new types will be used to tell Typescript what our application-level state and actions look like for pages and effects.

```typescript
// model.ts
import * as Posts from './posts'
import * as NewPost from './new-post'
import * as User from './user'
import * as Alert from './alert'

export type Models = Helix.Models<{
  alert: Helix.ModelApi<Alert.State, Alert.Actions>
  newPost: Helix.ModelApi<NewPost.State, NewPost.Actions>
  posts: Helix.ModelApi<Posts.State, Posts.Actions>
  user: Helix.ModelApi<User.State, User.Actions>
}>

export type GlobalState = Helix.HelixState<Models['state']>
export type GlobalActions = Helix.HelixActions<Models['actions']>

const model = {
  state: {},
  models: {
    alert: Alert.model(),
    newPost: NewPost.model(api),
    posts: Posts.model(api),
    user: User.model(api)
  }
}
```

We'll make use of `GlobalState` and `GlobalActions` in our `Effect` types so that Typescript knows which state and actions are available in our `fetch` effect.

```typescript
// posts.ts
import { GlobalState, GlobalActions } from './model'

export interface State {
  posts: string[]
}

interface Reducers {
  resetState: Helix.Reducer0<State>
  receivePosts: Helix.Reducer<State, string[]>
}

interface Effects {
  fetch: Helix.Effect0<GlobalState, GlobalActions, Promise<string>>
}

export type Actions = Helix.Actions<Reducers, Effects>

export default function model(api): Helix.Model<State, Reducers, Effects> {
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
        actions.posts.receivePosts(posts)
        return 'All done'
      }
    }
  }
}
```
