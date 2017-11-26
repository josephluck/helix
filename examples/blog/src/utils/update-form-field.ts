export default function updateFormField(setField) {
  return function(key: string) {
    return function(e) {
      setField({ key, value: e.target.value })
    }
  }
}
