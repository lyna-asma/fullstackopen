import React from 'react'

const Person = ({person , handleDelete}) => {
  return (
    <div>
 <li > {person.name} {person.number} </li>
 <button onClick={() => handleDelete(person.id)}> delete this person </button>
    </div>

  )
}

export default Person