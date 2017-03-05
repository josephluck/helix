export default function form (state) {
  return {
    state,
    reducers: {
      setField (state, key, value) {
        return {
          [key]: value,
        }
      },
    },
  }
}
