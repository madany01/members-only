const express = require('express')
const passport = require('passport')
const { promisify, loginRequired } = require('../../core')
const conf = require('../../conf')

const { User } = require('../../models')
const { userValidator } = require('../../validators')
const {
  localStrategy,
  userSerializer,
  userDeserializer,
  authenticate,
  notAuthenticated,
  notMember,
} = require('./utils')

passport.initialize()
passport.use(localStrategy)
passport.serializeUser(userSerializer)
passport.deserializeUser(userDeserializer)

const router = express.Router()

router.use((req, res, next) => {
  const targets = ['logIn', 'login', 'logOut', 'logout']
  targets.forEach(target => {
    req[`${target}Promise`] = promisify(req[target].bind(req))
  })
  return next()
})

router
  .route('/signup')
  .get([
    notAuthenticated({ redirect: false }),
    (req, res) => {
      res.render('auth/signup')
    },
  ])
  .post([
    notAuthenticated({ message: 'you already have an account' }),
    userValidator,
    async (req, res) => {
      const { fields } = req.ctx

      if (!fields.valid)
        return res.render('auth/signup', {
          fields: fields.values,
          errors: fields.errors,
        })

      const user = await User.create({ ...fields.values })

      const returnTo = req.session.pop('returnTo') || '/'

      await req.loginPromise(user)
      req.flash(conf.FLASH_MSG_TYPE.SUCCESS, `Hello ${user.username}`)
      res.redirect(returnTo)
    },
  ])

router.post('/logout', async (req, res) => {
  await req.logoutPromise()
  res.redirect('/')
})

router
  .route('/login')
  .get([
    notAuthenticated({ redirect: false }),
    (req, res) => {
      res.render('auth/login')
    },
  ])
  .post([
    notAuthenticated(),
    async (req, res) => {
      const { user, cause } = await authenticate(req)

      if (!user)
        return res.render('auth/login', {
          fields: { username: req.body.username, password: req.body.password },
          errors: cause,
        })

      const returnTo = req.session.pop('returnTo') || '/'
      await req.loginPromise(user)

      res.redirect(returnTo)
    },
  ])

router
  .route('/become-member')
  .get([
    loginRequired,
    notMember({ redirect: false }),
    (req, res) => {
      res.render('auth/join')
    },
  ])
  .post([
    loginRequired,
    notMember(),
    (req, res, next) => {
      const { password } = req.body
      if (password === conf.CLUB_PASSWORD) return next()

      res.render('auth/join', { errors: { password: 'wrong password' } })
    },
    async (req, res) => {
      const { user } = req

      user.isMember = true
      await user.save()

      req.flash(conf.FLASH_MSG_TYPE.SUCCESS, 'congratulations you become one of our members')

      res.redirect('/')
    },
  ])

module.exports = router
