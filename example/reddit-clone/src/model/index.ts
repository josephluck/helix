import login from '../pages/login/model'

export default function model () {
  return {
    state: {},
    models: {
      pages: {
        state: {},
        models: {
          login: login(),
        },
      },
    },
  }
}
