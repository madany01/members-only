const homeRoute = require('./home')
const authRoute = require('./auth')

const routes = [
  ['/', homeRoute],
  ['/', authRoute],
]
module.exports = routes
