# Scoped Models

There are two types of model in Helix, one being a "Standard" model and the other a "Scoped" model. All the models we've made so far have been of the "Standard" type. The main difference between the two is that a "Scoped" model is designed to be reused in multiple situations in an application. For example, we will be creating a "Form" model for our blog application that will be reused in the "Login" and "Create Post" pages.

```javascript
function form(emptyForm) {
  return {
    scoped: true,
    state: emptyForm,
    reducers: {
      reset() {
        return emptyForm
      }
      setForm(state, form) {
        return form
      },
      setField(state, { key, value }) {
        return {
          [key]: value,
        }
      },
    },
    effects: {
      async submit(state, actions, endpoint) {
        await api.post(endpoint, state)
        actions.reset()
      }
    },
  }
}
```

The form model can manage the state of form fields, including a call to the API, so let's use it in our "Login" model:

```javascript
const loginModel = {
  state: {},
  reducers: {},
  effects: {},
  models: {
    form: form({ username: '', password: '' })
  }
}

const newPostModel = {
  state: {},
  reducers: {},
  effects: {},
  models: {
    form: form({ title: '', body: '', excerpt: '' })
  }
}
```

The only difference between "Standard" and "Scoped" models, is that effects in "Scoped" models can only use state and actions from the scoped model. If this wasn't the case, we wouldn't be able to reset our form in the `submit` effect in the form model, as the form model wouldn't know whether to reset the "Login" or "Create Post" form.