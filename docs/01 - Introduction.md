# Introduction

Helix provides provides an architecture that allows front-end developers to build robust, predictable, rich client side applications. It's not prescriptive about how views are rendered, but provides the glue between routing, state and rendering.

Created by Joseph Luck and the good folks at Goodlord.

# Omakase

Helix is made up of the following pieces:

- Router
- State management
- Renderer

Helix supports rendering to any front-end UI framework, be it React, Vue, jQuery, or vanilla DOM. The core of Helix is under `10kb` gzipped, and when paired with a light-weight view library like `yo-yo`, it's around `40kb`. For comparison, React + Redux is `139kb` at the time of writing.

# Motivation

Helix was born out of a frustration with fragmented UI code bases and ever increasing complexity in the front-end framework landscape.

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

Typescript's ability to provide confidence in ui codebases is formidable. Developers building apps with Helix should seriously consider Typescript with official typings for state management and views.

### Elm

Elm programs are typically very easy to navigate and reason about, leading to a very efficient developer workflow. Elm popularized the "Elm Architecture" which Helix's state management is inspired by.

As an aside, Elm's developer experience is second to none; Helix aims to be as helpful as it can when paired with Typescript.

### Redux

Redux showed the front-end community that state management need not be complex, and that one global state store for the entire application is okay. Helix shares the same philosophy in this regard, with a single state atom to control the entire application, and pure reducers to modify state. Helix differs in that it provides first-class support for side-effects.

### Cycle

Cycle allows front-end developers to represent applications as pure functions with a clear separation between application logic and side-effects, i.e. rendering. This means that each part of a cycle application can be tested independently and in isolation. Helix offers the same functional approach to state and views, allowing them to be tested in isolation from one another.

# The gist

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
  setPosts (state, posts) {
    return { posts }
  }
}
```

Reducers are pure synchronous functions that receive the current state of the application and any arguments that the reducer needs. Reducers return a copy of the state with any changes applied. When a reducer is called, the application is re-rendered with the new state.

### Interface

A user interface is essential for a web application. The interface both shows the user the current state of the application and provides a mechanism for the user to update the state of the application. We'll use the package `yo-yo` for the following example, but React, Inferno, Preact, Vue, jQuery etc are all supported.

```javascript
import * as html from 'yo-yo'
const component = (state, previousState, actions) => html`
  <div>
    ${state.posts.map(post => html`<span>${post}</span>`)}
  </div>
`
```

Over the course of this documentation, we'll build a simple blog application, where you can register, log in, create posts and create comments.