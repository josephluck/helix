# State

Twine provides the state management for Helix apps. This section will refer to Twine rather than Helix.

Twine is a functional state management library akin to `redux`. Using Typescript, it is feasible to achive 100% type safety in both state, state change functions and asynchronous side effect management and control flow functions including pages. Twine provides a `tree` structure using models and it is possible to nest models within models. Twine is heavily inspired by the Elm architecture.

In the following sections, we'll build a simple blog application.

* [Models](Models.md)
* [State](State.md)
* [Reducers](Reducers.md)
* [Effects](Effects.md)
* [Advanced Usage](AdvancedUsage.md)