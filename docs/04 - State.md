# State

Twine provides the state management for Helix apps. This section will refer to Twine rather than Helix.

Twine is a functional state management library akin to `redux`. Using Typescript, it is feasible to achive 100% type safety in both state, state change functions and asynchronous side effect management and control flow functions including pages. Twine provides a `tree` structure using models and it is possible to nest models within models. Twine is heavily inspired by the Elm architecture.

### Models

Models are at the heart of Twine. A model is defined as a combination of state and functions that either synchronously or asynchronously operate on state.

### State

State is defined as any valid javascript object. Note that it doesn't have to be an object literal `{}` but it can be a `number`, `string`, `boolean` etc:

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
### Reducers

Reducers are synchronous functions that are able to change state and trigger a rerender of the application. 

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

A reducer is a pure function that receives the state of the current model, any arguments passed in from the callee, and should return a copy of the model's state with the state change applied. It's important to note that a reducer receives a copy of the current model's state, not the entire application state! This allows reducers to be small, simple and isolated functions.

The callee of the reducer will receive a copy of the updated model's state. For example:

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
      const updatedState = actions.setPosts(state.posts.concat(['New Post']))
      console.log(updatedState)
      // { posts: ['New Post'] }
    }
    return html`
    	<div>
      	${state.posts.map(post => html`<span>${post}</span>`)}
      	<button onclick=${addPost}>Add Post</button>
      </div>
    `	
  },
  mount
})
```

When a reducer is called, a state change is triggered in the application. Helix will pick up on the state change and will re-render the current route with the newly updated state.

### Effects

A Twine effect is a tool that allows asynchronous / complex control flow to be achieved. Twine effects are analogous to `container` components in `react/flux` or plugins like `redux-thunk` or `regux-saga` in `redux`.

```javascript
import helix from 'helix-yo-yo'

const mount = document.createElement('div')
document.body.appendChild(mount)

// Mocked out API call
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
      return html`<div>${post}</div>`
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

An effect is a function that receives the current state of the entire application and any arguments passed in from the callee. The callee of the effect will recieve whatever the effect returns. The return of an effect is never used internally by Helix, and calling an effect only results in a rerender of the application if the effect ultimately calls a reducer. For example:

```javascript
import helix from 'helix-yo-yo'

const mount = document.createElement('div')
document.body.appendChild(mount)

// Mocked out API call
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
      return html`<div>${post}</div>`
    }
    function fetchPosts () {
      actions.fetchPosts().then(newState => console.log(newState))
    }
    return html`
    	<div>
      	${state.posts.map(renderPost)}
      	<button onclick=${fetchPosts}>Fetch Posts</button>
      </div>
    `	
  },
  mount
})
```

It's important to note that effects receive the application's global state, NOT the current model's state. This differs from reducers. It's an important distinction that allows effects to communicate with other models.

### Nested Models

To facilitate both large complex applications with lots of models and the ability to share functionality between models, Twine supports a model having a child model. The architecture can seem a little daunting at first, but it's super simple after a little experience, and gets really useful when paired with Typescript. Consider the following model:

```javascript
import helix from 'helix-yo-yo'

const mount = document.createElement('div')
document.body.appendChild(mount)

// Mocked out API call
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

function getComments () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        'such wow',
        'much profit'
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
        // We've got access to state.comments here, should we need it
        return { posts }
      }
    },
    effects: {
      async fetchPosts (state, actions) {
        // We've got access to state.comments and actions.comments here
        const posts = state.posts.concat(await getPosts())
        actions.setPosts(posts)
      }
    },
    models: {
      comments: {
        state: {
          comments: []
        },
        reducers: {
          setComments (state, comments) {
            return { comments }
          }
        },
        effects: {
          async fetchComments (state, actions) {
            const comments = state.comments.concat(await getComments())
            actions.comments.setComments(comments)
          }
        }
      }
    },
  },
  component (state, previous, actions) {
    function renderItem (post) {
      return html`<div>${post}</div>`
    }
    function fetchPostsAndComments () {
      actions.fetchPosts().then(() => {
        actions.comments.fetchComments()
      })
    }
    return html`
    	<div>
      	${state.posts.map(renderItem)}
      	<button onclick=${fetchPostsAndComments}>Fetch Posts & Comments</button>
      	${state.comments.comments.map(renderItem)}
      </div>
    `	
  },
  mount
})
```

