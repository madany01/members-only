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
    maxLength: 64,
  },
  content: {
    type: String,
    required: true,
    maxLength: 512,
  },
  createdAt: { type: Date, default: () => new Date() },
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
