# Reusing Model Logic

There are two types of model in Helix, one being a "Standard" model and the other a "Scoped" model. All the models we've made so far have been of the "Standard" type. The main difference between the two is that a "Scoped" model is designed to be reused in multiple situations in an application. For example, we will be creating a "Form" model for our blog application that will be reused in the "Login" and "Create Post" pages.

```typescript
type State<F> = F

interface Reducers<F> {
  setForm: Helix.Reducer<State<F>, F>
  setField: Helix.Reducer<State<F>, { key: keyof F; value: F[keyof F] }>
}

interface Effects<F> {
  submit: Helix.Effect<State<F>, Actions<F>, string>
}

type Actions<F> = Helix.Actions<Reducers<F>, Effects<F>>

function form<F>(defaultForm: F): Helix.Model<State<F>, Reducers<F>, Effects<F>> {
  return {
    state: defaultForm,
    reducers: {
      setForm(state, form) {
        return form
      },
      setField(state, { key, value }) {
        return {
          [key]: value,
        } as Partial<F>
      }
    },
    effects: {
      async submit(state, actions, endpoint) {
        await api.post(endpoint, state)
        actions.reset()
      }
    }
  }
}
```

You can see from the use of the `F` generic that we've created a general purpose model that can be configured with many different form fields.

The form model can manage the state of form fields, including a call to the API. Let's use it in our "Login" model and our "New Post" model:

```javascript
const model = {
  state: {},
  reducers: {},
  effects: {},
  models: {
    loginForm: form({ username: '', password: '' }),
    newPostForm: form({ title: '', body: '', excerpt: '' }),
  }
}
```

The only difference between "Standard" and "Scoped" models, is that effects in "Scoped" models can only use state and actions from the scoped model. If this wasn't the case, we wouldn't be able to reset our form in the `submit` effect in the form model, as the form model wouldn't know whether to reset the "Login" or "Create Post" form.

### Types

There's only one subtle difference to making "Scoped" models typesafe. Instead of effects receiving global state and global actions, they only receive state and actions from the scoped model itself. So instead of passing in `GlobalState` and `GlobalActions` from the top level application model types to effects, simply pass in `State` and `Actions` from the within the scoped model:

```typescript
type State<F> = F

interface Reducers<F> {
  setForm: Helix.Reducer<State<F>, F>
  setField: Helix.Reducer<State<F>, { key: keyof F; value: F[keyof F] }>
}

interface Effects<F> {
  submit: Helix.Effect<State<F>, Actions<F>, string>
}

type Actions<F> = Helix.Actions<Reducers<F>, Effects<F>>

function form<F>(state: F): Helix.Model<State<F>, Reducers<F>, Effects<F>> {
  return {...}
}
```

So this may looks super complex as we're passing this `F` generic all over the place, however the power we get here is huge. For example, if we create a form model with the `F` defined as follows:

```typescript
interface Fields {
  name: string
  phone: number
}

const formModel = form<Fields>({ name: 'Chloe', phone: '01234567890' })
```

We receive an error since we have a type mismatch in the default form:

```
Argument of type '{ name: string; phone: string; }' is not assignable to parameter of type 'Fields'.
Types of property 'phone' are incompatible.
Type 'string' is not assignable to type 'number'.
```

Similarly, if I try and set a property on the form that isn't in our `Fields` interface:

```typescript
actions.loginForm.setField({ key: 'nickname', value: 'Chlo' })
```

We receive an error since we've tried to set a key that is not in our form definition:

```
Argument of type '{ key: "nickname"; value: string; }' is not assignable to parameter of type '{ key: "name" | "phone"; value: string | number; }'.
Types of property 'key' are incompatible.
Type '"nickname"' is not assignable to type '"name" | "phone"'.
```
