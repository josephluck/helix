import api from '../../api'

function defaultState () {
  return {}
}

export default function model () {
  return {
    scoped: true,
    state: defaultState(),
    reducers: {},
    effects: {},
  }
}
