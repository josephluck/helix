# Helix Documentation

Through the course of the documentation, you'll be introduced to the three main concepts in Helix:

* [Models](Models)
  * [Reducers](Models/Reducers.md)
  * [Effects](Models/Effects.md)
  * [Nesting](Models/Nesting.md)
  * [Scoping](Models/Scoping.md)
* [Views & Routing](Views)
  * [Defining Routes](Views/Routes.md)
  * [Accessing State and Actions](Views/State-And-Actions.md)
  * [Lifecycle Hooks](Views/Lifecycle-Hooks.md)
  * [Layouts](Views/Layouts.md)
* [Rendering](Rendering.md)

Since Helix can be paired with many view libraries, we won't focus too much on views and components, although it'd be difficult to showcase Helix without it. We'll use [`yo-yo`](https://github.com/maxogden/yo-yo), which is a simple view library that uses [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

We'll be discussing how we might build a simple [blog application](http://helix-blog.surge.sh) using Helix. Take a peek at the [source code](../examples/blog/src) as you follow the concepts.
