const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})


// POST new blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })

  //save using async/await instead of .then()/.catch()
  const savedBlog = await blog.save()
  // respond with 201 Created and the saved blog as JSON
  response.status(201).json(savedBlog)
})


// DELETE a blog by id
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// UPDATE a blog by id
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { returnDocument: 'after' }
    /*
    { // to return the new object bcz result would still be holding the old one 
      new: true,
      // to run the validators of mongoDb s Blog schema , otherwise find would skip them 
      runValidators: true, 
      // to avoid conflicts with validators we precise to them tht it s about a query not a document instance operation
      context: 'query' }
      */
  )

  response.json(updatedBlog)
})




module.exports = blogsRouter