const { body } = require('express-validator')
const { User } = require('../models')

const { summarize } = require('./utils')

const usernameRegex = /^[a-z][a-z0-9_-]*$/
const usernameRoleDescription =
  'username can only include letters (from a to z), numbers, hyphens, and underscores. and must begin with a letter. e.g. `abc-123_def`'

const userValidator = [
  body('firstName')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('first name is required')
    .isLength({ max: 128 })
    .withMessage('max first name length is 128'),
  body('lastName')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('last name is required')
    .isLength({ max: 128 })
    .withMessage('max last name length is 128'),
  body('username')
    .notEmpty()
    .withMessage('username is required')
    .bail()
    .matches(usernameRegex)
    .withMessage(`invalid username: ${usernameRoleDescription}`)
    .isLength({ max: 64 })
    .withMessage('username length must be at most 64 characters')
    .bail()
    .custom(async username => {
      if (await User.exists({ username })) throw new Error('username already taken')
    }),
  body('password')
    .notEmpty()
    .withMessage('password must not be empty')
    .isLength({ max: 256 })
    .withMessage('max password length is 256'),
  body('passwordConfirmation')
    .notEmpty()
    .withMessage('password confirmation is required')
    .custom((password2, { req }) => req.body.password === password2)
    .withMessage('passwords did not match'),
  body('isAdmin').default(false).optional().toBoolean(),
  summarize(['firstName', 'lastName', 'username', 'password', 'passwordConfirmation', 'isAdmin']),
]

module.exports = userValidator
