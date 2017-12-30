# State

The purpose of models in Helix is to store and manipulate the state of an application. At the simplist level, our blog application needs to store a list of blog posts:

```typescript
interface State {
  posts: string[]
}

interface Reducers {}

interface Effects {}

const model: Helix.Model<State, Reducers, Effects> = {
  state: {
    posts: ['Learn Helix']
  }
}
```

You'll notice the `Reducers` and `Effects` generics in the type definition for `Helix.Model`, don't worry, we'll complete these in the following sections.
