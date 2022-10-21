const csurf = require('csurf')

const csrfProtect = csurf({
  cookie: false,
  value: req => req.headers['csrf-token'] ?? req.body?.['csrf-token'],
})

module.exports = { csrfProtect }
