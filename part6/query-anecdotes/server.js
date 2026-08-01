import jsonServer from 'json-server'

const server = jsonServer.create()      // creates a new server instance
const router = jsonServer.router('db.json')  // this handles all the normal GET/POST/PUT/DELETE for db.json, same as the plain json-server command does
const middlewares = jsonServer.defaults()    // default settings: logging, CORS, static file serving, etc.

const validator = (request, response, next) => {
  console.log()

  const { content } = request.body

  if (request.method === 'POST' && (!content || content.length < 5)) {
    return response.status(400).json({
      error: 'too short anecdote, must have length 5 or more',
    })
  } else {
    next()
  }
}
// .use() registers each of these to run in order for every incoming request.
server.use(middlewares)
server.use(jsonServer.bodyParser)   // parses incoming JSON request bodies into request.body
server.use(validator)               //  custom check runs here, before requests hit the router
server.use(router)                  // the actual GET/POST/PUT/DELETE handlers

server.listen(3001, () => {
  console.log('JSON Server is running')
})