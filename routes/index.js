const homeRoute = require('./home')
const authRoute = require('./auth')
const postRoute = require('./post')

const routes = [
  ['/', homeRoute],
  ['/', authRoute],
  ['/posts', postRoute],
]

module.exports = routes
