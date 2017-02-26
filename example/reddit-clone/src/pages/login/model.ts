export default function model () {
  return {
    scoped: true,
    state: {
      username: 'joseph@example.com',
      password: 'password',
    },
    reducers: {
      setFormField (state, key, value) {
        return {
          ...state,
          [key]: value,
        }
      },
    },
  }
}
