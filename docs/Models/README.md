# Models

Models are at the heart of Helix. Models are responsible for holding and manipulating the state of a Helix application in a safe and reliable way.

In Helix, there is only one model; a single place to store and control the state of the application. The model is passed in to the [configuration](../Getting-Started.md):

```javascript
import model from './model'

helix({
  model,
})
```

For our blog project, we'll be introducing a few key model concepts; `state`, `reducers`, and `effects` as well as some more advanced concepts such as `nested` and `scoped` models.

We'll start by making a simple model to control the posts in our blog.