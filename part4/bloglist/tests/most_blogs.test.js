const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  const blogs = [
    { title: "React patterns", author: "Michael Chan", likes: 7 },
    { title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", likes: 5 },
    { title: "Canonical string reduction", author: "Edsger W. Dijkstra", likes: 12 },
    { title: "First class tests", author: "Robert C. Martin", likes: 10 },
    { title: "TDD harms architecture", author: "Robert C. Martin", likes: 0 },
    { title: "Type wars", author: "Robert C. Martin", likes: 2 }
  ]

  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, that author has 1 blog', () => {
    const result = listHelper.mostBlogs([blogs[0]])
    assert.deepStrictEqual(result, { author: 'Michael Chan', blogs: 1 })
  })

  test('of a bigger list returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })
})