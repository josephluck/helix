# ⚒ Helix

Helix is a batteries-included front-end framework.

Created by [Joseph Luck](http://www.josephluck.co.uk/) and with help from the good folks at [Goodlord](http://www.goodlord.co).

# Motivation

Building complex front-end applications is difficult. As front-end developers, we need to ensure we're deliving not only user-friendly and feature-rich applications, but we do so in a safe and bug-free way.

We've seen recent trends in the front-end space that help front-end developers solve these problems, and the ecosystem is expanding rapidly. Helix attempts to solve these problems with emphasis on building safe applications using ideas from functional programming such as immutable state, explicit side-effects and one-way data flow. As a front-end developer building applications with Helix, you can be confident navigating, understanding and refactoring your code.

# Omakase

Helix is a batteries-included framework that takes care of the following:

- [Routing](https://josephluck.gitbooks.io/helix/Views/)
- [State management](https://josephluck.gitbooks.io/helix/Models/)
- [Rendering](https://josephluck.gitbooks.io/helix/Rendering/Rendering.html)

Helix applications are typically written with Typescript and in paired with React, although you can pair Helix with any view library such as Vue, Preact, Inferno and Yo-yo.

# Why not React + Redux + React Router?

One of the most common questions I get asked is 'Why not use Redux?', and my answer is that you should definitely use Redux if you're happy with it.

Whilst the below my seem like a rant, Redux is an amazingly simple library that popularised many concepts from functional programming such as immutable single-state data structures and pure functions. You should definitely use Redux if you want to use something thats battle-tested with a huge community behind it, however I build Helix to solve some of the gripes I had with Redux and I want to be honest in my reasoning.

The main problem I had was with Redux's dispatcher; Actions in Redux are meant to be serializable for the purpose of time-travel debugging and hot-reloading, but the dispatcher's additional level of indirection introduces a fair amount of side-effects that have introduced patterns such as action constants and action creators. Additionally, when paired with React, the Redux store is connected directly to a react component which makes the react component impure more difficult to test. Of course, there are ways around this such as using redux-mock-store, but it isn't as simple as calling a function as it is with Helix. 

The second problem I had was that it feels cumbersome to scale Redux to a large application whilst maintaining a decent level of safety. For example, it's difficult to know when you dispatch an action what actions are available unless you introduce boilerplate with constants or action creators (as is recommended in the [Redux documentation](https://redux.js.org/docs/faq/Actions.html#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants)). Helix has official Typescript types that allow you to easily see what actions are available through editor auto-completion. 

The third problem was that I found it difficult use the same reducer multiple times. The official pattern to solve this in Redux is to use [string identifiers](https://redux.js.org/docs/recipes/reducers/ReusingReducerLogic.html) to namespace reducers. I always felt hacky modifying strings for this purpose (not to mention that it's particularly difficult to make this type-safe) and often ended up resorting back to local React component state which is considered an anti-pattern. Helix's state management system allows nesting models in one another to build a type-safe tree-like structure containing both State and Actions; models can be reused multiple times without having to use string identifiers.

I originally built the state management library [Twine](http://github.com/ohgoodlord/twine) that Helix uses to solve these gripes before fleshing out Helix. Twine naturally evolved in to Helix to provide a batteries-included framework for building these safe, functional and scalable applications.

Whilst React, Redux and React-router are all amazing tried and tested technologies that have helped front-end developers build rich client-side applications, there's a lot of 'magic' involved using React [higher-order-components](https://reactjs.org/docs/higher-order-components.html) to connect the pieces together, which can lead to confusion and ambiguity.

Helix applications are connected and represented by pure functions and plain ol' JavaScript objects that are easy to reason about and make type-safe. This isn't to say there isn't magic happening under Helix's hood though, for example, Helix listens to the browser's history API for client-side routing and sprinkles some magic in your state-management code for your convenience. If you want to use the most popular and battle tested technologies, definitely combine React with Redux and React Router. Also, the developer experience and debugging tooling such as component hot-reloading and Redux's chrome plugin is first-rate. Helix has a simple console state logger, but doesn't really come close in terms of official tooling.

# Documentation

Since Helix can be paired with many view libraries, the documentation doesn't focus too much on the specifics of the views, although it'd be difficult to showcase Helix without it. The [`yo-yo`](https://github.com/maxogden/yo-yo) library will be used in the examples, which is a simple view library that uses [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/javascript/Reference/Template_literals).

Through the course of the documentation, the three main concepts; models, routes and rendering will be discussed in the context of a simple using Helix (you can [view the blog online here](http://helix-blog.surge.sh)). Take a peek at the [source code](http://github.com/josephluck/helix/tree/master/examples/blog) if you're interested.

# Example

A typical web application will have state, actions that can modify state and a user interface. Let's break it down into these three sections and combine them into a simple application:

### State

State can take any shape, but typically it's an object:

```JavaScript
const state = {
  posts: [
    'Learn Helix',
    'Profit'
  ]
}
```

### Actions

Actions make an application interactive: 

```JavaScript
const reducers = {
  addPost (state, post) {
    return { posts: [...state.posts, post] }
  }
}
```

### Interface

A user interface is essential for a web application. The interface both shows the user the current state of the application and provides a mechanism for the user to update the state of the application. We'll use the package `yo-yo` for the following example, but React, Inferno, Preact, Vue, jQuery etc are all supported.

```JavaScript
import * as html from 'yo-yo'
const component = (state, previousState, actions) => html`
  <div>
    ${state.posts.map(post => html`<span>${post}</span>`)}
    <button onclick=${e => actions.addPost('New Post')}>Add Post</button>
  </div>
`
```

### Altogether now

```JavaScript
import helix from 'helix-js'
import renderer from 'helix-js/src/renderers/yo-yo'

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

Over the course of [the documentation](https://josephluck.gitbooks.io/helix), we'll showcase Helix's architecture by building a simple blog application.