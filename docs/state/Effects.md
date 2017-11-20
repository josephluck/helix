# Effects

Effects allow allow asynchronous / complex control flow to be achieved, since they have access to actions. Effects are typically used to communicate with a server and orchestrate complex control flows through your application.

An effect is a function that receives the current state of the entire application and any arguments passed in from the callee. The callee of the effect will recieve whatever the effect returns. The return of an effect is never used internally by Helix, so you're free to return whatever you need to from effects, though it's typical to return a promise so that effects can be chained together when needed.

We'll use an effect to first fetch posts from a fake API and second, set the posts using the reducer we made earlier. 

```javascript
import helix from 'helix-yo-yo'

const mount = document.createElement('div')
document.body.appendChild(mount)

// Let's mock out an asyncronous API request
function getPosts () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        'read docs',
        'learn helix',
        'profit'
      ])
    }, 1000)
  })
}

helix({
  model: {
    state: {
      posts: []
    },
    reducers: {
      setPosts (state, posts) {
        return { posts }
      }
    },
    effects: {
      async fetchPosts (state, actions) {
        const posts = state.posts.concat(await getPosts())
        actions.setPosts(posts)
      }
    }
  },
  component (state, previous, actions) {
    function renderPost (post) {
      return html`<span>${post}</span>`
    }
    return html`
      <div>
      	${state.posts.map(renderPost)}
      	<button onclick=${actions.fetchPosts}>Fetch Posts</button>
      </div>
    `	
  },
  mount
})
```

It's important to note that effects receive the application's global state, NOT the current model's state. This differs from reducers. It's an important distinction that allows effects to communicate with other models.

It's easy to see how constructing models using pure functions this way makes testing and composibility really easy.
