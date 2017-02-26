function walk (obj, fn) {
  return Object.keys(obj).map(key => {
    return {
      [key]: fn(obj[key]),
    }
  }).reduce((prev, curr) => {
    return Object.assign({}, prev, curr)
  }, {})
}

function promisify (cb) {
  return function (...args: any[]) {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        let response = cb(...args)
        if (response instanceof Error) {
          reject(response)
        }
        resolve(response)
      }, 1000)
    })
  }
}

function user () {
  return {
    username: 'joseph@example.com',
    name: 'Joseph Luck',
  }
}

const methods = {
  login (username, password) {
    if (username === 'joseph@example.com' && password === 'password') {
      return user()
    }
    return new Error('Incorrect credentials')
  },
}
const api = walk(methods, promisify)

export default api
