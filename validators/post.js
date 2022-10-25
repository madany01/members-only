const { body } = require('express-validator')

const { summarize } = require('./utils')

const postValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('post title is required')
    .isLength({ max: 256 })
    .withMessage('max allowed post title is 256'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('post content is required')
    .isLength({ max: 1024 })
    .withMessage('max allowed post content is 1024'),
  summarize(['title', 'content']),
]

module.exports = postValidator
