import { useState, useEffect } from 'react'
import Person from './components/Person';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import personService from './services/persons'
const App = () => {


  // states initialisation
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchFilter, setSearchFilter] = useState('')


  // effect call
  useEffect(() => {
    console.log('effect')
     personService
     .getAll()
     .then(returnedPersons => {
      setPersons( returnedPersons)
     })
  }, [])



  // console to show : before exec of useeffcet , start of exec , and after 
  console.log('render', persons.length, 'persons')


  // event handlers
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchFilterChange = (event) => setSearchFilter(event.target.value)
  const handleDelete = (id) => {
  const person = persons.find(p => p.id === id)
  if (window.confirm(`Delete ${person.name}?`)) {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
  }
}



  // form submission event handler 
  const addPerson = (event) => {
  event.preventDefault()
  
  const existingPerson = persons.find(person => person.name === newName)
  
  if (existingPerson) {
    // Person already exists - ask to update
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const changedPerson = { ...existingPerson, number: newNumber }
      
      personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => 
            person.id !== existingPerson.id ? person : returnedPerson
          ))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          alert(`The person '${existingPerson.name}' was already deleted from server`)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
    }
  } else {
    // New person - add to phonebook
    const newPersonObject = { name: newName, number: newNumber }
    
    personService
      .create(newPersonObject)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.log("creation failed")
      })
  }
}



// checking persons to show 
const personsToShow = searchFilter === ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(searchFilter.toLowerCase())
    )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter searchFilter={searchFilter} handleSearchFilterChange={handleSearchFilterChange} />

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => <Person key={person.id} person={person} handleDelete={handleDelete}/>)}
      </ul>
    </div>
  )
}

export default App