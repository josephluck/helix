# Helix

Helix provides provides an architecture that allows front-end developers to build robust, predictable, rich client side applications. Helix is a thin library that provides the glue between views, state and rendering.

Created by Joseph Luck and the good folks at Goodlord.

# Omakase

Helix is made up of the following pieces:

- [Routing](https://josephluck.gitbooks.io/helix/Views/)
- [State management](https://josephluck.gitbooks.io/helix/Models/)
- [Rendering](https://josephluck.gitbooks.io/helix/Rendering/Rendering.html)

Helix supports rendering to any front-end UI framework, be it React, Vue, jQuery, or vanilla DOM and works really well with Typescript.

# Motivation

There's a plethora of front-end frameworks around each solving the same problem in a slightly different way. Helix solves the very same problems, but offers the following:

- Purely functional state, views and components
- 100% type safety when paired with Typescript
- Clean, concise API with minimal boilerplate
- Only a few, simple concepts to learn

# Purity

Helix is a built around functional programming concepts such as referential transparency and purity. This means that as a developer, you can be confident navigating, understanding and refactoring your code.

Since Helix can be paired with many view libraries, the documentation doesn't focus too much on the specifics of the HTML, although it'd be difficult to showcase Helix without it. The [`yo-yo`](https://github.com/maxogden/yo-yo) library will be used in the examples, which is a simple view library that uses [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

Through the course of the documentation, the three main concepts; models, routes and rendering will be discussed in the context of a simple [blog application](http://helix-blog.surge.sh) using Helix. Take a peek at the [source code](http://github.com/josephluck/helix/tree/master/examples/blog) as you follow along.
