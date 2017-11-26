# State

The purpose of models in Helix is to store and manipulate the state of an application. At the simplist level, our blog application needs to store a list of blog posts:

```javascript
const model = {
  state: {
    posts: ['Learn Helix'],
  }
}
```
