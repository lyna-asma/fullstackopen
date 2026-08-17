/*
npx cross-env NODE_ENV=test node --test tests/blog_api.test.js
*/

const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token = null
let testUserId = null

beforeEach(async () => {
  // wipe both collections for a clean slate
  await Blog.deleteMany({})
  await User.deleteMany({})

  // create one test user to own the seeded blogs and to log in as
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'testuser', passwordHash })
  const savedUser = await user.save()
  testUserId = savedUser._id

  // 1 link that user as the creator of every seeded blog
  const blogsWithUser = helper.initialBlogs.map(blog => ({ ...blog, user: savedUser._id }))
  const insertedBlogs = await Blog.insertMany(blogsWithUser)

  // 2 link the blogs back onto the user
  savedUser.blogs = insertedBlogs.map(b => b._id)
  await savedUser.save()

  // log in as this user to get a real, valid token for protected requests
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'sekret' })

  token = loginResponse.body.token
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('blog has creator user info populated', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.user)
    assert.ok(blog.user.username)
  })
})

describe('addition of a new blog', () => {
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Type wars'))
})

test('adding a blog fails with 401 if token is not provided', async () => {
  const newBlog = {
    title: 'No token here',
    author: 'Someone',
    url: 'http://example.com/notoken',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('if likes is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'No likes here',
    author: 'Someone',
    url: 'http://example.com/nolikes',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('deleting a nonexisting blog returns 404', async () => {
  const validNonExistingId = await helper.nonExistingId()

  await api
    .delete(`/api/blogs/${validNonExistingId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
}) 

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'No Title',
    url: 'http://example.com/notitle',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'No URL',
    author: 'No URL Author',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})


})

describe('single blog', () => {
  test('has been successfully deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const ids = blogsAtEnd.map(b => b.id)

    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  test('likes can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedData)
    .expect(200)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
})
})

after(async () => {
  await mongoose.connection.close()
})