const { Strategy: LocalStrategy } = require('passport-local')
const passport = require('passport')

const conf = require('../../conf')
const { promisify } = require('../../core')
const { User, VERIFICATION_FLAGS } = require('../../models')

const localStrategy = new LocalStrategy(async (username, password, done) => {
  const { user, cause } = await User.verifyCredentials(username, password)
  if (!user) return done(null, false, cause)
  return done(null, user)
})

const userSerializer = (user, cb) => {
  cb(null, user.id.toString())
}

const userDeserializer = async (id, cb) => {
  try {
    const user = await User.findById(id)
    cb(null, user)
  } catch (e) {
    cb(e)
  }
}

async function authenticate(req) {
  let resolver = null
  let rejector = null

  const cb = (e, user, cause) => {
    if (e) return rejector(e)
    if (!user) return resolver({ cause })

    resolver({ user })
  }

  passport.authenticate('local', cb)(req)

  return new Promise((resolve, reject) => {
    resolver = resolve
    rejector = reject
  })
}

function notAuthenticated({ message = 'you already logged in', redirect = true } = {}) {
  return (req, res, next) => {
    if (!req.isAuthenticated()) return next()

    req.flash(conf.FLASH_MSG_TYPE.ERROR, message)

    if (!redirect) return next()

    return res.redirect(req.session.pop('returnTo') || '/')
  }
}

function notMember({ redirect = true } = {}) {
  return (req, res, next) => {
    const { user } = req

    if (!(user.isMember || user.isAdmin)) return next()

    const msg = user.isMember ? 'you already have a membership' : "admins don't need a membership"
    req.flash(conf.FLASH_MSG_TYPE.INFO, msg)

    if (redirect) return res.redirect('/')

    return next()
  }
}

module.exports = {
  localStrategy,
  userSerializer,
  userDeserializer,
  authenticate,
  notAuthenticated,
  notMember,
}
