const LoginForm = (props) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={props.handleLogin}>
   <div>
         <label>
          username
          <input
            value={props.username}
            onChange={props.handleUsername}
            name="username"
          />
        </label>
   </div>
         <div>
          <label>
          password
          <input
            value={props.password}
            onChange={props.handlePassword}
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