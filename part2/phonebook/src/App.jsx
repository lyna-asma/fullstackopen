import { useState } from 'react'
import Person from './components/Person';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchFilter, setSearchFilter] = useState('')

  const personsToShow = searchFilter === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(searchFilter.toLowerCase())
      )

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchFilterChange = (event) => setSearchFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    if (!persons.find(person => person.name === newName)) {
      setPersons(persons.concat({ name: newName, number: newNumber }))
      setNewName("")
      setNewNumber("")
    } else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={searchFilter} onChange={handleSearchFilterChange} />
      </div>
      <h2>add a new</h2>
      <form>
        <div>name: <input value={newName} onChange={handleNameChange} /></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <div><button type="submit" onClick={addPerson}>add</button></div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => <Person key={person.name} person={person} />)}
      </ul>
    </div>
  )
}

export default App