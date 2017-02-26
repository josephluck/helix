export default function walk (obj, fn) {
  return Object.keys(obj).map(key => {
    return {
      [key]: fn(obj[key]),
    }
  }).reduce((prev, curr) => {
    return Object.assign({}, prev, curr)
  }, {})
}
