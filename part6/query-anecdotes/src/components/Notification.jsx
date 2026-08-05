// Notification.jsx — looks inside the box and shows what's there

import { useNotify } from '../contexts/NotificationContext'

const Notification = () => {
  const { text } = useNotify()

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