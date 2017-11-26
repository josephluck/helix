# Helix

Helix provides provides an architecture that allows front-end developers to build robust, predictable, rich client side applications. Helix is a thin library that provides the glue between routes, views, state and rendering.

Created by Joseph Luck and the good folks at Goodlord.

# Omakase

Helix is made up of the following pieces:

- Router
- State management
- Renderer

Helix supports rendering to any front-end UI framework, be it React, Vue, jQuery, or vanilla DOM. The core of Helix is under `10kb` gzipped, and when paired with a light-weight view library like `yo-yo`, it's around `40kb`. For comparison, React + Redux is `139kb` at the time of writing.

# Motivation

There's a plethora of front-end frameworks around each solving the same problem in a slightly different way. Helix solves the very same problems, but offers the following:

- Purely functional state, views and components
- 100% type safety when paired with Typescript
- Clean, concise API with little boilerplate
- Only a few, simple concepts to learn

# Purity

Helix is a built around functional programming concepts such as referential transparency and purity. This means that as a developer, you can be confident navigating, understanding and refactoring your code.

Since Helix can be paired with many view libraries, we won't focus too much on the specifics of the HTML, although it'd be difficult to showcase Helix without it. We'll use [`yo-yo`](https://github.com/maxogden/yo-yo) for our examples, which is a simple view library that uses [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

Through the course of the documentation, we will discuss the three main concepts, models, routes and rendering, whilst looking at how we might build a simple [blog application](http://helix-blog.surge.sh) using Helix. Take a peek at the [source code](http://github.com/josephluck/helix/tree/master/examples/blog) as you follow along.
