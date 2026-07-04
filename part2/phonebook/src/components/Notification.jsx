import React from 'react'

const Notification = ({ errorMessage }) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (errorMessage === null)
    return null

  return (
    <div style={errorStyle}>
      {errorMessage}
    </div>
  )
}

export default Notification