const url = require('url')
const httpError = require('http-errors')

function loginRequired(req, res, next) {
  if (req.isAuthenticated()) return next()

  req.session.returnTo = url.parse(req.originalUrl).pathname
  res.redirect('/login')
}

function adminRequired() {
  return [
    loginRequired,
    (req, res, next) => {
      if (req.user.isAdmin) return next()
      throw httpError(403)
    },
  ]
}

module.exports = { loginRequired, adminRequired }
