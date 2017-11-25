# Helix

Helix provides provides an architecture that allows front-end developers to build robust, predictable, rich client side applications. Helix is a thin library that provides the glue between routes, views, state and rendering.

Created by Joseph Luck and the good folks at Goodlord.

You can see an example of Helix [here](http://helix-blog.surge.sh). Take a peek at the [source code](examples/blog/src) and [the docs](docs) too.

# Omakase

Helix is made up of the following pieces:

- Router
- State management
- Renderer

Helix supports rendering to any front-end UI framework, be it React, Vue, jQuery, or vanilla DOM. The core of Helix is under `10kb` gzipped, and when paired with a light-weight view library like `yo-yo`, it's around `40kb`. For comparison, React + Redux is `139kb` at the time of writing.

Since Helix is aimed for use with Typescript, it's common to pair it with React, but for simplicity, we'll be using the [`yo-yo`](https://github.com/maxogden/yo-yo) package in this documentation.

# Motivation

There's a plethora of front-end frameworks around each solving the same problem in a slightly different way. Helix solves the very same problems, but offers the following:

- Purely functional state, views and components
- 100% type safety when paired with Typescript
- Clean, concise API with little boilerplate
- Only a few, simple concepts to learn

# Purity

Helix is a built around functional programming concepts such as referential transparency and purity. This means that as a developer, you can be confident navigating, understanding and refactoring your code.

# Prior art

Helix is inspired by the following languages and packages:

### Typescript

Typescript's ability to provide confidence in front-end codebases is formidable. Developers building apps with Helix should seriously consider Typescript with official typings for state management and views.

### Elm

Elm programs are typically very easy to navigate and reason about, leading to a very efficient developer workflow. Elm popularized the "Elm Architecture" which Helix's state management is inspired by.

Elm's developer experience is second to none; Helix aims to be as helpful as it can when paired with Typescript.

### Redux

Redux showed the front-end community that state management need not be complex, and that one global state store for an entire application is okay. Helix shares the same philosophy, with a single store to hold the application's state, and pure reducers to modify state. Helix differs in that it provides first-class support for side-effects.

### Cycle

Cycle allows front-end developers to represent applications as pure functions with a clear separation between purity and side-effects, i.e. rendering. This means that each part of a cycle application can be tested independently and in isolation. Helix offers the same functional approach to state and views, allowing them to be tested in isolation from one another.

# Example

A typical web application will have state, actions that can modify state and a user interface. Let's break it down into these three sections and combine them into a simple application:

### State

State can take any shape, but typically it's an object:

```javascript
const state = {
  posts: [
    'Learn Helix',
    'Profit'
  ]
}
```

### Actions

Actions make an application interactive: 

```javascript
const reducers = {
  addPost (state, post) {
    return { posts: [...state.posts, post] }
  }
}
```

### Interface

A user interface is essential for a web application. The interface both shows the user the current state of the application and provides a mechanism for the user to update the state of the application. We'll use the package `yo-yo` for the following example, but React, Inferno, Preact, Vue, jQuery etc are all supported.

```javascript
import * as html from 'yo-yo'
const component = (state, previousState, actions) => html`
  <div>
    ${state.posts.map(post => html`<span>${post}</span>`)}
    <button onclick=${e => actions.addPost('New Post')}>Add Post</button>
  </div>
`
```

### Altogether now

```javascript
import helix from 'helix-js'
import renderer from 'helix-yo-yo'

helix({
  model: {
    state: {
      posts: [
        'Learn Helix',
        'Profit'
      ]
    },
    reducers: {
      addPost (state, post) {
        return { posts: [...state.posts, post] }
      }
    },
  },
  component: (state, previousState, actions) => html`
    <div>
      ${state.posts.map(post => html`<span>${post}</span>`)}
      <button onclick=${e => actions.addPost('New Post')}>Add Post</button>
    </div>
  `,
  render: renderer(document.getElementById('root'))
})
```

Over the course of [the documentation](docs), we'll showcase Helix's architecture by building a simple blog application.