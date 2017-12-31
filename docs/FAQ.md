# Frequently Asked Questions

### Why not use Redux?

One of the most common questions I get asked is 'Why not use Redux?', and my answer is that you should definitely use this Redux if it fits your needs.

Whilst the below may seem like a rant, Redux is an amazingly simple library that popularised many concepts from functional programming such as immutable single-state data structures and pure functions. You should definitely use Redux if you want to use something thats battle-tested with a huge community behind it, however I built Helix to solve some of the gripes I had using Redux and I want to be honest in my reasoning.

Actions in Redux are designed to be serializable for the purpose of time-travel debugging and hot-reloading by using strings to denote the actions intention and an optional payload with action metadata. The dispatcher's additional level of indirection introduced official patterns such as [action constants and action creators](https://redux.js.org/docs/faq/Actions.html#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants), increasing the amount of boilerplate necessary to achive a good level of safety. Helix does not have a dispatcher, but uses functions that the developer defines directly inside plain JavaScript objects. 

The official pattern to reuse reducer logic in Redux is to use [string identifiers](https://redux.js.org/docs/recipes/reducers/ReusingReducerLogic.html) to namespace reducers. When using Typescript, it's difficult to make namespaced reducers type-safe and it's often suggested to use local React component state instead. I feel that the state management system should have first-class support for logic reuse. Helix's state management system is designed with scale and safety in mind, allowing nesting models in a tree-like structure. Models can be reused multiple times without having to use string identifiers.

I originally built the state management library [Twine](http://github.com/ohgoodlord/twine) that Helix uses to solve these gripes before fleshing out Helix. Twine naturally evolved in to Helix to provide a batteries-included framework for building these safe, functional and scalable applications.

### Why not React, Redux, React Router?

Whilst React, Redux and React Router are all amazing tried and tested technologies that have helped front-end developers build rich client-side applications, there's a lot of 'magic' involved using React [higher-order-components](https://reactjs.org/docs/higher-order-components.html) and React's context feature to connect the pieces together, which can lead to confusion and ambiguity.

Helix applications are connected and represented by pure functions and plain ol' JavaScript objects that are both safe and easy to understand. This isn't to say there isn't magic happening under Helix's hood though, for example, Helix listens to the browser's history API for client-side routing and sprinkles some magic in your state-management code for your convenience.