We've introduced a new property to the first model, `models`. `models` is an object containing one or more keys whose values are other Twine models. We've also chained our original `fetchPosts` effect call with a another effect that fetches the comments. Cool huh?

However, there's too much control flow in the view now. Let's create a new effect:

```javascript
import helix from 'helix-yo-yo'

const mount = document.createElement('div')
document.body.appendChild(mount)

// Mocked out API call
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

function getComments () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        'such wow',
        'much profit'
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
        // We've got access to state.comments here
        return { posts }
      }
    },
    effects: {
      async fetchPosts (state, actions) {
        // We've got access to state.comments and actions.comments here
        const posts = state.posts.concat(await getPosts())
        actions.setPosts(posts)
      },
      async fetchPostsAndComments (state, actions) {
        await actions.fetchPosts()
        return actions.comments.fetchComments()
      }
    },
    models: {
      comments: {
        state: {
          comments: []
        },
        reducers: {
          setComments (state, comments) {
            return { comments }
          }
        },
        effects: {
          async fetchComments (state, actions) {
            const comments = state.comments.concat(await getComments())
            actions.comments.setComments(comments)
          }
        }
      }
    },
  },
  component (state, previous, actions) {
    function renderItem (post) {
      return html`<div>${post}</div>`
    }
    return html`
    	<div>
      	${state.posts.map(renderItem)}
      	<button onclick=${actions.fetchPostsAndComments}>Fetch Posts & Comments</button>
      	${state.comments.comments.map(renderItem)}
      </div>
    `	
  },
  mount
})
```

Effects are orchestrators for a Twine application application and should contain complex flows, error handling and any asynchronous logic, leaving views to be a pure function of state using callbacks to response to user interaction.

### Scoped Models & Sharing Logic

Applications often have some model logic that needs to work be shared between other models. For example, form controls. Twine has a concept of a scoped model for exactly this purpose:

```javascript
import helix from 'helix-yo-yo'

const mount = document.createElement('div')
document.body.appendChild(mount)

helix({
  model: {
    state: {},
    reducers: {},
    effects: {},
    models: {
      comments: {
        state: {
          comments: [],
          form: {
            name: '',
            comment: ''
          }
        },
        reducers: {
          setComments (state, comments) {
            return { comments }
          },
          resetForm (state) {
            return Object.assign({}, state, {
              form: {
                name: '',
                comment: ''
              }
            })
          },
          setField (state, key, value) {
            return Object.assign({}, state, {
              form: Object.assign({}, state.form, {
                [key]: value
              })
            })
          }
        },
        effects: {
          addNewComment (state, actions) {
            return new Promise(resolve => {
              setTimeout(() => {
                const newComments = state.comments.comments.concat(state.comments.form)
                actions.comments.setComments(newComments)
                resolve(actions.comments.resetForm())
              }, 1000)
            })
          }
        }
      }
    },
  },
  component (state, previous, actions) {
    function renderComment (comment) {
      return html`<div><strong>${comment.name}</strong> <i>${comment.comment}</i></div>`
    }
    function inputWithLabel (label, value, oninput) {
      return html`
        <label>
          ${label}
          <input
            value=${value}
            oninput=${e => oninput(e.target.value)}
          />
        </label>
      `
    }
    return html`
    	<div>
      	${state.comments.comments.map(renderComment)}
      	${inputWithLabel('Name', state.comments.form.name, val => actions.comments.form.setField('name', val))}
      	${inputWithLabel('Comment', state.comments.form.comment, val => actions.comments.form.setField('comment', val))}
        <button onclick=${actions.comments.addNewComment}>Add Comment</button>
      </div>
    `	
  },
  mount
})
```

