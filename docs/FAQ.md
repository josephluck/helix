# Frequently Asked Questions

### I like the state management, can I use it without the bells and whistles Helix has?

The short answer is, yes you can. Helix uses a companion library called [Twine](http://github.com/ohgoodlord/twine) for its state management. Although there aren't any official bindings for React et al, Twine has a subscriber function that you can use to hook up a view library fairly easily.

### Can I use Helix with React Router?

Yes, if you use Helix in [component](./Views/Component.md) mode you can use Helix with React Router. Bear in mind that you'll struggle to programatically navigate in your effects without passing the `history` object in your action's payload ([relevant reading](https://stackoverflow.com/a/42124328)). If your interest in Helix is for its state management, you should check out [Twine](http://github.com/ohgoodlord/twine) instead.

```javascript
import helix from 'helix-js'
import * as React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

helix({
  model: {
    state: { title: 'Learn Helix' },
    reducers: {
      setTitle: (state, title) => ({ title })
    }
  },
  component: (state, previous, actions) => (
    <Router>
      <Route path="/home" component={(
        <div>
          <Link to="/title">Set Title</Link>
          Hello! {state.title}
        </div>
      )} />
      <Route path="/title" component={(
        <div>
          <Link to="/">Back Home</Link>
          <p>{state.title}</p>
          <input
            value={state.title}
            oninput={e => actions.setTitle(e.target.value)}
          />
        </div>
      )} />
    </Router>
  ),
  render: renderer(mount),
})
```

### Why not use Redux?

One of the most common questions I get asked is 'Why not use Redux?', and my answer is that you should definitely use Redux if it fits your needs.

Redux is an amazingly simple library that popularised many concepts from functional programming such as immutable single-state data structures and pure functions. You should definitely use Redux if you want to use something thats battle-tested with a huge community behind it, however I built Helix to solve some of the gripes I had using Redux and I want to be honest in my reasoning.

Actions in Redux are designed to be serializable for the purpose of time-travel debugging and hot-reloading by using strings to denote the actions intention and an optional payload with action metadata. This a known pattern in software engineering called [event sourcing](https://martinfowler.com/eaaDev/EventSourcing.html). Whilst there are several benefits to event sourcing, normally it's used in parallel or retroactive systems and there are other ways to achive time-travel debugging without the burden of the interface. The event-sourcing additional level of indirection introduced official patterns such as [action constants and action creators](https://redux.js.org/docs/faq/Actions.html#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants), increasing the amount of boilerplate necessary to achive a good level of safety. Helix does not have a dispatcher, but uses functions that the developer defines directly inside plain JavaScript objects complete with official typescript types that provide compile-time type safety. 

The official pattern to reuse reducer logic in Redux is to use [string identifiers](https://redux.js.org/docs/recipes/reducers/ReusingReducerLogic.html) to namespace reducers. When using Typescript, it's difficult to make namespaced reducers type-safe and it's often suggested to use local React component state instead. I feel that the state management system should have first-class support for logic reuse. Helix's state management system is designed with scale and safety in mind, allowing nesting models in a tree-like structure. Models can be reused multiple times in this tree structure with proper isolation and type-safety.

I originally built the state management library [Twine](http://github.com/ohgoodlord/twine) that Helix uses to solve these gripes before fleshing out Helix. Twine naturally evolved in to Helix to provide a batteries-included framework for building these safe, functional and scalable applications.

### Why not React, Redux, React Router?

Whilst React, Redux and React Router are all amazing tried and tested technologies that have helped front-end developers build rich client-side applications, there's a lot of 'magic' involved using React [higher-order-components](https://reactjs.org/docs/higher-order-components.html) and React's context feature to connect the pieces together, which can lead to confusion and ambiguity.

Helix applications are connected and represented by pure functions and plain ol' JavaScript objects that are both safe and easy to understand. This isn't to say there isn't magic happening under Helix's hood though, for example, Helix listens to the browser's history API for client-side routing and sprinkles some magic in your state-management code for your convenience.