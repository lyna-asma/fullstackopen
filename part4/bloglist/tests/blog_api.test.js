/*
npx cross-env NODE_ENV=test node --test tests/blog_api.test.js
*/

const { test, after, describe , beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

// wrap our Express app so we can send fake HTTP requests to it
const api = supertest(app)

// runs before EVERY test below — resets the database to a known state
beforeEach(async () => {
  // await = "pause here until deleteMany finishes, then continue"
  await Blog.deleteMany({})

  // await = "pause here until all blogs are inserted, then continue"
  // only once this line finishes does beforeEach itself finish,
  // which is what guarantees each test starts with the same data
  await Blog.insertMany(helper.initialBlogs)
})


test('blogs are returned as json', async () => {
  // await = "send the GET request, and don't move to the next line
  // until the full response has come back"
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  // await = "wait for the GET request to fully complete,
  // then store the result in `response`"
  const response = await api.get('/api/blogs')

  // now that we HAVE the response, check its body length
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})


test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')


  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }

  // await = "send the POST request with newBlog as the body,
  // wait for the full response before continuing"
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // await = "wait until we've fetched the current state of the DB"
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Type wars'))
})


test('if likes is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'No likes here',
    author: 'Someone',
    url: 'http://example.com/nolikes',
    // note: no `likes` field at all
  }

  // await = "wait for the POST to complete, and capture the response
  // directly in `response` (instead of re-fetching afterward)"
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})


test('blog without title is not added', async () => {
  const newBlog = {
    author: 'No Title',
    url: 'http://example.com/notitle',
    likes: 3,
  }

  // await = "wait for the POST request, expect it to be REJECTED with 400"
  await api
    .post('/api/blogs')
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
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

describe('single blog', () =>{
test(' has been successfully deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
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
    .send(updatedData)
    .expect(200)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
})

})
// runs once, after ALL tests in this file have finished
after(async () => {
  // await = "wait for the connection to actually close before
  // letting the process exit"
  await mongoose.connection.close()
})