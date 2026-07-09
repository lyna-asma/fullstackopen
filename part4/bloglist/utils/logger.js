// all the console.log into 2 methods, one for logging infos and one for logging errors

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  console.error(...params)
}

module.exports = { info, error }