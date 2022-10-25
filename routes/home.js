const express = require('express')
const { Post } = require('../models')

const router = express.Router()

router.get('/', async (req, res) => {
  const adminOrMember = !!(req.user?.isAdmin || req.user?.isMember)

  const posts = await Post.find().populate('user')
  res.render('index', { posts, adminOrMember, user: req.user })
})

module.exports = router
