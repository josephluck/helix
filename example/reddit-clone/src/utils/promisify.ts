export default function promisify (cb) {
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
