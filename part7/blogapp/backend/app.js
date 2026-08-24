// this is to fix DNS issue
require('dns').setServers(['8.8.8.8', '1.1.1.1'])
// some important imports
const express = require('express')
const mongoose = require('mongoose')
// importing the config file for all env variables
const config = require('./utils/config')
// importing the logger to use info() and error() replacing console.log
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
// blogsRouter import to get the route handlers (controller module) of notes instances
const blogsRouter = require('./controllers/blogs')
// userRouter import
const usersRouter = require('./controllers/users')
// loginRouter import
const loginRouter = require('./controllers/login')
// for the dist access
const path = require('path')
// app instance creation
const app = express()

// connect to mongoDB using the url from config module
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })


// json parser middleware for the req.body to be used
app.use(express.json())

// request logger middleware — logs method, path, body for every request (replaces morgan)
app.use(middleware.requestLogger)

// route handlers

// token first
app.use(middleware.tokenExtractor)
// all /api/notes routes are now handled by the notesRouter in controllers/notes.js
app.use('/api/blogs', blogsRouter)

// users router use
app.use('/api/users', usersRouter)

// login router
app.use('/api/login', loginRouter)

// for the E2E tests that require DB access and modification 
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}


console.log('NODE_ENV is:', process.env.NODE_ENV)
// to serve the frontend build files in production mode
// we don t use static middleware to be able to configure the default route to index.html for all unknown routes (for react-router-dom)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist')
  console.log('Serving static files from:', distPath)
  console.log('dist exists:', require('fs').existsSync(distPath))
  console.log('index.html exists:', require('fs').existsSync(path.join(distPath, 'index.html')))

  app.use(express.static(distPath))



  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  })
}
// before the last middleware => unknown endpoint handler (moved to utils/middleware)
app.use(middleware.unknownEndpoint)

// last middleware => error handler (moved to utils/middleware)
app.use(middleware.errorHandler)

// laaast one of all => the built-in error handler from Express ....(no code for it)

module.exports = app