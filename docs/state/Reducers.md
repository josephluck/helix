# Reducers

There's only one way of updating state in Twine and that is through a reducer. 

```javascript
import helix from 'helix-js'

helix({
  model: {
    state: {
      posts: []
    },
    reducers: {
      setPosts (state, posts) {
        return { posts }
      }
    } 
  },
  component: console.log,
  render: console.log
})
```

A reducer is a pure function that receives the state of the current model and any arguments passed in from the callee, and should return a copy of the model's state with the state change applied.

The return value of the reducer is the updated model's state.

```javascript
import helix from 'helix-yo-yo'

const mount = document.createElement('div')
document.body.appendChild(mount)

helix({
  model: {
    state: {
      posts: []
    },
    reducers: {
      setPosts (state, posts) {
        return { posts }
      }
    } 
  },
  component (state, previous, actions) {
    function addPost () {
      actions.setPosts(state.posts.concat(['New Post']))
    }
    function renderPost (post) {
      return html`<span>${post}</span>`
    }
    return html`
    	<div>
      	${state.posts.map(renderPost)}
      	<button onclick=${addPost}>Add Post</button>
      </div>
    `	
  },
  mount
})
```
