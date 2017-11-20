# Advanced Usage

To facilitate both large complex applications with lots of models and the ability to share functionality between models, Twine supports a model having a child model. The architecture can seem a little daunting at first, but it's very powerful.

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
    function fetchPostsAndComments () {
      actions.fetchPosts().then(() => {
        actions.comments.fetchComments()
      })
    }
    function renderPost (post) {
      return html`<div>${post}</div>`
    }
    return html`
    	<div>
      	${state.posts.map(renderPost)}
      	<button onclick=${fetchPostsAndComments}>Fetch Posts & Comments</button>
      	${state.comments.comments.map(renderItem)}
      </div>
    `	
  },
  mount
})
```

We've introduced a new property to the first model, `models`. `models` is an object containing one or more keys whose values are other Twine models. We've also chained our original `fetchPosts` effect call with a another effect that fetches the comments.

However, there's too much control flow in the view now. Let's create a new effect that will fetch both posts and comments:

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
    function renderPost (post) {
      return html`<div>${post}</div>`
    }
    return html`
    	<div>
      	${state.posts.map(renderPost)}
      	<button onclick=${actions.fetchPostsAndComments}>Fetch Posts & Comments</button>
      	${state.comments.comments.map(renderItem)}
      </div>
    `	
  },
  mount
})
```

Now that we've used an effect for the complex control logic, our view is a pure function of state using callbacks to response to user interaction and doesn't hold any state of it's own (i.e. promises).

# Scoped Models & Sharing Logic

Applications often have some state and logic that is reused in different situations. For example, storing, setting, validating and resetting forms. Twine has a concept of a scoped model for exactly this purpose:

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
    scoped: true, // <-- this is the bit that will allow us to use this model in both places
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

So in essence, scoped models reducers and effects can only access state and actions inside of themselves, allowing them to be completely unaware of their location within the model heirarchy. Here's an example of the form model with an effect:

```javascript
function formModel (defaultForm) {
  return {
    scoped: true,
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
        // Note that actions only has the form model's own actions in it, allowing it to be reused again and again.
        actions.resetForm()
      }
    }
  }
}
```
