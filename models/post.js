const mongoose = require('mongoose')

const { Schema, Types } = mongoose

const postSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxLength: 256,
  },
  content: {
    type: String,
    required: true,
    maxLength: 1024,
  },
  createdAt: { type: Date, default: () => new Date() },
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
