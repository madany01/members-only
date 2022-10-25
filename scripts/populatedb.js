const mongoose = require('mongoose')

const conf = require('../conf')
const { User, Post } = require('../models')
const rawData = require('./data.json')

const usersDoc = {}
const postsDoc = {}

async function deleteUsers() {
  console.log('deleting old users ..')
  await User.deleteMany({})
}

async function deletePosts() {
  console.log('deleting old posts ..')
  await Post.deleteMany({})
}

async function populateUsers(data) {
  console.log('creating new users ..')
  const users = await User.create(data)
  users.forEach(user => (usersDoc[user.username] = user))
}

async function populatePosts(data) {
  console.log('creating new posts ..')

  const posts = await Post.create(
    data.map(post => ({
      ...post,
      user: usersDoc[post.user],
    }))
  )

  posts.map(post => (postsDoc[post.id.toString()] = post))
}
async function main() {
  console.time('⌛ executionTime')

  const deleteDocs = process.argv.slice(2).includes('--delete-docs')

  await Promise.all([
    mongoose.connect(conf.MONGODB_URL, conf.MONGODB_OPTS),
    ...(deleteDocs ? [deletePosts(), deleteUsers()] : []),
  ])

  await populateUsers(rawData.users)

  await populatePosts(rawData.posts)

  console.log('------ users ------')
  Object.values(usersDoc).forEach(d => console.log(d))

  console.log('------ posts ------')
  Object.values(postsDoc).forEach(d => console.log(d))

  await mongoose.connection.close()

  console.timeEnd('⌛ executionTime')
}

main()
