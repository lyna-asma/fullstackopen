import { useState } from 'react'

// LoginForm now owns username/password itself - App no longer knows or
// cares what's currently typed into these fields. App only gets involved
// once there's an actual submit, via the handleLogin prop.
const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsername = (event) => setUsername(event.target.value)
  const handlePassword = (event) => setPassword(event.target.value)

  // This is LoginForm's own submit handler. It owns the event now (so it's
  // the one calling preventDefault, not App), and it hands the *values* -
  // not the event - up to App's handleLogin.
  const onSubmit = async (event) => {
    event.preventDefault()
    await handleLogin(username, password)
    // Clear the fields after attempting login - whether it succeeded or
    // failed. If you'd rather keep a failed attempt's values visible so
    // the person can just fix a typo, drop this and only clear on success.
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Login to application</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            username
            <input
              value={username}
              onChange={handleUsername}
              name="username"
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              value={password}
              onChange={handlePassword}
              name="password"
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm