const url = require('url')

function loginRequired(req, res, next) {
  if (req.isAuthenticated()) return next()

  req.session.returnTo = url.parse(req.originalUrl).pathname
  res.redirect('/login')
}

module.exports = { loginRequired }
