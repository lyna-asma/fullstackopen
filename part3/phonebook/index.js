require('dns').setServers(['8.8.8.8', '1.1.1.1'])
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
// custom us eof morgan instead of using the 'tiny ' style 

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// get all req adapted to mongo
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    console.log(persons)
    response.json(persons)
  })
})

// post req adapted to mongo
app.post('/api/persons', (request, response) => {
  const body = request.body  // extract the JSON body from the request

  // validate — if name or number is missing, return 400 error
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  // create a new Person document using the mongoose model
  const person = new Person({
    name: body.name,
    number: body.number
  })

  // save to MongoDB — returns a promise
  // once saved, send the saved person back as JSON response
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

/*
app.get('/api/persons/:id' , (request,response)=> {
    const id=request.params.id
    const person = persons.find((person)=> person.id === id)

    if (person)
    {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
  const entriesCount = persons.length
  const requestTime = new Date().toString()
  
  response.send(`
    <p>Phonebook has info for ${entriesCount} people</p>
    <p>${requestTime}</p>
  `)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})



*/

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})