# Scaling Models

So far, we've made a simple model that can [fetch posts](./Effects.md) from an API and [set posts](./Reducers.md) in [state](./State.md). However, as we build out our application, we'll be creating many models that serve different purposes. For example, a model to control the authentication and user logic and another model to allow the user to create a new post. If we limited ourselves to one model to do all of these things, we'd struggle to keep track of everything.

To solve this scaling problem, Helix models support "Nesting" models.

```typescript
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

The `models` key is used to "nest" our posts model alongside some other models in our application. Let's change our posts model to use the new nesting:

```typescript
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

export function model(api): Helix.Model<State, Reducers, Effects> {
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

If you have a keen eye, you'll notice the only difference between the nested model and the model we made [earlier](./Effects.md) is where we call the `receivePosts` reducer in the `fetch` effect. We need to reach further into actions as we've namespaced the "Posts" model under a `posts` key. Similarly, the "Posts" state will be namespaced, so if we want access posts, we need to reach into `state.posts.posts`. Essentially, `state` and `actions` for nested models get merged together under the key provided in the parent model's `models`.

When we break our application up in to many smaller models, we can use effects to our advantage. Unless a model is [scoped](./Reusing-Model-Logic.md), effects are able to use the state and actions from all over our application, and we've demonstrated this by reaching in to another model, alert, to show a success message when the posts have finished loading.

There's no limit to how much nesting you can do with Helix, and you can achieve 100% type safety.
