import api from '../../api'

function defaultState () {
  return {}
}

export default function model () {
  return {
    state: defaultState(),
    reducers: {},
    effects: {},
  }
}
