require('dotenv').config()

const PRODUCTION_ENV = process.env.NODE_ENV === 'production'
const DEVELOPMENT_ENV = !PRODUCTION_ENV

const APP_NAME = 'members-only'
const PORT = process.env.PORT || 3000

const { CLUB_PASSWORD } = process.env

const { MONGODB_URL = 'mongodb://localhost:27017/members_only' } = process.env
const MONGODB_OPTS = { useUnifiedTopology: true, useNewUrlParser: true }

const ON_RENDER_HOSTING = process.env.ON_RENDER_HOSTING || false

const { COOKIE_SIGN_KEY } = process.env

const SESSION_DB_NAME = 'sessions'
const SESSION_COOKIE_NAME = `${PRODUCTION_ENV ? '__Host-' : ''}sessionid`
const SESSION_COOKIE_SAME_SITE = 'lax'
const SESSION_COOKIE_MAX_AGE = 8 * 60 * 60 * 1000 // 8 hours

const CSRF_COOKIE_NAME = `${PRODUCTION_ENV ? '__Host-' : ''}csrf`
const CSRF_COOKIE_SAME_SITE = 'lax'
const CSRF_TOKEN_MAX_AGE = 8 * 60 * 60 * 1000 // 8 hours

const FLASH_MSG_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
}

module.exports = {
  APP_NAME,
  PORT,

  PRODUCTION_ENV,
  DEVELOPMENT_ENV,

  MONGODB_URL,
  MONGODB_OPTS,

  CLUB_PASSWORD,

  ON_RENDER_HOSTING,

  COOKIE_SIGN_KEY,

  SESSION_DB_NAME,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_SAME_SITE,
  SESSION_COOKIE_MAX_AGE,

  CSRF_COOKIE_NAME,
  CSRF_COOKIE_SAME_SITE,
  CSRF_TOKEN_MAX_AGE,

  FLASH_MSG_TYPE,
}
