# State

In Twine, there's a single state object that makes up the entire application. For the purposes of our blog application, we'll store a list of posts in a JavaScript array.

```javascript
import helix from 'helix-js'

helix({
  model: {
    state: {
      posts: []
    }
  },
  component: console.log,
  render: console.log
})
```
