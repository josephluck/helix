# Typescript

One of the motivations for Helix was to achieve a 100% typesafe application using Typescript.

### Included types

Helix is released with typings included. Twine is a peer dependency, so the types for models & state are available if you have installed `helix-js`.

### A basic example

The best way to demonstrate the types is via a simple example:

```typescript
import HelixReact from 'helix-react'
import Helix from 'helix-js'
import Twine from 'twine-js'

interface State {
  comments: string[]
}
interface Reducers {
  setComments: Twine.Reducer<Model, State, string[]>
}
interface Effects {
  addNewComment: Twine.Effect0<Model>
}
type Actions = Twine.Actions<Reducers, Effects, {}>
type ModelApi = Twine.ModelApi<State, Actions>
type ModelImpl = Twine.ModelImpl<State, Reducers, Effects, {}>
type Model = Helix.Model<ModelApi>

function model (): ModelImpl {
  return {
    state: {
      comments: [],
    },
    reducers: {
      setComments (state, comments) {
        return { ...state, comments }
      },
    },
    effects: {
      addNewComment (state, actions) {
        return new Promise(resolve => {
          setTimeout(() => {
            const newComments = state.comments.concat('new comment')
            resolve(actions.setComments(newComments))
          }, 1000)
        })
      },
    },
  }
}

const component: Helix.Component<Model> = (state, previous, actions) => {
  return (
    <div>
      <h1>Comments</h1>
      {state.comments.map(comment => <p>{comment}</p>)}
      <button onClick={e => actions.addNewComment()}>Add new comment</button>
    </div>
  )
}

const mount = document.createElement('div')
document.body.appendChild(mount)

HelixReact({
  model: model(),
  component,
  mount,
})
```

### A complex example

The `Twine.Models` type can be used to achieve complete type safety across multiple models. The example below is pretty complex but shows the full capabilities of Helix's type safety in an app with multiple, isolated forms.

```typescript
import HelixReact from 'helix-react'
import Helix from 'helix-js'
import Twine from 'twine-js'

type FormState<F extends any> = F
interface FormReducers<F extends any> {
  resetForm: Twine.ScopedReducer0<FormState<F>>
  setField: Twine.ScopedReducer2<FormState<F>, string, any>
}
type FormActions<F extends any> = Twine.Actions<FormReducers<F>, {}, {}>
type DefaultForm<F> = () => F

function formModel<F extends any>(
  defaultForm: DefaultForm<F>
): Twine.ScopedModel<FormState<F>, FormReducers<F>, {}, {}> {
  return {
    scoped: true,
    state: defaultForm(),
    reducers: {
      resetForm(state) {
        return defaultForm()
      },
      setField(state, key, value) {
        return Object.assign({}, state, {
          [key]: value,
        })
      },
    },
    effects: {},
  }
}

interface Comment {
  name: string
  comment: string
}
interface CommentsLocalState {
  comments: Comment[]
}
interface CommentsState extends CommentsLocalState {
  form: FormState<Comment>
}
interface CommentsReducers {
  setComments: Twine.Reducer<Models, CommentsState, Comment[]>
}
interface CommentsEffects {
  addNewComment: Twine.Effect0<Models>
}
type CommentsLocalActions = Twine.Actions<CommentsReducers, CommentsEffects, {}>

interface CommentsActions extends CommentsLocalActions {
  form: FormActions<Comment>
}
type CommentsModelApi = Twine.ModelApi<CommentsState, CommentsActions>

function commentsModel(): Twine.ModelImpl<CommentsLocalState, CommentsReducers, CommentsEffects, {}> {
  return {
    state: {
      comments: [],
    },
    reducers: {
      setComments(state, comments) {
        return { ...state, comments }
      }
    },
    effects: {
      addNewComment(state, actions) {
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
      }),
    },
  }
}

interface RegisterForm {
  username: string
  password: string
}
interface RegisterLocalState { }
interface RegisterState extends RegisterLocalState {
  form: FormState<RegisterForm>
}
interface RegisterReducers { }
interface RegisterEffects { }
type RegisterLocalActions = Twine.Actions<RegisterReducers, RegisterEffects, {}>

interface RegisterActions extends RegisterLocalActions {
  form: FormActions<RegisterForm>
}
type RegisterModelApi = Twine.ModelApi<RegisterState, RegisterActions>

function registerModel(): Twine.ModelImpl<RegisterLocalState, RegisterReducers, RegisterEffects, {}> {
  return {
    state: {},
    reducers: {},
    effects: {},
    models: {
      form: formModel(() => {
        return {
          username: '',
          password: '',
        }
      }),
    },
  }
}

type Models = Helix.Models<{
  'comments': CommentsModelApi,
  'register': RegisterModelApi,
}>

const component: Helix.Component<Models> = (state, previous, actions) => {
  function renderComment(comment: Comment) {
    return <div><strong>{comment.name}</strong> <i>{comment.comment}</i></div>
  }
  return (
    <div>
      <h1>Comments</h1>
      {state.comments.comments.map(renderComment)}
      <label>
        Name
        <input
          value={state.comments.form.name}
          onInput={(e: any) => actions.comments.form.setField('name', e.target.value)}
        />
      </label>
      <label>
        Comment
        <input
          value={state.comments.form.comment}
          onInput={(e: any) => actions.comments.form.setField('comment', e.target.value)}
        />
      </label>
      <button onClick={actions.comments.addNewComment}>Add Comment</button>
      <hr />
      <h1>Registration</h1>
      <label>
        Username
        <input
          value={state.register.form.username}
          onInput={(e: any) => actions.register.form.setField('username', e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type='password'
          value={state.register.form.password}
          onInput={(e: any) => actions.register.form.setField('password', e.target.value)}
        />
      </label>
      {state.register.form.username} - {state.register.form.password}
    </div>
  )
}

const mount = document.createElement('div')
document.body.appendChild(mount)

HelixReact({
  model: {
    state: {},
    reducers: {},
    effects: {},
    models: {
      comments: commentsModel(),
      register: registerModel(),
    },
  },
  component,
  mount,
})
```