The above application looks fairly complex, but we've done a fair few things. We can store the state of form fields to create a new comment, as well as `post` a new comment to the server, followed by resetting the form once everything's done.

If we were to add a registration form to the app, we wouldn't want to write out the form logic again, we'd want to share the logic for managing form fields (namely the `setFields` and `resetForm` reducers and the `form` state). Let's give it a go:

```javascript
import helix from 'helix-yo-yo'

const mount = document.createElement('div')
document.body.appendChild(mount)

function formModel (defaultForm) {
  return {
    scoped: true, // <-- this is the key bit!
    state: defaultForm(),
    reducers: {
      resetForm (state) {
        return defaultForm()
      },
      setField (state, key, value) {
        return Object.assign({}, state, {
          [key]: value
        })
      }
    }
  }
}

helix({
  model: {
    state: {},
    reducers: {},
    effects: {},
    models: {
      comments: {
        state: {
          comments: []
        },
        reducers: {
          setComments (state, comments) {
            return { comments }
          }
        },
        effects: {
          addNewComment (state, actions) {
            return new Promise(resolve => {
              setTimeout(() => {
                const newComments = state.comments.comments.concat(state.comments.form)
                actions.comments.setComments(newComments)
                resolve(actions.comments.form.resetForm())
              }, 1000)
            })
          }
        },
        models: {
          form: formModel(() => {
            return {
              name: '',
              comment: '',
            }
          })
        }
      },
      register: {
        state: {},
        reducers: {},
        effects: {},
        models: {
          form: formModel(() => {
            return {
              username: '',
              password: '',
            }
          })
        }
      }
    },
  },
  component (state, previous, actions) {
    function renderComment (comment) {
      return html`<div><strong>${comment.name}</strong> <i>${comment.comment}</i></div>`
    }
    function inputWithLabel (label, value, oninput) {
      return html`
        <label>
          ${label}
          <input
            value=${value}
            oninput=${e => oninput(e.target.value)}
          />
        </label>
      `
    }
    return html`
    	<div>
        <h1>Comments</h1>
      	${state.comments.comments.map(renderComment)}
      	${inputWithLabel('Name', state.comments.form.name, val => actions.comments.form.setField('name', val))}
      	${inputWithLabel('Comment', state.comments.form.comment, val => actions.comments.form.setField('comment', val))}
        <button onclick=${actions.comments.addNewComment}>Add Comment</button>
        <hr />
        <h1>Registration</h1>
      	${inputWithLabel('Username', state.register.form.username, val => actions.register.form.setField('username', val))}
      	${inputWithLabel('Password', state.register.form.password, val => actions.register.form.setField('password', val))}
        ${state.register.form.username} - ${state.register.form.password}
      </div>
    `	
  },
  mount
})
```

We've completely shared the form model logic between the two different models and if any improvements are made to the form model (such as adding validation), both models will benefit.

So in essence, scoped models reducers and effects can only access state and actions inside of themselves, allowing them to be completely 'unaware' of their location within the model heirarchy. Here's an example of the form model with an effect:

```javascript
function formModel (defaultForm) {
  return {
    scoped: true, // <-- this is the key bit!
    state: defaultForm(),
    reducers: {
      resetForm (state) {
        return {
          ...state,
          form: defaultForm()
        }
      },
      setField (state, key, value) {
        return {
          ...state,
          form: {
            ...state.form,
            [key]: value
          }
        }
      }
    },
    effects: {
      validateAndReset (state, actions) {
        // Note that actions only has the form model's own actions in it.
        actions.resetForm()
      }
    }
  }
}
```

### Best Practices / Tips

- Use scoped models only when you need logic shared across multiple models.
- Don't do much control flow in the view. Use effects instead.
- Don't pass too many arguments to effects.
- Remember that effects can reach into state of other models too, so you don't need to pass many (if any) arguments from the view in the majority of cases.
- URL parameters are the exception to the rule. You should pass these parameters in to effects from the view. If you do not do this, then you may be restricting a effect to be useful in only one page.
