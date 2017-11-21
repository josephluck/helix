export default function form(state) {
  return {
    state,
    reducers: {
      setForm(state, form) {
        return form
      },
      setField(state, {key, value}) {
        return {
          [key]: value,
        }
      },
    },
  }
}
