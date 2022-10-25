const express = require('express')
const conf = require('../conf')
const { loginRequired, adminRequired, getObjectOr404Middleware } = require('../core')
const { Post } = require('../models')
const { postValidator } = require('../validators')

const router = express.Router()

router
  .route('/create')
  .get([
    loginRequired,
    (req, res) => {
      res.render('post/form')
    },
  ])
  .post([
    loginRequired,
    postValidator,
    async (req, res) => {
      const { fields } = req.ctx
      if (!fields.valid) return res.render('post/form', { errors: fields.errors })

      const post = await Post.create({ ...fields.values, user: req.user })

      req.flash(conf.FLASH_MSG_TYPE.SUCCESS, 'post created')

      return res.redirect(`/#${post.id.toString()}`)
    },
  ])

router
  .route('/:id/delete')
  .get([
    adminRequired(),
    getObjectOr404Middleware({ model: Post, obj: 'post' }),
    (req, res) => res.render('post/delete', { post: req.ctx.post }),
  ])
  .post([
    adminRequired(),
    getObjectOr404Middleware({ model: Post, obj: 'post' }),
    async (req, res) => {
      const { post } = req.ctx
      await post.delete()
      req.flash(conf.FLASH_MSG_TYPE.INFO, 'post deleted')
      res.redirect('/')
    },
  ])

module.exports = router
