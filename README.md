# ⚒ Helix

Helix is a batteries-included front-end framework designed with Typescript in mind.

Created by [Joseph Luck](http://www.josephluck.co.uk/) and with help from the good folks at [Goodlord](http://www.goodlord.co).

# Motivation

Building complex front-end applications is difficult. As front-end developers, we need to ensure we're deliving not only user-friendly and feature-rich applications, but we do so in a safe and bug-free way.

We've seen recent trends in the front-end space that help front-end developers solve these problems, and the ecosystem is expanding rapidly. Helix attempts to solve these problems with emphasis on building safe applications using ideas from functional programming such as immutable state, explicit side-effects and one-way data flow. As a front-end developer building applications with Helix, you can be confident navigating, understanding and refactoring your code.

# Documentation

Helix was designed with Typescript in mind. Whilst it's certainly possible to build a Helix application without Typescript, it's not recommended. All of the examples in the documentation are written in Typescript.

- [Routing](https://josephluck.gitbooks.io/helix/Views/)
- [State management](https://josephluck.gitbooks.io/helix/Models/)
- [Rendering](https://josephluck.gitbooks.io/helix/Rendering/Rendering.html)

Since Helix can be paired with many view libraries, the documentation doesn't focus too much on the specifics of the views, although it'd be difficult to showcase Helix without it. The [`yo-yo`](https://github.com/maxogden/yo-yo) library will be used in the examples, which is a simple library that uses [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/javascript/Reference/Template_literals) to represent HTML in Javascript.

Through the course of the documentation, the three main concepts; models, routes and rendering will be discussed in the context of a simple blog application using Helix (you can [view the blog application online here](http://helix-blog.surge.sh)). Take a peek at the [source code](http://github.com/josephluck/helix/tree/master/examples/blog) if you're interested.

# Example

A Helix application is made up of three pieces: state, actions that can modify state and a user interface. Let's break it down and combine them into a simple application:

### State

State can take any shape, but typically it's an object:

```JavaScript
const state = {
  todos: [
    'Learn Helix',
    'Profit'
  ]
}
```

### Actions

Actions make an application interactive: 

```JavaScript
const reducers = {
  addTodo (state, todo) {
    return { todos: [...state.todos, todo] }
  }
}
```

### Interface

A user interface is essential for a web application. The interface both shows the user the current state of the application and provides a mechanism for the user to update the state of the application. We'll use the package `yo-yo` for the following example, but React, Inferno, Preact, Vue, jQuery etc are all supported.

```JavaScript
import * as html from 'yo-yo'
const component = (state, previousState, actions) => html`
  <div>
    ${state.todos.map(todo => html`<span>${todo}</span>`)}
    <button onclick=${e => actions.addTodo('New Todo')}>Add Todo</button>
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
      todos: [
        'Learn Helix',
        'Profit'
      ]
    },
    reducers: {
      addTodo (state, todo) {
        return { todos: [...state.todos, todo] }
      }
    },
  },
  component: (state, previousState, actions) => html`
    <div>
      ${state.todos.map(todo => html`<span>${todo}</span>`)}
      <button onclick=${e => actions.addTodo('New Todo')}>Add Todo</button>
    </div>
  `,
  render: renderer(document.getElementById('root'))
})
```

Over the course of [the documentation](https://josephluck.gitbooks.io/helix), we'll showcase Helix's architecture by building a simple blog application.

# Comparisons to other libraries

One of the most common questions I get asked is 'Why not use Redux?', and my answer is that you should definitely use this stack if you're happy with it.

Whilst the below may seem like a rant, Redux is an amazingly simple library that popularised many concepts from functional programming such as immutable single-state data structures and pure functions. You should definitely use Redux if you want to use something thats battle-tested with a huge community behind it, however I built Helix to solve some of the gripes I had with Redux and I want to be honest in my reasoning.

The main problem I had was with Redux's dispatcher; Actions in Redux are meant to be serializable for the purpose of time-travel debugging and hot-reloading, but the dispatcher's additional level of indirection introduced patterns such as action constants and action creators, increasing the amount of boilerplate necessary to achive a good level of safety. Additionally, when paired with React, the Redux store is connected directly to a react component which makes the react component impure more difficult to test. Helix is designed with simplicity in mind, using the most common tools in the JavaScript language such as objects and functions. 

The second problem I had was that it feels cumbersome to scale Redux to a large application whilst maintaining a decent level of safety. For example, it's difficult to know when you dispatch an action what actions are available unless you introduce boilerplate with constants or action creators (as is recommended in the [Redux documentation](https://redux.js.org/docs/faq/Actions.html#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants)). Helix has official Typescript types that allow you to easily see what actions are available through editor auto-completion. 

The third problem was that I found it difficult use the same reducer multiple times. The official pattern to solve this in Redux is to use [string identifiers](https://redux.js.org/docs/recipes/reducers/ReusingReducerLogic.html) to namespace reducers. It feels hacky modifying strings for this purpose (not to mention that it's particularly difficult to make these reducers type-safe) and often ended up resorting back to local React component state which is considered an anti-pattern. Helix's state management system is designed with scale and safety in mind; allowing nesting models in one another to build a type-safe tree-like structure; models can be reused multiple times without having to use string identifiers.

I originally built the state management library [Twine](http://github.com/ohgoodlord/twine) that Helix uses to solve these gripes before fleshing out Helix. Twine naturally evolved in to Helix to provide a batteries-included framework for building these safe, functional and scalable applications.

Whilst React, Redux and React Router are all amazing tried and tested technologies that have helped front-end developers build rich client-side applications, there's a lot of 'magic' involved using React [higher-order-components](https://reactjs.org/docs/higher-order-components.html) and React's context feature to connect the pieces together, which can lead to confusion and ambiguity.

Helix applications are connected and represented by pure functions and plain ol' JavaScript objects that are both safe and easy to understand. This isn't to say there isn't magic happening under Helix's hood though, for example, Helix listens to the browser's history API for client-side routing and sprinkles some magic in your state-management code for your convenience. If you want to use the most popular and battle tested technologies, definitely combine React with Redux and React Router.