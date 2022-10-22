/* eslint-disable func-names */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const { Schema } = mongoose

async function verifyCredentials(username, password) {
  const user = await this.findOne({ username })

  if (!user) return { cause: { username: 'username not found' } }

  const passwordsMatch = await bcrypt.compare(password, user.password)

  if (!passwordsMatch) return { cause: { password: 'wrong password' } }

  return { user }
}

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isMember: {
    type: Boolean,
    default: false,
  },
})

userSchema.static('verifyCredentials', verifyCredentials)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  return next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
