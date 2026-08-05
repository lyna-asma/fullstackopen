// Notification.jsx — looks inside the box and shows what's there

import { useNotification } from '../contexts/NotificationContext'

const Notification = () => {
  const { text } = useNotification()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  if (!text) return null

  return <div style={style}>{text}</div>
}

export default Notification