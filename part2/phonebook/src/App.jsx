import { useState , useEffect } from 'react'
import Person from './components/Person';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import axios from 'axios'
const App = () => {

  // states initialisation
    const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
// effect call
useEffect(() => {
console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })}, [])

      // console to show : before exec of useeffcet , start of exec , and after 
      console.log('render', persons.length, 'persons')


      // event handlers
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchFilterChange = (event) => setSearchFilter(event.target.value)
  // form submission event handler 
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


  // checking persos to show 
  
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
        {personsToShow.map(person => <Person key={person.name} person={person} />)}
      </ul>
    </div>
  )
}

export default App