// eslint-disable-next-line import/order
const conf = require('./conf')

const path = require('path')

const log = require('debug')(`${conf.APP_NAME}:server`)
const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const httpError = require('http-errors')
const morgan = require('morgan')
const expressLayouts = require('express-ejs-layouts')

const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')

const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')

const passport = require('passport')

const routes = require('./routes')
const { csrfProtect, sessionPopper } = require('./core')

// *** app

const app = express()

app.use((req, res, next) => {
  req.ctx = Object.create(null)
  return next()
})

app.use(morgan('dev'))

// *** production security

if (conf.PRODUCTION_ENV) {
  app.use(helmet())
  app.use(compression())
}

// *** parse cookies and form body

app.use(cookieParser(conf.COOKIE_SIGN_KEY))
app.use(express.urlencoded({ extended: false }))

// *** link to session

app.use(
  session({
    secret: conf.COOKIE_SIGN_KEY,
    saveUninitialized: false,
    resave: false,
    name: conf.SESSION_COOKIE_NAME,
    store: MongoStore.create({
      mongoUrl: conf.MONGODB_URL,
      mongoOptions: conf.MONGODB_OPTS,
      collectionName: conf.SESSION_DB_NAME,
    }),
    cookie: {
      maxAge: conf.SESSION_COOKIE_MAX_AGE,
      sameSite: conf.SESSION_COOKIE_SAME_SITE,
      signed: conf.PRODUCTION_ENV,
      secure: conf.PRODUCTION_ENV,
      httpOnly: conf.PRODUCTION_ENV,
    },
  })
)

app.use((req, res, next) => {
  Object.getPrototypeOf(req.session).pop = sessionPopper(req)
  return next()
})

// *** csrf

app.use(csrfProtect)

// *** public

app.use('/static', express.static('public'))

// *** views

if (conf.DEVELOPMENT_ENV) {
  app.disable('view cache')
}

app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'))
app.set('layout', './layouts/base')
app.set('view engine', 'ejs')

app.use((req, res, next) => {
  res.locals._view = Object.create(null)
  next()
})

app.use((req, res, next) => {
  const getFlashMsgs = () => {
    if (!req.session.flash) return null

    const messages = {}

    Object.entries(req.flash()).forEach(([type, msgs]) => {
      if (msgs.length) messages[type] = msgs
    })

    return Object.keys(messages).length ? messages : null
  }

  let messages = null

  res.locals._view.hasMessages = () => {
    messages = getFlashMsgs()
    return Boolean(messages)
  }

  res.locals._view.getMessages = () => {
    messages = messages ?? getFlashMsgs()
    return messages
  }

  return next()
})

app.use((req, res, next) => {
  let csrf = null

  res.locals._view.getCSRF = () => {
    if (!csrf) csrf = req.csrfToken()
    return csrf
  }
  next()
})

// *** flash messages

app.use(flash())

// *** passport session link

app.use(passport.authenticate('session')) // same as app.use(passport.session())
app.use((req, res, next) => {
  res.locals._view.user = req.user
  next()
})
// *** all routes

routes.forEach(route => app.use(...route))

// *** errors

app.use((req, res, next) => next(httpError(404)))

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err)

  if (conf.DEVELOPMENT_ENV) {
    return res.status(err.status || 500).render('error', { serverError: err })
  }

  if (httpError.isHttpError(err))
    return res.status(err.status).render('error', {
      serverError: {
        status: err.status,
        message: httpError(err.status).message,
      },
    })

  res.status(500).render('error', { serverError: { status: 500, messages: '500' } })
})

// *** connect to db and listen

mongoose
  .connect(conf.MONGODB_URL, conf.MONGODB_OPTS)
  .then(() => log(`connection to mongodb established`))
  .catch(e => {
    console.error('failed to connect to mongodb:')
    console.error(e)
    process.exit(1)
  })

app.listen(conf.PORT, () => {
  log(`⭐ Listening on http://localhost:${conf.PORT}/`)
})
