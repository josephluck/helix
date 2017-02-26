import alert from './alert'
import login from '../pages/login/model'

export default function model () {
  return {
    state: {},
    models: {
      alert: alert(),
      pages: {
        state: {},
        models: {
          login: login(),
        },
      },
    },
  }
}
