# State

The purpose of models in Helix is to store and manipulate the state of an application. At the simplist level, our blog application needs to store a list of blog posts:

```javascript
const model = {
  state: {
    posts: ['Learn Helix'],
  }
}
```

### Typescript

Helix was designed with Typescript in mind, let's add some type safety to our state:

```typescript
interface State {
  posts: string[]
}

const model: Helix.Model<State, Reducers, Effects> = {
  state: {
    posts: ['Learn Helix']
  }
}
```

You'll notice `State` and `Effects` being used in `Helix.Model`, don't worry; we'll fill these in later.
