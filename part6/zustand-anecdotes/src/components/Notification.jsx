import { useNotification } from '../stores/notificationStore'

const Notification = () => {
const notification = useNotification()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

    // don't render anything (or the box) when there's no message
  if (!notification) return null

  return <div style={style}>{notification}</div>
}

export default Notification