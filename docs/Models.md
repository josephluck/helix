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

Let's dive in to the details

# Reducers

The only way to update a model's state in Helix is through a reducer. A reducer is a pure function that receives the current state of the model, any arguments passed in from the caller of the reducer and is expected to return a copy of the models state with the change applied. In our blog application, we'll need a way to receive posts from the server and set them in state, so that when we can display them in the page. We'll create a `resetState` reducer as well, so that when the user leaves the "Posts" page we can clear out the state and keep it fresh for next time.

```javascript
{
  resetState() {
    return { posts: [] }
  },
  receivePosts(state, posts) {
    return { posts }
  },
}
```

Sometimes it's useful to know what the updated state is from the call-site. Since a reducer returns the state of the model, whoever calls a reducer will receive updated copy, for example:

```javascript
const state = actions.receivePosts(['Helix is awesome'])
console.log(state) // { posts: ['Helix is awesome'] }
```

### Effects

Effects allow us to orchestrate complex control flows in our application. Normally, effects are used for things like fetching data from an external service, submitting forms, error checking or anything that involves side-effects. Let's create an asynchronous effect that fetches posts from the API and calls the reducer we made in the previous section.

```javascript
{
  async requestPosts(state, actions) {
    const posts = await api.fetchPosts()
    actions.receivePosts(posts)
  }
}
```

You may have noticed that this effect is not referentially transparent, as in, you cannot assert that every time you call the effect, you'll receive the same result. This makes testing the effect particularly difficult, as it's talking to an external service. It would be good if we could make this effect more reliable by injecting the API function.

Since models in Helix are simple Javascript objects, we are able to take advantage of functions to make our effect more reliable during testing:

```javascript
export function model (api) {
  return {
    effects: {
      async requestPosts(state, actions) {
        const posts = await api.fetchPosts()
        actions.receivePosts(posts)
      }
    }
  }
}
```

We've achived a kind of dependency injection by making the model a function. We're able to mock out the API during testing so that we can perform assertions without having to worry about the impurity.

### Scaling our application

In the example above, we've made a simple model that can fetch posts from an API and set the posts in state. However, as we build out our application, we'll be creating many models that serve different purposes, for example, there'll be a model to control the authentication and user logic and another model to allow the user to create a new post. If we limited ourselves to one model to do all of these things, we'd struggle to keep track of everything.

To solve this scaling problem, Helix models support so called "Nested" models.

```javascript
// Top Level Application Model
{
  state: {},
  models: {
    posts: postsModel,
    newPost: newPostModel,
    user: userModel,
    alert: alertModel,
  },
}
```

We've changed our application model to include a `models` key where we have "nested" our posts model alongside some others. We need to change our posts model to use the new nesting:

```javascript
// Posts Model
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
      actions.posts.receivePosts(posts)
    },
  },
}
```

If you have a keen eye, you'll notice the only difference is where we call `receivePosts` in the effect. We need to reach further into actions as we've namespaced the "Posts" model under a `posts` key. Similarly, our state will be namespaced, so if we want to use posts from state, we need to access them under `state.posts.posts`. Essentially, state and actions for nested models get merged together under the key provided in `models`.

There's no limit to how much nesting you can do with Helix, and when pairing with Typescript, you can get full type safety.

### Scaling effects

When we scale our application to include other models, we can use effects to our advantage. Unlike reducers, effects are considered global, and they are able to use the state and actions from all over our application, much like pages can.

```javascript
// Posts Model
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
      actions.posts.receivePosts(posts)
      actions.alert.showSuccess('Posts Loaded')
      return 'All done'
    },
  },
}
```

You'll notice that when we `requestPosts`, we can show an alert to the user to let them know that the posts have loaded, we're reaching in to other models.

Effects don't need to return anything by design (as in, the return of an effect is never used internally by Helix), however, should you return anything from an effect, the callee will receive it. For example:

```javascript
const message = await actions.posts.requestPosts()
console.log(message) // 'All done'
```

# Scoped Models

There are two types of model in Helix, one being a "Standard" model and the other a "Scoped" model. All the models we've made so far have been of the "Standard" type. The main difference between the two is that a "Scoped" model is designed to be reused in multiple situations in an application. For example, we will be creating a "Form" model for our blog application that will be reused in the "Login" and "Create Post" pages.

```javascript
// Form Model
export function form(emptyForm) {
  return {
    scoped: true,
    state: emptyForm,
    reducers: {
      reset() {
        return emptyForm
      }
      setForm(state, form) {
        return form
      },
      setField(state, { key, value }) {
        return {
          [key]: value,
        }
      },
    },
    effects: {
      async submit(state, actions, endpoint) {
        await api.post(endpoint, state)
        actions.reset()
      }
    },
  }
}
```

The form model can manage the state of form fields, including a call to the API, so let's use it in our "Login" model:

```javascript
// Login Model
{
  state: {},
  reducers: {},
  effects: {},
  models: {
    form: form({ username: '', password: '' })
  }
}

// Create Post Model
{
  state: {},
  reducers: {},
  effects: {},
  models: {
    form: form({ title: '', body: '', excerpt: '' })
  }
}
```

The only difference between "Standard" and "Scoped" models, is that effects in "Scoped" models can only use state and actions from the scoped model. If this wasn't the case, we wouldn't be able to reset our form in the `submit` effect in the form model, as the form model wouldn't know whether to reset the "Login" or "Create Post" form.