// NotificationContext.jsx

import { createContext, useState, useContext } from 'react'

// this is the box itself — starts out not holding anything
const NotificationContext = createContext()

// this component holds the actual text, and wraps around your whole app
// so every component ends up nested inside it and can reach the box
export const NotificationProvider = ({ children }) => {
  const [text, setText] = useState('')

  // this is the function that fills the box, and always pairs it
  // with a 5-second timer that empties it again
  const showNotification = (message) => {
    setText(message)
    setTimeout(() => {
      setText('')
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ text, showNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

// this is how any component or hook reaches into the box
export const useNotification = () => useContext(NotificationContext)