import { create } from 'zustand'

// keeps track of the current timer so a new notification can cancel an old one
let timeoutId = null

const useNotificationStore = create((set) => ({
  notification: '',
  actions: {
    setNotification: (message) => {
      set({ notification: message })

      // if a previous notification's timer is still running, cancel it
      // (otherwise two quick actions could have the first timer clear the second message early)
      if (timeoutId) clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        set({ notification: '' })
      }, 5000)
    }
  }
}))

export const useNotification = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)

export default useNotificationStore