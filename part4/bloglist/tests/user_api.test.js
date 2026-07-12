const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('user creation', () => {
    // delete all users before testing , then seed the root user
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  // POST request tests
  
  test('fails with 400 if username is missing', async () => {
    const newUser = { name: 'No Username', password: 'validpass' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('username and password are required'))
  })

  test('fails with 400 if password is missing', async () => {
    const newUser = { username: 'nouserpass', name: 'No Password' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('username and password are required'))
  })

  test('fails with 400 if username is too short', async () => {
    const newUser = { username: 'ab', name: 'Short Username', password: 'validpass' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('at least 3 characters'))
  })

  test('fails with 400 if password is too short', async () => {
    const newUser = { username: 'validusername', name: 'Short Password', password: 'ab' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('at least 3 characters'))
  })

  test('fails with 400 if username is not unique', async () => {
    const newUser = { username: 'root', name: 'Duplicate', password: 'validpass' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('unique'))
  })
})

after(async () => {
  await mongoose.connection.close()
})