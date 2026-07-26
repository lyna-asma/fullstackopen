import styled from 'styled-components'

const Box = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6em;
  padding: 0.9em 1.2em;
  margin-bottom: 1em;
  border-radius: 6px;
  font-size: 1.05em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  background: ${props => (props.$type === 'error' ? '#fdecea' : '#e6f4ea')};
  color: ${props => (props.$type === 'error' ? '#a02c2c' : '#1e7e34')};
  border-left: 4px solid ${props => (props.$type === 'error' ? '#c0392b' : '#27ae60')};
`

const Icon = styled.span`
  font-size: 1.1em;
`

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <Box $type={notification.type}>
      <Icon>{notification.type === 'error' ? '✕' : '✓'}</Icon>
      {notification.message}
    </Box>
  )
}

export default Notification