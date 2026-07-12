// importing the logger to use info() and error() replacing console.log
const logger = require('./logger')

// middleware to log request method, path, and body for debugging
// runs on every incoming request before route handlers
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

// handler for requests with unknown endpoint
// catches any route that doesn't match the defined ones above
// must be after all routes, before error handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// error handler middleware
// catches errors passed via next(error) from route handlers
// handles CastError (malformed MongoDB id) with 400
// handles ValidationError (schema validation failed) with 400
// passes everything else to the default Express error handler
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  // i should not add validators from eslint if i added it later , they are style ones not runtime errors
  next(error)
}

// replacing the getTokenFrom function from the Routers
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// middleware that identifies which user is making the request,
// based on the token attached by tokenExtractor (request.token)
// attaches the found user to request.user, so routes can just read
// request.user directly instead of repeating this logic themselves
const userExtractor = async (request, response, next) => {
  // decode and verify the token using our secret key
  // if the token is missing, malformed, or tampered with, this throws
  // (Express automatically forwards that error to errorHandler)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  // a valid token should always contain an id — if not, treat it as invalid
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  // look up the actual user document in the database using the id from the token
  const user = await User.findById(decodedToken.id)

  // if no user exists with that id (e.g. user was deleted after token was issued)
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  // attach the found user to the request object
  // so any route using this middleware can access it via request.user
  request.user = user

  // move on to the next middleware/route handler in the chain
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}