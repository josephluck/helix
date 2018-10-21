# :cyclone: Helix

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
import * as html from 'yo-yo'
import renderer from 'helix-js/src/renderers/yo-yo'

const state = {
  todos: [
    'Learn Helix',
    'Profit'
  ]
}

const reducers = {
  addTodo (state, todo) {
    return { todos: [...state.todos, todo] }
  }
}

const model = { state, reducers }

const component = (state, _previous, actions) => html`
  <div>
    ${state.todos.map(todo => html`<span>${todo}</span>`)}
    <button onclick=${e => actions.addTodo('New Todo')}>Add Todo</button>
  </div>
`

const render = renderer(document.getElementById('root'))

helix({ model, component, render })
```

Over the course of [the documentation](https://josephluck.gitbooks.io/helix), we'll showcase Helix's architecture by building a simple blog application.

# Contributing

## Installation

To run locally, clone this repository and install npm dependencies:

```bash
yarn install
```

You'll also need to install Google Chrome and Java on your machine to run the selenium-based tests.
