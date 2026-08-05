import { createContext, useState, useContext } from 'react'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [text, setText] = useState('')

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

// renamed from useNotification to useNotify, same job: reach into the box
export const useNotify = () => useContext(NotificationContext)