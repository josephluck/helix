# Views & Routing

Helix has out-of-the-box support for routing, but Helix can also be used in existing applications using the component option.

In this section we'll be pairing Helix with the [`yo-yo`](https://github.com/maxogden/yo-yo) library for simplicity. We'll focus on the different types of view and some best practises instead of the `yo-yo` library itself. Head over to the [rendering](../Rendering/README.md) section if you want to learn more about pairing Helix with other view libraries.

### `v = f(s)`

Helix is inspired by React's popularization of views being a pure function of state, however Helix takes this idea to the next level by promoting the use of global application state for all of the applications state, no matter how small. In the following examples, you'll notice that there are no stateful components, everything is global.