function promisify(fn, { multi = false } = {}) {
  const wrappedFnName = `${fn.name}Promisified`
  const fnWrapped = {
    async [wrappedFnName](...args) {
      return new Promise((resolve, reject) => {
        const cb = (e, ...results) => {
          if (e) return reject(e)
          resolve(multi ? results : results[0])
        }

        fn.call(this, ...args, cb)
      })
    },
  }

  return fnWrapped[wrappedFnName]
}

module.exports = { promisify }
