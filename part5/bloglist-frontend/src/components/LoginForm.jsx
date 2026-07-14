const LoginForm = ( {handleLogin , password ,handlePassword ,username , handleUsername}) => {

  return (
<form onSubmit={handleLogin} >
  <h2>Login to application</h2>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={handleUsername}
          />
        </label>
      </div>
   <div>
        <label>
          password
          <input
            type="password"
            value={password}
            // event.target is the specific DOM element that triggered the event — in this case, the exact <input> element
            onChange={handlePassword}
          />
        </label>
      </div>
 <button type="submit" >login</button>
</form>
  )
}

export default LoginForm