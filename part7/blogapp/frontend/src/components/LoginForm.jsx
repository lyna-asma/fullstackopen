import { useState } from 'react'
import styled from 'styled-components'


const Input = styled.input`
  margin: 0.25em 0.5em 0.25em 0;
  padding: 0.4em;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const Button = styled.button`
  background: #4a69bd;
  color: white;
  font-size: 1em;
  padding: 0.4em 1.2em;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #3c58a8;
  }
`

const FormWrapper = styled.div`
  background: #f4f4f4;
  padding: 1.5em;
  border-radius: 6px;
  max-width: 320px;
`

const FieldRow = styled.div`
  margin-bottom: 0.75em;
`

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsername = (event) => setUsername(event.target.value)
  const handlePassword = (event) => setPassword(event.target.value)

  const onSubmit = async (event) => {
    event.preventDefault()
    await handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <FormWrapper>
      <h2>Login to application</h2>
      <form onSubmit={onSubmit}>
        <FieldRow>
          <label>
            username
            <br />
            <Input
              value={username}
              onChange={handleUsername}
              name="username"
            />
          </label>
        </FieldRow>
        <FieldRow>
          <label>
            password
            <br />
            <Input
              value={password}
              onChange={handlePassword}
              name="password"
              type="password"
            />
          </label>
        </FieldRow>
        <Button type="submit">login</Button>
      </form>
    </FormWrapper>
  )
}

export default LoginForm